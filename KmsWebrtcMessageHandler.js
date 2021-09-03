const KmsWerbrtcHelper = require("./KmsWerbrtcHelper");
const SessionCache = require("./sessionCache");

class KmsWebrtcMessageHandler {
    kmsWebrtcHelper;
    sessionCache;

    constructor() {
        this.kmsWebrtcHelper = new KmsWerbrtcHelper();
        this.sessionCache = new SessionCache();
    }

    handleKmsCallRequest(messege, socket, io) {
        //console.log("Call request data : ", messege);

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

    async handleKmsCallResponse(messege, socket, io) {
        //console.log("Call Response  : ", messege);

        //this part for displaying the the keys of the sessionStore.
        var sessionStore = this.sessionCache.getSessionStore();
        var meetingId = this.sessionCache.getMeetingId();
        var participants = sessionStore[meetingId].participants;

        this.sessionCache.saveUserDetails(messege.meetingId, messege.userId, messege.userName, messege.sdpOffer);

        if (messege.callStatus == 1) {

            //function is responsible for creating the pipeline for kms

            await this.kmsWebrtcHelper.createPipeline(meetingId, io);

            this.kmsWebrtcHelper.connectEndpoints();

            //generate the sdp answer for each user and send back to respective user.
            Object.keys(sessionStore[meetingId].participants).forEach(userId => {
                this.kmsWebrtcHelper.generateSdpAnswer(userId, meetingId, (error, kmsSdpAnswer) => {
                    if (error) {
                        console.log(error);
                    }
                    const sdpAnswer = {
                        type: "_KMS_SDP_ANSWER",
                        data: {
                            meetingId: meetingId,
                            userId: userId,
                            sdpAnswer: {
                                type: 'answer',
                                sdp: kmsSdpAnswer
                            }
                        }
                    }

                    //socket.broadcast.to(userId).emit("message", sdpAnswer);
                    io.to(userId).emit("message", sdpAnswer);
                    console.log("sdp answer (user Id): ", userId);

                });//endof generatesdpanswer            

            });//end of the foreach
        }//end of main if
    }

    handleIceCandidate(messege, socket, io) {
        // console.log("meetingId : ", messege.meetingId);
        // console.log("userId :", messege.userId);
        // console.log("icecandidate : ", messege.iceCandidate);
        console.log("from user : ", messege);
        let sessionStore = this.sessionCache.getSessionStore();

        if (!sessionStore[messege.meetingId].participants[messege.userId].iceCandidateQueue) {
            this.sessionCache.initializeIceCandidateQueue(messege.meetingId, messege.userId);
        }

        this.kmsWebrtcHelper.onIceCandidate(messege.meetingId, messege.userId, messege.iceCandidate);

    }
}

module.exports = KmsWebrtcMessageHandler;
