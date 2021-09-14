
const kurento = require("kurento-client");
const SessionCache = require("../sessionCache");

class KmsPipeline {
    sessionCache;

    constructor() {
        this.sessionCache = new SessionCache();
    }

    //==================================================================================================
    //getkurentoClient() :- this function is used for establishing the communication between server
    //                      and kurento media server.
    //==================================================================================================
    getKurentoClient(callback) {
        const mediaServerUrl = "ws://127.0.0.1:8888/kurento";
        let kurentoClient = "";

        kurento(mediaServerUrl, function (error, _kurentoClient) {
            if (error) {
                var messege = "couldn't find the media server at address : " + mediaServerUrl;
                return callback(messege);
            }
            kurentoClient = _kurentoClient;
            callback(null, kurentoClient);
        });
    }

    //==================================================================================================
    //createPipeline() :- this function is used to create the pipeline on kms server.
    //==================================================================================================
    async createPipeline(meetingId, io) {
        console.log("STEP : 7 (get Kurento client , create piepeline, create endpoints");

        let sessionStore = this.sessionCache.getSessionStore();

        return new Promise((resolve, reject) => {
            this.getKurentoClient((error, kurentoClient) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                //================================================================================================
                //create() : (inbuilt)this function used to create pipeline and set that pipeline in sessionCache
                //================================================================================================
                kurentoClient.create('MediaPipeline', (error, webrtcPipeline) => {
                    if (error) {
                        console.log("Unable to create pipeline :", error);
                        reject(error);
                    }

                    console.log("Webrtc Pipeline id : ", webrtcPipeline.id);
                    //======================================================================================
                    //setMediaPipeline() - this function is from sessionCache()
                    //function is used to save the mediaPipeline to the sessionCache class
                    //======================================================================================
                    this.sessionCache.setMediaPipeline(meetingId, webrtcPipeline);
                    this.sessionCache.setKurentoClient(meetingId, kurentoClient);

                    //==============================================================================================
                    //This piece of code used to create the endpoints for each user after creating of mediaPipeline.
                    //==============================================================================================
                    if (webrtcPipeline) {
                        let createAllEnpointPromises = Object.keys(sessionStore[meetingId].participants).map((participantId) => {
                            return this.createEndpoints(participantId, meetingId, webrtcPipeline, sessionStore, io);
                        });
                        Promise.all(createAllEnpointPromises).then((values) => {
                            resolve();
                        });

                    }//end of if
                }); //end of mediapipeline create function
            });//end of getKurentoClient function
        });//end of promise
    }//end of createPipeline function

    //=====================================================================================================
    //createEndpoints() :- this function is used to create endpoints on the pipeline for each joined user
    //=====================================================================================================
    createEndpoints(userId, meetingId, webrtcPipeline, sessionStore, io) {
        return new Promise((resolve, reject) => {
            webrtcPipeline.create('WebRtcEndpoint', (error, endPoint) => {
                if (error) {
                    webrtcPipeline.release();
                    console.log(error);
                    reject(error);
                }

                console.log("Webrtc Endpoints id  : ", endPoint.id);
                //==============================================================================
                //setUserEndpoints () :- this function is of sessionCache class
                //this function used for save the endpoint to the sessionCache
                //==============================================================================
                this.sessionCache.setUserEndpoints(meetingId, userId, endPoint);

                //==================================================================================================
                //This block of statement is used to add the ice candidate of users to the kms endpoints.
                //==================================================================================================
                if (sessionStore[meetingId].participants[userId].iceCandidateQueue) {
                    while (sessionStore[meetingId].participants[userId].iceCandidateQueue.length) {
                        var iceCandidate = sessionStore[meetingId].participants[userId].iceCandidateQueue.shift();
                        endPoint.addIceCandidate(iceCandidate);

                    }
                    console.log(`IceCandidate added to the kms server : ${iceCandidate}`);
                }

                //==================================================================================================
                //following code is used to send the icecandidate from kms server to the each respective user.
                //==================================================================================================
                endPoint.on('OnIceCandidate', (event) => {
                    let iceCandidate = kurento.getComplexType('IceCandidate')(event.iceCandidate);
                    const candidate = {
                        type: "_KMS_ICE_CANDIDATE",
                        data: {
                            meetingId: meetingId,
                            userId: userId,
                            userName: sessionStore[meetingId].participants[userId].userName,
                            iceCandidate: iceCandidate

                        }
                    }
                    io.to(userId).emit("message", candidate);

                    console.log("STEP : 17/18/19 (sending ice Candidate KMS to each users)");

                });//end of the endpoint on icecandidate event.

                resolve(endPoint);
            });//end of the webrtcEndpoint function creation
        });//end of the promise
    }//end of the createEndpoints function

    //==================================================================================================
    //connectEndpoints() :- this function is used for connecting users endpoints with each others.
    //==================================================================================================
    connectEndpoints(endpoint1, endpoint2) {
        console.log("STEP : 8 (connect endpoints)");

        endpoint1.connect(endpoint2, (error) => {
            if (error) {
                console.log("Error in connecting endpoints 0 to 1:", error);
            }
            console.log("Agent : Enpoint is connected");
        });

    }//connect endpoint function completed

    //==================================================================================================
    //onIceCandidate :- Function used to handle the icecandidate and used to add the icecandidate to 
    //                  the user's endpoints and if endpoint is not created then it maintained in the
    //                  queue.
    //==================================================================================================
    onIceCandidate(meetingId, userId, iceCandidate) {
        console.log("STEP : 15/16 (add Ice candidate into Endpoints/Icecandidate Queue)");

        var iceCandidate = kurento.getComplexType('IceCandidate')(iceCandidate);
        let sessionStore = this.sessionCache.getSessionStore();

        let userEndPoint = sessionStore[meetingId].participants[userId].webrtcEndpoints;
        if (userEndPoint) {
            userEndPoint.addIceCandidate(iceCandidate);
        }
        else {
            sessionStore[meetingId].participants[userId].iceCandidateQueue.push(iceCandidate);
        }
    }

    //==================================================================================================
    // generateSdpAnswer() :- this function is used to process the sdp offer which are comes from each
    //                       joined user and the send the sdp answer to that user from kms server.
    //==================================================================================================
    generateSdpAnswer(userId, meetingId, callback) {
        console.log("STEP : 9 (process offer and generate sdp answer)");

        let sessionStore = this.sessionCache.getSessionStore();
        let sdpOffer = sessionStore[meetingId].participants[userId].sdpOffer;

        sessionStore[meetingId].participants[userId].webrtcEndpoints.processOffer(sdpOffer.sdp, callback);

        //==================================================================================================
        //gatherCandidate - this is inbuilt function called after processOffer function.
        //==================================================================================================
        sessionStore[meetingId].participants[userId].webrtcEndpoints.gatherCandidates((error) => {
            if (error) {
                console.log("Error occur in gathering the ice candidate");
            }
        });

    }

    //==================================================================================================
    // releaseKMSResources :- this function is used to release all the kms resources
    //==================================================================================================
    releaseKMSResources(sessionDetails) {
        if (sessionDetails.webrtcPipeline) {

            Object.keys(sessionDetails.participants).forEach(participantId => {
                sessionDetails.participants[participantId].webrtcEndpoints.release();
                sessionDetails.participants[participantId].iceCandidateQueue = [];
            });
            sessionDetails.webrtcPipeline.release();

            console.log("All the resourcess are released on kms server");
        }
    }
}

module.exports = KmsPipeline;