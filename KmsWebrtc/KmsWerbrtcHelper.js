const kurento = require('kurento-client');
const SessionCache = require('../Cache/SessionCache');

class KmsWebrtcHelper {

  async initKMSCommunication(meetingId, io) {
    let meetingDetails = SessionCache.getMeetingDetails(meetingId);

    //function is used to create pipeline and create endpoints on KMS server.
    await this.createPipelineAndEndPoints(meetingId);

    //add already gathered ice candidates and add onIceCandidate Listener
    Object.keys(meetingDetails.participants).map((participantId) => {
      this.addIceCandidateListenerForParticipant(meetingId, meetingDetails, participantId, io);
    });

    /* connect caller and callee endpoints to each other */
    Object.keys(meetingDetails.participants).map((fromParticipantId) => {
      Object.keys(meetingDetails.participants).map((toParticipantId) => {

        if (fromParticipantId !== toParticipantId) {
          this.connectEndpoints(meetingDetails.participants[fromParticipantId].webrtcEndpoints,
            meetingDetails.participants[toParticipantId].webrtcEndpoints);
        }

      });
    });


    /*process the offer of users which commes from each user and then generate the sdp 
    answer and send back it to the respective user*/
    Object.keys(meetingDetails.participants).forEach((participantId) => {
      this.generateSdpAnswerForParticipant(meetingDetails, participantId, (error, kmsSdpAnswer) => {

        if (error) {
          console.log(error);
        } else {
          const sdpAnswerToSend = {
            type: '_KMS_SDP_ANSWER',
            data: {
              meetingId: meetingId,
              userId: participantId,
              userName: meetingDetails.participants[participantId].userName,
              sdpAnswer: {
                type: 'answer',
                sdp: kmsSdpAnswer,
              },
            },
          };

          io.to(participantId).emit('message', sdpAnswerToSend);
          console.log(`sdp answer generated for participantId ${participantId} and participantName ${sdpAnswerToSend.data.userName}`);
          console.log('STEP : 10/11 (emit the sdp answer to each users.)');
        }
      },
      );
    });
  }

  //this function is used for establishing the communication between server and kurento media server.
  getKurentoClient(callback) {
    const mediaServerUrl = process.env.KMS_URL;
    kurento(mediaServerUrl, function (error, kurentoClient) {
      if (error) {
        var message = `couldn't find the media server at address ${mediaServerUrl}`;
        callback(message);
      }
      callback(null, kurentoClient);
    });
  }

  //createPipeline() :- this function is used to create the pipeline on kms server.
  async createPipelineAndEndPoints(meetingId, io) {
    console.log('STEP : 7 (get Kurento client , create piepeline, create endpoints');
    let meetingDetails = SessionCache.getMeetingDetails(meetingId);

    return new Promise((resolve, reject) => {
      this.getKurentoClient((error, kurentoClient) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        //creation of pipeline
        kurentoClient.create('MediaPipeline', (error, webrtcPipeline) => {
          if (error || !webrtcPipeline) {
            console.log('Unable to create pipeline :', error);
            reject(error);
          }

          console.log(`Created Webrtc Pipeline with id ${webrtcPipeline.id}`);

          //following function is used to save the mediaPipeline and kurentoClient to the sessionCache 
          SessionCache.setMediaPipeline(meetingId, webrtcPipeline);
          SessionCache.setKurentoClient(meetingId, kurentoClient);


          //following piece of code used to create the endpoints for each user after creating of mediaPipeline.
          let createAllEnpointPromises = Object.keys(meetingDetails.participants).map((participantId) => {
            return this.createEndpoints(participantId, meetingId, webrtcPipeline);
          });
          Promise.all(createAllEnpointPromises).then((values) => {
            resolve();
          });
        });
      });
    });
  }


  //createEndpoints() :- this function is used to create endpoints on the pipeline for each joined user
  createEndpoints(userId, meetingId, webrtcPipeline) {
    return new Promise((resolve, reject) => {
      //creation of endpoints
      webrtcPipeline.create('WebRtcEndpoint', (error, endPoint) => {
        if (error) {
          webrtcPipeline.release();
          console.log(error);
          reject(error);
        }

        //this function used for save the endpoint to the sessionCache
        SessionCache.setUserEndpoints(meetingId, userId, endPoint);
        console.log(`Webrtc Endpoint ${endPoint.id} created for user ${userId}`);
        resolve(endPoint);
      });
    });
  }


  //connectEndpoints() :- this function is used for connecting users endpoints with each others.
  connectEndpoints(endpoint1, endpoint2) {
    console.log('STEP : 8 (connect endpoints)');
    endpoint1.connect(endpoint2, (error) => {
      if (error) {
        console.log('Error in connecting endpoints 0 to 1:', error);
      }
      console.log('Agent : Enpoint is connected');
    });
  }

  /*gathering the IceCandidates and sending those IceCandidate to the respenctive users*/
  addIceCandidateListenerForParticipant(meetingId, meetingDetails, participantId, io) {
    let endPoint = meetingDetails.participants[participantId].webrtcEndpoints;
    let iceCandidateQueue = meetingDetails.participants[participantId].iceCandidateQueue;

    //gathering the IceCandidates
    this.addAlreadyGatheredIceCandidates(endPoint, iceCandidateQueue, participantId);

    //following code is used to send the icecandidate from kms server to the each respective user.
    endPoint.on('OnIceCandidate', (event) => {
      let iceCandidate = kurento.getComplexType('IceCandidate')(event.candidate);

      const candidate = {
        type: '_KMS_ICE_CANDIDATE',
        data: {
          meetingId: meetingId,
          userId: participantId,
          userName: meetingDetails.participants[participantId].userName,
          iceCandidate,
        },
      };
      io.to(participantId).emit('message', candidate);

      console.log('STEP : 17/18/19 (sending ice Candidate KMS to each users)');
    });
  }

  //add iceCandidate to the KMS server which comes from the users
  addAlreadyGatheredIceCandidates(webrtcEndpoint, iceCandidateQueue, userId) {
    if (iceCandidateQueue && iceCandidateQueue.length > 0) {
      while (iceCandidateQueue.length) {
        webrtcEndpoint.addIceCandidate(iceCandidateQueue.shift());
      }
      console.log(`IceCandidates from user ${userId} added to the kms server`);
    }
  }

  /* this function add the iceCandidate to webrtcEndpoints if webrtcEndpoints are not created then
  they are store to the iceCandidate Queue  */
  addIceCandidateForParticipant(meetingId, participantId, iceCandidate) {
    console.log('STEP : 15/16 (add Ice candidate into Endpoints/Icecandidate Queue)');

    iceCandidate = kurento.getComplexType('IceCandidate')(iceCandidate);
    let iceCandidateQueue = SessionCache.getIceCandidateQueueForParticipant(meetingId, participantId);

    const meetingDetails = SessionCache.getMeetingDetails(meetingId);
    let participantEndPoint = meetingDetails.participants[participantId].webrtcEndpoints;

    if (participantEndPoint) {
      participantEndPoint.addIceCandidate(iceCandidate);
    } else {
      iceCandidateQueue.push(iceCandidate);
    }
  }


  /*this function is used to process the sdp offer which are comes from each
  joined user and the send the sdp answer to that user from kms server*/
  generateSdpAnswerForParticipant(meetingDetails, participantId, callback) {
    console.log('STEP : 9 (process offer and generate sdp answer)');
    let endPointForParticipant = meetingDetails.participants[participantId].webrtcEndpoints;
    endPointForParticipant.processOffer(meetingDetails.participants[participantId].sdpOffer.sdp, callback);

    /* gatherCandidate - ask KMS to gather it's ice candidates after processing SDP Offer */
    endPointForParticipant.gatherCandidates((error) => {
      if (error) {
        console.log('Error occur in gathering the ice candidate');
      }
    });
  }

  //releaseKMSResources :- this function is used to release all the kms resources
  releaseKMSResources(meetingId) {
    console.log('**************** CAll END ****************');
    let meetingDetails = SessionCache.getMeetingDetails(meetingId);
    if (meetingDetails.webrtcPipeline) {
      Object.keys(meetingDetails.participants).forEach((participantId) => {
        meetingDetails.participants[participantId].webrtcEndpoints.release();
      });
      meetingDetails.webrtcPipeline.release();
    }
  }
}

module.exports = KmsWebrtcHelper;
