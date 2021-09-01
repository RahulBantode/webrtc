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

        //this part for displaying the the keys of the sessionStore.
        var sessionStore = this.sessionCache.getSessionStore();
        var meetingId = this.sessionCache.getMeetingId();
        var participants = sessionStore[meetingId].participants;

        this.sessionCache.saveUserDetails(messege.meetingId, messege.userId, messege.userName, messege.sdpOffer);

        if (messege.callStatus == 1) {

            //function is responsible for creating the pipeline for kms

            await this.kmsWebrtcHelper.createPipeline(meetingId);

            // for (var icounter = 1; icounter <= participants.length; icounter++) {
            //     for (var jcounter = 1; jcounter <= participants.length; jcounter++) {
            //         if (icounter != jcounter) {
            //             this.kmsWebrtcHelper.connectEndpoints(participants[icounter][userId].webrtcEndpoint
            //                 , participants[jcounter][userId].webrtcEndpoint);
            //         }
            //     }
            // }
            console.log("After createpipeline function");

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
                            kmsSdpAnswer: kmsSdpAnswer,
                        }
                    }

                    console.log("sdp answer : ", sdpAnswer.data.userId);
                    socket.broadcast.to(userId).emit("message", sdpAnswer);

                });//endof generatesdpanswer            

            });//end of the foreach
        }//end of main if
    }
}

module.exports = KmsWebrtcMessageHandler;
