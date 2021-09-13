
const data = {
    1212: {
        participants: {
            1: {
                userName: "Rahul",
                mobile: "8624924587",
                type: "admin"
            },
            2: {
                userName: "kunal",
                mobile: "8624924587",
                type: "customer"
            },
            3: {
                userName: "Nitin",
                mobile: "8624924587",
                type: "admin/student"
            },

        }
    }
}

console.log("details : \n", data[1212]);
data[1212].participants = null;
console.log("data : ", data[1212]);

// sessionStore = {}
// let meetingId = 122;
// let userId = 1
// let meetingStore = {};


// sessionStore[meetingId] = meetingStore;
// //sessionStore[meetingId][userId] = 101;
// let userDetails = {}
// sessionStore[meetingId][userId] = userDetails;

// userDetails.userName = "Rahul"
// userDetails.sdpOffer = "asdkjflksjdlkrtejoiwjr"

// console.log(sessionStore);


// console.log("=============================================================")
// sessionStore[meetingId][userId].webrtcendpoint = "enddddpoints";
// console.log(sessionStore)

// let userDetail = {};
// let userI = 2;
// sessionStore[meetingId][userI] = userDetail;
// userDetail.userName = "Bantode"
// userDetail.sdpOffer = "fdjkshrjkhjkeh"
// userDetail.webrtcendpoint = "kkkwwww"
// sessionStore[meetingId].pipeline = "webrtcPipeline"

// console.log(sessionStore);



// Object.keys(sessionStore[meetingId]).forEach(key => {
//     if (key != "pipeline")
//         console.log(key)
// })


// console.log(Object.keys(sessionStore[meetingId]));


// console.log(sessionStore[meetingId][userI].userName);

// console.log("=============================================================")
// console.log("=============================================================")

// session = {}
// let session[meetingId] = 123;
// function saveUserDetails(meetingId, userId, userName, sdpOffer, endpoints) {

//     let userDetails = [];

//     let userDetails = {
//         userName: userName,
//         sdpOffer: sdpOffer,
//         endpoints: endpoints
//     }

//     let meetingStore = session[meetingId];

//     if (!meetingStore) {
//         session[meetingId] = {};
//         session[meetingId][userId] = userDetails;
//     } else {
//         // userDetails = session[meetingId][userId];
//         userDetails = session[meetingId][userId];
//     }


//     // userDetails[userName] = userName;
//     // userDetails[sdpOffer] = sdpOffer;
//     // userDetails[endpoints] = endpoints;


//     console.log(session);

// }

// for (i = 0; i < 3; i++) {
//     saveUserDetails(1010, i, "Rahul", "sfjdlflksj", "webrtcendpoints1");
// }



/*
const obj =
{
    meetingId:"",
    names:"",
    id :
    {
        username : "Rahul",
        surname : "BaNtode"
    }
}

obj.meetingId = 123;
obj.names = "Rahul";
obj.id = 100;

console.log(obj.meetingId);
console.log(obj.names);
console.log(typeof(obj.meetingId));
console.log(obj.id);
*/
/*

        //meetingId = 123;
        //userId = 10;
        var obj =
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
*/
/*
[12:51] Karan Anantpure


MeetingsData =
{

    'meetingId_123':
    {
        'pipeline': pipeline,
        'socket_id_karan':
        {
            'name': 'karan',
            'webrtcEndPoint': callerWebrtcEndPoint
            'iceCandidates': []
        }​​​​​​​​,
        'socket_id_rahul':
        {
            'name': 'rahul',
            'webrtcEndPoint': callerWebrtcEndPoint
            'iceCandidates': []
        }
    }​​​​​​​​,
}

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

========================LOGIC OF CONNECTING THE USER'S ENDPOINTS=================================
 // console.log("Length of the endpointList array : ", this.endpointList.length);
       for (var i = 0; i <= this.endpointList.length; i++) {
        //     console.log("Endpoint list are : ", i, " : ", this.endpointList[i].id);
        // }

        // if (this.endpointList.length == 0) {
        //     console.log("Error : Unable to connect the enpoints");
        // }
        // else {
        //     for (var agentCounter = 1; agentCounter <= this.endpointList.length; agentCounter++) {
        //         //console.log("Agent : ", this.endpointList[agentCounter].id);
        //         for (var userCounter = 1; userCounter <= this.endpointList.length; userCounter++) {
        //             if (agentCounter == userCounter) {
        //                 console.log("Inside the if");
        //             }
        //             else {
        //                 var a = this.endpointList[agentCounter];
        //                 var u = this.endpointList[userCounter];

        //                 console.log("AgentEndpoint Id is : ", agentCounter, " : ", a);
        //                 console.log("UserEndpoint Id is : ", userCounter, " : ", u);

        //                 // this.endpointList[agentCounter].connect(this.endpointLis[userCounter], (error) => {
        //                 //     if (error) {
        //                 //         console.log(error);
        //                 //     }//inner if completed

        //                 //     console.log("connection created ")

        //                 // });//connect statement completed
        //             }//outer if completed
        //         }//inner for completed
        //     }//outer for completed
        // }//else part completed

*/