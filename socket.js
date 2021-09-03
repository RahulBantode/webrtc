const Helper = require("./Helper");  //It having the handler for chatting and joining the users.
const SessionsCache = require("./sessionCache"); //It maintain the log of the users and its messeges.
const WebrtcMessageHandler = require("./WebrtcMessageHandler");  //It having the function of wwebrtc requests.
const KmsWebrtcMessageHandler = require("./KmsWebrtcMessageHandler"); //Its having the function of kmswebrtc requests.
const { Socket } = require("socket.io");

class socketHandler {
    io;
    HelperObj;
    cacheObj;
    webrtcMessageHandler;
    kmsWebrtcMessageHandler;

    constructor(io) {
        this.io = io;
        this.HelperObj = new Helper();
        this.cacheObj = new SessionsCache();
        this.webrtcMessageHandler = new WebrtcMessageHandler();
        this.kmsWebrtcMessageHandler = new KmsWebrtcMessageHandler();
    }


    init() {
        this.io.on("connection", (socket) => {
            /*===========================================================================
            here logic can be replaced when client creates some function on client side
            for posting messege or data if its chat application.
            =============================================================================*/
            console.log("Socket connection established");

            socket.on("message", (msg) => {
                switch (msg.type) {
                    case 'JOIN':
                        this.HelperObj.handleJoinMsg(msg.data, socket, this.io);
                        break;

                    case 'CHAT':
                        this.HelperObj.handleChatMsg(msg.data, socket, this.io);
                        break;


                    case 'CALL_REQUEST':
                        this.webrtcMessageHandler.handleCallRequest(msg.data, socket, this.io);
                        break;

                    case 'CALL_RESPONSE':
                        this.webrtcMessageHandler.handleCallResponse(msg.data, socket, this.io);
                        break;

                    case 'SDP_OFFER':
                        this.webrtcMessageHandler.handleSdpOfferRequest(msg.data, socket, this.io);
                        break;

                    case 'SDP_ANSWER':
                        this.webrtcMessageHandler.handleSdpAnswer(msg.data, socket, this.io);
                        break;

                    case 'ICE_CANDIDATE':
                        this.webrtcMessageHandler.handleIceCandidateRequest(msg.data, socket, this.io);
                        break;

                    case 'KMS_CALL_REQUEST':
                        this.kmsWebrtcMessageHandler.handleKmsCallRequest(msg.data, socket, this.io);
                        break;

                    case 'KMS_CALL_RESPONSE':
                        this.kmsWebrtcMessageHandler.handleKmsCallResponse(msg.data, socket, this.io);
                        break;

                    case 'KMS_ICE_CANDIDATE':
                        this.kmsWebrtcMessageHandler.handleIceCandidate(msg.data, socket, this.io);
                        break;

                    default:
                        console.log("Invalid selection of case <switch case error> : ", msg.type);
                        break;
                }

            });

            //on disconnect function.
            socket.on('disconnect', () => {
                console.log("meeting is disconnected");
            });

        });

    } //end of the init() method  
}//end of the socketHandler class 


module.exports = socketHandler;







//let clientId = socket.id ; //it will gives an socket id.
//io.sockets.in('user1@example.com').emit('new_msg', {msg: 'hello'});
