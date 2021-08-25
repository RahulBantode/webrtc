
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
        kurento(mediaServerUrl, function (error, kurentoClient) {
            if (error) {
                var messege = "couldn't find the media server at address : " + mediaServerUrl;
                return callback(messege);
            }

            return callback(kurentoClient);
        });
    }

    //this function responsible for creating the pipeline over the kms
    createPipeline() {
        let mediaPipeline = "";

        this.getKurentoClient(function (error, kurentoClient) {
            if (error) {
                console.log(error);
            }

            kurentoClient.create('MediaPipeline', function (error, pipeline) {
                if (error) {
                    console.log("Unable to create pipeline :", error);
                }

                mediaPipeline = pipeline;

            });//end of the creation of pipeline

        });//end of getKurentoClient

        this.sessionCache.sessionStore[meetingId].webrtcPipeline = mediaPipeline;
    }

    //this function creates the individual endpoints which is called under the same class function.
    userEndpointsCreate(pipeline) {
        var endPoints = "";

        pipeline.create('WebRtcEndpoint', function (error, endPoints) {
            if (error) {
                pipeline.release();
                console.log(error);
            }

            endPoints = endPoints;
        });
        return endPoints;
    }

    //this function is responsible for connecting the agent and clients endpoints to each others.
    connectEndpoints() {
    }

    //this function creates the endpoints for agent and clients.
    createEndpoints() {

        const userEndpoint = this.userEndpointsCreate(this.sessionCache.sessionStore[meetingId].webrtcPipeline);

        this.sessionCache.sessionStore[meetingId][userId].webrtcEndpoints = userEndpoint;

        console.log("Endpoints are created for user : ", this.sessionCache.sessionStore[meetingId][userId].userName);
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