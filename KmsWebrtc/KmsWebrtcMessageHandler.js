const KmsWerbrtcHelper = require("./KmsWerbrtcHelper");
const SessionCache = require("../sessionCache");

class KmsWebrtcMessageHandler {
    kmsWebrtcHelper;
    sessionCache;

    constructor() {
        this.kmsWebrtcHelper = new KmsWerbrtcHelper();
        this.sessionCache = new SessionCache();
    }

    /*=====================================================================================================
        handleKmsCallRequest - This function handle the call request of comes from agent and forward this
                               request to the user who joined the room
        parameter :- messege(data comes from agent) , socket , io
    ========================================================================================================*/
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


    /*=====================================================================================================
        handleKmsCallResponse :- This function is used perform the task after getting response from the 
                                 users to the call, if callStatus is true then , all the function are called
                                 under the if condition.
        parameter :- messege(data comes from agent) , socket , io
    ========================================================================================================*/
    async handleKmsCallResponse(messege, socket, io) {
        //console.log("Call Response  : ", messege);

        //this part for displaying the the keys of the sessionStore.
        var sessionStore = this.sessionCache.getSessionStore();
        var meetingId = this.sessionCache.getMeetingId();

        //========================================================================================
        //saveUserDetails() - Funnction of class sessionCache 
        //working - Function is used to store the information of joined users to the room
        //=========================================================================================
        this.sessionCache.saveUserDetails(messege.meetingId, messege.userId, messege.userName, messege.sdpOffer);

        if (messege.callStatus == 1) {

            //=====================================================================================
            //createPipeline() :- Function of class kmsWebrtcHelper
            //working :- function is used to create the pipeline on the kms server
            //parameter :- meetingId and io (socket object)
            //======================================================================================
            await this.kmsWebrtcHelper.createPipeline(meetingId, io);

            //=============================================================================================
            //connectEndpoints() :- Function of class kmsWebrtcHelper
            //working :- function is used to connect all the users endpoints which are created on pipeline
            //parameter :- None
            //==============================================================================================
            this.kmsWebrtcHelper.connectEndpoints();

            //=============================================================================================
            //generateSdpAnswer() :- Function of class kmsWebrtcHelper
            //working :- process the offer of users which commes from each user and then generate the sdp
            //           answer and send back it to the respective user
            //parameter :- userId , meetingId , one callback (error,kmsSdpAnswer)
            //=============================================================================================
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

                    io.to(userId).emit("message", sdpAnswer);
                    console.log("sdp answer (user Id): ", userId);

                });//endof generatesdpanswer            

            });//end of the foreach
        }//end of main if
    }

    /*=====================================================================================================
        handleIceCandidate() :- This function is used to handle the iceCandidate comes from each user to the
                               server, and server pass it to the kms and kms add this IceCandidate and 
                               generate it own iceCandidate for each user and send back to the each user
         parameter :- messege(data comes from agent) , socket , io                       
    =======================================================================================================*/
    handleIceCandidate(messege, socket, io) {
        console.log(`From users to kms : UserId : ${messege.userId} : IceCandidate : ${messege.iceCandidate}`);
        let sessionStore = this.sessionCache.getSessionStore();

        if (!sessionStore[messege.meetingId].participants[messege.userId].iceCandidateQueue) {
            //================================================================================================
            //initializeCandidateQueue() :- Function is from sessionCache class and is used to initialize
            //                              iceCandidateQueue for each joined user
            //parameter :- meetingId,userId
            //================================================================================================
            this.sessionCache.initializeIceCandidateQueue(messege.meetingId, messege.userId);
        }

        //================================================================================================
        //initializeCandidateQueue() :- Function is from kmsWebrtcHelper class and is used to add the 
        //                              icecandidate to the user's endpoint.
        //parameter :- meetingId,userId,iceCandidate
        //================================================================================================
        this.kmsWebrtcHelper.onIceCandidate(messege.meetingId, messege.userId, messege.iceCandidate);

    }
}

module.exports = KmsWebrtcMessageHandler;
