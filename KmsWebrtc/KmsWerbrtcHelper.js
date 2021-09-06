
const e = require("cors");
const kurento = require("kurento-client");
const SessionCache = require("../sessionCache");

class KmsPipeline {
    sessionCache;
    obj;
    endpointList = [];

    constructor() {
        this.sessionCache = new SessionCache();
    }

    //this function responsible for creating the communication between kms and server.
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

    //this function responsible for creating the pipeline
    async createPipeline(meetingId, io) {
        var sessionStore = this.sessionCache.getSessionStore();

        return new Promise((resolve, reject) => {
            this.getKurentoClient((error, kurentoClient) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }

                //this function used to create pipeline and set that pipeline in sessionCache
                kurentoClient.create('MediaPipeline', (error, webrtcPipeline) => {
                    if (error) {
                        console.log("Unable to create pipeline :", error);
                        reject(error);
                    }

                    //console.log('mediaPipeline id is :', webrtcPipeline.id);
                    this.sessionCache.setMediaPipeline(meetingId, webrtcPipeline);

                    if (webrtcPipeline) {
                        let createAllEnpointPromises = Object.keys(sessionStore[meetingId].participants).map((participantId) => {
                            //console.log("Inside if <key> is : ", key);
                            return this.createEndpoints(participantId, meetingId, webrtcPipeline, sessionStore, io);
                        });
                        Promise.all(createAllEnpointPromises).then((values) => {
                            //console.log("....endPoints:", values);
                            resolve();
                        });

                    }//end of if
                }); //end of mediapipeline create function
            });//end of getKurentoClient function
        });//end of promise
    }//end of createPipeline function

    //this function creates the endpoints for agent and clients and set their endpoints
    //into sessionCache.
    createEndpoints(userId, meetingId, webrtcPipeline, sessionStore, io) {
        return new Promise((resolve, reject) => {
            webrtcPipeline.create('WebRtcEndpoint', (error, endPoint) => {
                if (error) {
                    webrtcPipeline.release();
                    console.log(error);
                    reject(error);
                }
                this.sessionCache.setUserEndpoints(meetingId, userId, endPoint);
                //this is for connecting the enpoints with each others.
                this.endpointList.push(endPoint);
                console.log("Endpoints id  : ", endPoint.id);

                //this part for icecandidate add from user to the kms
                //we are maintain one iceCandidateQueue -
                //If candidatequeue has icecandidate then we collect it and to the endpoint.
                if (sessionStore[meetingId].participants[userId].iceCandidateQueue) {
                    while (sessionStore[meetingId].participants[userId].iceCandidateQueue.length) {
                        var iceCandidate = sessionStore[meetingId].participants[userId].iceCandidateQueue.shift();
                        endPoint.addIceCandidate(iceCandidate);

                    }
                    console.log("**********<createEndpoint> function : typeof icecandidate : ", typeof (iceCandidate));
                    console.log("**********<createEndpoint> : Icecandidate :", iceCandidate);
                }


                //this function for sending the icecandidate from kms to user.
                endPoint.on('OnIceCandidate', (event) => {
                    let iceCandidate = kurento.getComplexType('IceCandidate')(event.iceCandidate);
                    console.log("In sending the kms to user (typeof) :", typeof (iceCandidate));
                    //console.log("Ice candidate : ", iceCandidate);
                    const candidate = {
                        type: "_KMS_ICE_CANDIDATE",
                        data: {
                            meetingId: meetingId,
                            userId: userId,
                            candidate: {
                                type: "iceCandidate",
                                iceCandidate: iceCandidate
                            }
                        }
                    }
                    io.to(userId).emit("message", candidate);
                    console.log("icecandidate send to the endpoint : <createEndpoint> function : userId :", userId);
                });

                resolve(endPoint);
            });//end of the webrtcEndpoint function creation
        });//end of the promise
    }//end of the createEndpoints function

    //this function is used for connecting users endpoints with each others.
    connectEndpoints() {

        this.endpointList[0].connect(this.endpointList[1], (error) => {
            if (error) {
                console.log(error)
            }
            console.log("Agent : Enpoint is connected");
        });

        this.endpointList[1].connect(this.endpointList[0], (error) => {
            if (error) {
                console.log(error);
            }
            console.log("Users : Endpoint is connected ");
        })


    }//connect endpoint function completed


    //Function used to handle the icecandidate

    onIceCandidate(meetingId, userId, iceCandidate) {
        console.log("---------START <onIceCandidate>---------");
        var iceCandidate = kurento.getComplexType('IceCandidate')(iceCandidate);
        let sessionStore = this.sessionCache.getSessionStore();

        console.log("Type of Icecandidate : ", typeof (iceCandidate));
        console.log("Icecandidate from onIceCandidate Function ", iceCandidate);

        let userEndPoint = sessionStore[meetingId].participants[userId].webrtcEndpoints;
        if (userEndPoint) {
            userEndPoint.addIceCandidate(iceCandidate);
        }
        else {
            sessionStore[meetingId].participants[userId].iceCandidateQueue.push(iceCandidate);
        }

        console.log("---------END <onIceCandidate>---------");
    }

    //this function process on the offer of users and send back the sdpAnswer of each users
    //in the form of callback
    generateSdpAnswer(userId, meetingId, callback) {

        let sessionStore = this.sessionCache.getSessionStore();
        let sdpOffer = sessionStore[meetingId].participants[userId].sdpOffer;
        sessionStore[meetingId].participants[userId].webrtcEndpoints.processOffer(sdpOffer.sdp, callback);

        //gatherCandidate - this is inbuilt function called after processOffer function.
        sessionStore[meetingId].participants[userId].webrtcEndpoints.gatherCandidates((error) => {
            if (error) {
                console.log("Error occur in gathering the ice candidate");
            }
        });

    }
}


module.exports = KmsPipeline;
