const KmsWerbrtcHelper = require('./KmsWerbrtcHelper');
const SessionCache = require('../Cache/SessionCache');

class KmsWebrtcMessageHandler {
  constructor() {
    this.kmsWebrtcHelper = new KmsWerbrtcHelper();
  }

  /*
  This function handle the call request from one user and forward this call request to another user 
  */
  handleKmsCallRequest(message, socket) {
    console.log('STEP :- 3 (generate call resquest)');

    const kmsCallRequestToCallee = {
      type: '_KMS_CALL_REQUEST',
      data: {
        meetingId: message.meetingId,
        userId: message.userId,
        userName: message.userName,
      },
    };

    //save the user details in sessionCache
    SessionCache.saveUserDetails(message.meetingId, message.userId, message.userName, message.sdpOffer);

    socket.broadcast.emit('message', kmsCallRequestToCallee);
    console.log('STEP :- 4 (emit call request)');
  }

  /*
  This function handle the call response and create media pipleine,endpoint,generate sdp answer and
  respond to the another user
  */
  async handleKmsCallResponse(message, socket, io) {

    const kmsCallResponse = {
      type: '_KMS_CALL_RESPONSE',
      data: {
        userId: message.userId,
        userName: message.userName,
      }
    }

    if (message.callStatus == 1) {
      //save the user details in sessionCache
      SessionCache.saveUserDetails(message.meetingId, message.userId, message.userName, message.sdpOffer);

      kmsCallResponse.data.id = "accepted";
      kmsCallResponse.data.status = "User accepted the call";

      socket.broadcast.emit('message', kmsCallResponse);

      //INITIALIZE KMS COMMUNICATION (CREATE-PIPELINE,ENDPOINT / CONNECT-ENDPOINT /GENERATESDPANSWER) 
      this.kmsWebrtcHelper.initKMSCommunication(message.meetingId, io);

    } else {
      console.log('***************CALL REJECTED***************');

      kmsCallResponse.data.id = "rejected";
      kmsCallResponse.data.status = "User declined the call"
      socket.broadcast.emit('message', kmsCallResponse);
    }
  }


  /*
    This function is used to handle the iceCandidate comes from each user to the server, and server pass it to the 
    kms and kms add this IceCandidate and generate it own iceCandidate for each user and send back 
    to the respective user 
  */
  handleIceCandidate(message) {
    console.log('STEP : 13/14 (got ice Candidate from users)');

    console.log(`Received IceCandidates From user ${message.userId}`);
    this.kmsWebrtcHelper.addIceCandidateForParticipant(message.meetingId, message.userId, message.iceCandidate);
  }

  /*
    This function is used to release the pipeline, endpoints which are created for the participants
   */
  handleKmsEndCall(message, socket) {
    //this releases the kms allocated resourcese
    this.kmsWebrtcHelper.releaseKMSResources(message.meetingId);
    //this delete resources which are stored into the sessionCache
    SessionCache.cleanupKMSWebRTCData(message.meetingId);

    const endCall = {
      type: '_KMS_CALL_ENDED',
      data: { ...message, message: 'Kms webrtc call ended' },
    };
    socket.broadcast.emit('message', endCall);
  }

}

module.exports = KmsWebrtcMessageHandler;
