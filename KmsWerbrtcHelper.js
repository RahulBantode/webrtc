
const kurento = require("kurento-client");
const SessionCache = require("./sessionCache");


class KmsPipeline {
    sessionCache;

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
    createPipeline(meetingId) {
        let webrtcPipeline = "";
        let sessionCache = this.sessionCache;
        var sessionStore = this.sessionCache.getSessionStore();
        var createEndpoints = this.createEndpoints();

        this.getKurentoClient(function (error, kurentoClient) {
            if (error) {
                console.log(error);
            }

            //console.log("kurentoclient : ", kurentoClient);
            kurentoClient.create('MediaPipeline', function (error, pipeline) {
                if (error) {
                    console.log("Unable to create pipeline :", error);
                }

                webrtcPipeline = pipeline;
                //console.log("Pipeline is : ", webrtcPipeline);
                sessionCache.setMediaPipeline(meetingId, webrtcPipeline);
                console.log("Pipeline id is : ", webrtcPipeline.id);

            }).then(() => {
                //console.log("create pipeline function scope completed");
                //console.log("Keys of the objects are : ", Object.keys(sessionStore[meetingId]));
                console.log("Session store from <kmsWebrtcHelper class> : ", sessionStore[meetingId]);

                var webrtcPipeline = sessionStore[meetingId].webrtcPipeline;
                //console.log(webrtcPipeline);
                if (webrtcPipeline) {
                    Object.keys(sessionStore[meetingId]).forEach(key => {
                        if (key != 'webrtcPipeline') {
                            console.log("Inside if ");
                            createEndpoints(key, meetingId, webrtcPipeline);
                        }
                    })
                }
            });//end of the creation of pipeline
        })
    }


    //this function is responsible for connecting the agent and clients endpoints to each others.
    connectEndpoints() {
    }

    //this function creates the endpoints for agent and clients.
    createEndpoints(userId, meetingId, webrtcPipeline) {
        console.log("Inside the creaEndpoints function")
        console.log("WebrtcPipeline : ", webrtcPipeline);

        //var sessionStore = this.sessionCache.getSessionStore();
        var sessionCache = this.sessionCache;

        webrtcPipeline.create('WebrtcEndpoint', function (error, endpoints) {
            if (error) {
                webrtcPipeline.release();
                console.log(error);
            }

            sessionCache.setUserEndpoints(meetingId, userId, endpoints);

        })

        //this.connectEndpoints();
    }

    //this is remaining code.
    iceCandidate() {

    }

    //this function process on the sdpOffer of the agent and clients and send back the callback 
    //which consist the sdpAnswer.
    generateSdpAnswer(id, callback) {
        let sdpOffer = this.sessionCache.sessionStore[meetingId][id].sdpOffer;
        this.sessionCache.sessionStore[meetingId][userId].webrtcEndpoints.processOffer(sdpOffer, callback)

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