const KmsPipeline = require("./KmsWerbrtcHelper");
const SessionCache = require("./sessionCache");

//const sessionStore = {};
// {
//     <meetingId> :
//     {
//         <webrtcPipeline>:
//         <agentId>:
//         {
//             userName : "",
//             userId : "",
//             sdpOffer : "",
//         },
//         <clientId>:
//         {
//             userName : "",
//             userId : "",
//             sdpOffer : "",
//              
//         }
//     }
// }

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

        console.log("SDP offer of agent : ", messege.sdpOffer);
        socket.broadcast.emit("message", emitCallRequest);
    }

    handleKmsCallResponse(messege, socket, io) {
        /*const emitCallResponse = {
            type : "_KMS_CALL_RESPONSE",
            data :
            {
                meetingId  : messege.meetingId,
                userId     : messege.userId,
                userName   : messege.userName,
                callStatus : messege.callStatus
            }
        }*/

        this.sessionCache.saveUserDetails(messege.meetingId, messege.userId, messege.userName, messege.sdpOffer);


        if (messege.callStatus == 1) {

            //pipeline for kms is created
            this.kmspipeline.createPipeline();

            //under the pipeline endpoints are created
            Object.keys(this.sessionCache.sessionStore[meetingId]).forEach(key => {
                if (key != "webrtcPipeline") {
                    this.kmspipeline.createEndpoints();
                }
            })


            //generate the sdp answer for each user and send back to respective user.
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
        }
    }
}

module.exports = KmsWebrtcMessageHandler;
