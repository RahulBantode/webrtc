const CommonMessageHandler = require('./CommonMessageHandler'); //It having the handler for chatting and joining the users.
const WebrtcMessageHandler = require('../PlainWebrtc/WebrtcMessageHandler'); //It having the function of wwebrtc requests.
const KmsWebrtcMessageHandler = require('../KmsWebrtc/KmsWebrtcMessageHandler'); //Its having the function of kmswebrtc requests.

class socketHandler {
  constructor(io) {
    this.io = io;
    this.CommonMessageHandler = new CommonMessageHandler();
    this.webrtcMessageHandler = new WebrtcMessageHandler();
    this.kmsWebrtcMessageHandler = new KmsWebrtcMessageHandler();
  }


  /**
   * In this method socket connection and socket calls are handled
   */
  init() {
    this.io.on('connection', (socket) => {
      console.log('Socket connection established');

      socket.on('message', (msg) => {
        switch (msg.type) {

          /************************* Common socket messages START  *********************/
          case 'JOIN':
            this.CommonMessageHandler.handleJoinMsg(msg.data, socket, this.io);
            break;

          case 'CHAT':
            this.CommonMessageHandler.handleChatMsg(msg.data, socket);
            break;
          /************************* Common socket messages END  *********************/


          /************************* Plain WebRTC socket messages START  *********************/
          case 'CALL_REQUEST':
            this.webrtcMessageHandler.handleCallRequest(msg.data, socket);
            break;

          case 'CALL_RESPONSE':
            this.webrtcMessageHandler.handleCallResponse(msg.data, socket);
            break;

          case 'SDP_OFFER':
            this.webrtcMessageHandler.handleSdpOfferRequest(msg.data, socket);
            break;

          case 'SDP_ANSWER':
            this.webrtcMessageHandler.handleSdpAnswer(msg.data, socket);
            break;

          case 'ICE_CANDIDATE':
            this.webrtcMessageHandler.handleIceCandidateRequest(msg.data, socket);
            break;

          case 'CALL_ENDED':
            this.webrtcMessageHandler.handleCallEnd(msg.data, socket);
            break;
          /************************* Plain WebRTC socket messages END  *********************/


          /************************* KMS WebRTC socket messages START  *********************/
          case 'KMS_CALL_REQUEST':
            this.kmsWebrtcMessageHandler.handleKmsCallRequest(msg.data, socket);
            break;

          case 'KMS_CALL_RESPONSE':
            this.kmsWebrtcMessageHandler.handleKmsCallResponse(msg.data, socket, this.io);
            break;

          case 'KMS_ICE_CANDIDATE':
            this.kmsWebrtcMessageHandler.handleIceCandidate(msg.data);
            break;

          case 'KMS_CALL_ENDED':
            this.kmsWebrtcMessageHandler.handleKmsEndCall(msg.data, socket);
            break;
          /************************* KMS WebRTC socket messages END  *********************/

          default:
            console.log(`Invalid selection of case <switch case error> : ${msg.type}`);
            break;
        }
      });

      //on disconnect function.
      socket.on('disconnect', () => {
        console.log('meeting is disconnected');
      });
    });
  }
}

module.exports = socketHandler;
