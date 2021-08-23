class session
{   

    handler(meetingId,userId)
    {
        //meetingId = 123;
        //userId = 10;
        const obj = 
        {
            meetingId : 
            {
                webrtcPipeline : "WebrtcPipeline",
                agentId :
                {
                    userName : 'Rahul',
                    webrtcEndpoints : "AgentWebrtcEndpoint",
                    iceCandidate : [10]
                },
                clientId : 
                {
                    userName : "Kunal",
                    webrtcEndpoints : "ClientWebrtcEndpoint",
                    iceCandidate : [20]
                }
            }
        }

        console.log(obj.meetingId);
        console.log("----------------------------")
        console.log(obj.meetingId.webrtcPipeline);
        console.log("----------------------------")
        console.log(obj.meetingId.userId);
        console.log("----------------------------")
        console.log(obj.meetingId.userId.iceCandidate.length);
    }
}


const obj = new session();
obj.handler(123,10);

/*
[12:51] Karan Anantpure
    

MeetingsData =  
{​​​​​​​​

    'meetingId_123': 
    {​​​​​​​​
        'pipeline': pipeline,
        'socket_id_karan': 
        {​​​​​​​​
            'name': 'karan',
            'webrtcEndPoint': callerWebrtcEndPoint
            'iceCandidates': []
        }​​​​​​​​,
        'socket_id_rahul': 
        {​​​​​​​​
            'name': 'rahul',
            'webrtcEndPoint': callerWebrtcEndPoint
            'iceCandidates': []
        }​​​​​​​​
    }​​​​​​​​,
}​​​​​​​​

*/