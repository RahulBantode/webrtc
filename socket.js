const ChatHelper = require("./PlaneWebrtc/ChatHelper");  //It having the handler for chatting and joining the users.
const SessionsCache = require("./sessionCache"); //It maintain the log of the users and its messeges.
const WebrtcMessageHandler = require("./PlaneWebrtc/WebrtcMessageHandler");  //It having the function of wwebrtc requests.
const KmsWebrtcMessageHandler = require("./KmsWebrtc/KmsWebrtcMessageHandler"); //Its having the function of kmswebrtc requests.
//const { Socket } = require("socket.io");

class socketHandler {
    io;
    chatHelper;
    sessionCache;
    webrtcMessageHandler;
    kmsWebrtcMessageHandler;

    constructor(io) {
        this.io = io;
        this.chatHelper = new ChatHelper();
        this.sessionCache = new SessionsCache();
        this.webrtcMessageHandler = new WebrtcMessageHandler();
        this.kmsWebrtcMessageHandler = new KmsWebrtcMessageHandler();
    }

    //================================================================================
    //init() - The method of socketHandler class which is used to create the socket 
    //         connection.
    //================================================================================
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
                        //handleJoinMsg():- this function used to handler all the joined user to room
                        this.chatHelper.handleJoinMsg(msg.data, socket, this.io);
                        break;

                    case 'CHAT':
                        //handleChatMsg():- this function used to handle the messeges comes from each joined user.
                        this.chatHelper.handleChatMsg(msg.data, socket, this.io);
                        break;

                    case 'CALL_REQUEST':
                        //handleCallRequest():- this function is used to handle plane webrtc call request from agent.
                        this.webrtcMessageHandler.handleCallRequest(msg.data, socket, this.io);
                        break;

                    case 'CALL_RESPONSE':
                        //handleCallResponse():- this function is used to handle plane webrtc call response from user.
                        this.webrtcMessageHandler.handleCallResponse(msg.data, socket, this.io);
                        break;

                    case 'SDP_OFFER':
                        //handleSdpOfferRequest():- this function is used to handle sdp offer request from agent
                        this.webrtcMessageHandler.handleSdpOfferRequest(msg.data, socket, this.io);
                        break;

                    case 'SDP_ANSWER':
                        //handleSdpAnswer():- this function is used to handle sdp answer comes from user.
                        this.webrtcMessageHandler.handleSdpAnswer(msg.data, socket, this.io);
                        break;

                    case 'ICE_CANDIDATE':
                        //handleIceCandidateRequest():- this function is used to handle ice candidate request.
                        this.webrtcMessageHandler.handleIceCandidateRequest(msg.data, socket, this.io);
                        break;

                    case 'KMS_CALL_REQUEST':
                        //handleKmsCallRequest():- this function is used to handle the kms call request comes from agent.
                        this.kmsWebrtcMessageHandler.handleKmsCallRequest(msg.data, socket, this.io);
                        break;

                    case 'KMS_CALL_RESPONSE':
                        //handleKmsCallResponse():- this function is used to handle kms call response comes from users.
                        this.kmsWebrtcMessageHandler.handleKmsCallResponse(msg.data, socket, this.io);
                        break;

                    case 'KMS_ICE_CANDIDATE':
                        //handleIceCandidate() : this function is used to handle the ice Candidate.
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
