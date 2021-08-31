const KmsPipeline = require("./KmsWerbrtcHelper");
const SessionCache = require("./sessionCache");

class KmsWebrtcMessageHandler {
    kmspipeline;
    sessionCache;

    constructor() {
        this.kmspipeline = new KmsPipeline();
        this.sessionCache = new SessionCache();
    }

    handleKmsCallRequest(messege, socket, io) {

        const emitCallRequest = {
            type: "_KMS_CALL_REQUEST",
            data: {
                meetingId: messege.meetingId,
                userId: messege.userId,
                userName: messege.userName
            }
        }

        this.sessionCache.saveUserDetails(messege.meetingId, messege.userId, messege.userName, messege.sdpOffer);

        socket.broadcast.emit("message", emitCallRequest);
    }

    handleKmsCallResponse(messege, socket, io) {

        //this part for displaying the the keys of the sessionStore.
        var sessionStore = this.sessionCache.getSessionStore();
        var meetingId = this.sessionCache.getMeetingId();

        this.sessionCache.saveUserDetails(messege.meetingId, messege.userId, messege.userName, messege.sdpOffer);

        //if (messege.callStatus == 1) {

        //function is responsible for creating the pipeline for kms

        this.kmspipeline.createPipeline(meetingId);

        //console.log("webrtc pipeline form <KMSWebrtcMessegeHandler> : ", sessionStore[meetingId].webrtcPipeline);

        //generate the sdp answer for each user and send back to respective user.
        /*
        Object.keys(this.sessionCache.sessionStore[meetingId]).forEach(key => {
            if (key != "webrtcPipeline") {
                this.kmspipeline.generateSdpAnswer(key, function (kmsSdpAnswer) {
                    const sdpAnswer = {
                        type: "_KMS_SDP_ANSWER",
                        data: {
                            userId: key,
                            kmsSdpAnswer: kmsSdpAnswer
                        }
                    }
    
                    socket.broadcast.to(key).emit("message", sdpAnswer);
                    //socket.to(key).emit("message",kmsSdpAnswer);
    
                });//endof generatesdpanswer
    
            }//end of if            
    
        });//end of the foreach
        */
        //}//end of if
    }
}

module.exports = KmsWebrtcMessageHandler;
