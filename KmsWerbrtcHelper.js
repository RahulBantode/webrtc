
const e = require("cors");
const kurento = require("kurento-client");
const SessionCache = require("./sessionCache");

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
    async createPipeline(meetingId) {
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
                            return this.createEndpoints(participantId, meetingId, webrtcPipeline);
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
    createEndpoints(userId, meetingId, webrtcPipeline) {
        return new Promise((resolve, reject) => {
            webrtcPipeline.create('WebRtcEndpoint', (error, endPoint) => {
                if (error) {
                    webrtcPipeline.release();
                    console.log(error);
                    reject(error);
                }
                this.sessionCache.setUserEndpoints(meetingId, userId, endPoint);
                console.log("Endpoints id  : ", endPoint.id);
                //connectEndpoints(endpoints);
                resolve(endPoint);
            });//end of the webrtcEndpoint function creation
        });//end of the promise
    }//end of the createEndpoints function

    //this function is used for connecting users endpoints with each others.
    connectEndpoints(user1Endpoint, user2endpoint) {
        user1Endpoint.connect(user1Endpoint, function (error) {
            if (error) {
                console.log(error);
            }
        })
    }



    //this is remaining code.
    iceCandidate() {

    }

    //this function process on the offer of users and send back the sdpAnswer of each users
    //in the form of callback
    generateSdpAnswer(userId, meetingId, callback) {

        let sessionStore = this.sessionCache.getSessionStore();
        let sdpOffer = sessionStore[meetingId].participants[userId].sdpOffer;
        sessionStore[meetingId].participants[userId].webrtcEndpoints.processOffer(sdpOffer.sdp, callback);

    }
}


module.exports = KmsPipeline;






/*

if("obj.meetingId.userId.iceCandidate")
            {
                while("obj.meetingId.userId.iceCandidate.length")
                {
                    var candidate = obj.meetingId.userId.iceCandidate.shift();
                    AgentWebrtcEndpoint.iceCandidate(candidate);
                }
            }

            AgentWebrtcEndpoint.on('OnIceCandidate',function(event){
                var candidate = kurento.getComplexType('<string not decide yet>')(event.candidate);
                const iceCandidate = {
                    id : "<notation not decided yet>",
                    iceCandidate : candidate
                }
                //socket.to("obj.meetingId.userId.").emit()
            });

----------------------------------------------------------------------------------------------------------------------


            pipeline.create('WebrtcEndpoints', function(error,ClientWebrtcEndpoint){
                if(error)
                {
                    pipeline.release();
                    console.log(error);
                }

                if("obj.meetingId.userId.iceCandidate")
                {
                    while("obj.meetingId.userId.iceCandidate.length")
                    {
                        var candidate = obj.meetingId.userId.iceCandidate.shift();
                        ClientWebrtcEndpoint.iceCandidate(candidate);
                    }
                }

                ClientWebrtcEndpoint.on('OnIceCandidate',function(event){
                    var candidate = kurento.getComplexType('<string not decide yet>')(event.candidate);
                    const iceCandidate = {
                        id : "<notation not decided yet>",
                        iceCandidate : candidate
                    }
                    //socket.to("obj.meetingId.userId.").emit()
                });
            });//end of the ClientWebrtcEndpoints

*/