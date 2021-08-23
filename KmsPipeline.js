kurento = require("kurento-client");

class KmsPipeline
{
    getKurentoClient(callback)
    {
        const mediaServerUrl = "ws://127.0.0.1:8888/kurento";
        kurento(mediaServerUrl,function(error,kurentoClient){
            if(error)
            {
                var messege = "couldn't find the media server at address : " + mediaServerUrl;
                return callback(messege);
            }

            return callback(kurentoClient);
        });
    }

    createPipeline(agentId,userId,socket,io)
    {
        this.getKurentoClient(function(error,kurentoClient)
        {
            if(error)
            {
                console.log(error);
            }
        });

        kurentoClient.create('WebrtcPipeline',function(error,pipeline){
            if(error)
            {
                console.log(error);
            }

            pipeline.create('WebrtcEndpoints', function(error,AgentWebrtcEndpoint){
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

            });//end of the cretion of AgentWebrtcEndpoint

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



        })//end of the create pipeline function

    }
}