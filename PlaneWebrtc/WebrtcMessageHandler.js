class WebrtcMessageHandler {
    /*===========================================================================================
        function - handleCallRequest()
        class -WebrtcMessageHandler
        parameter - messege,socket,io (3)
        return - none
        functionality :- this handle the request of call comes from agent to all the clients
                         with getingusermedia
    ==============================================================================================*/
    handleCallRequest(messege, socket, io) {

        const emitResponse = {
            type: '_CALL_REQUEST',
            data: {
                meetingId: messege.meetingId,
                userName: messege.userName,
                userId: messege.userId
            }
        }

        if (messege.meetingId) {
            //socket.to(messege.meetingId).emit("messege",emit); //
            socket.broadcast.emit("message", emitResponse);
            console.log("Agents request : ", messege.userName);
        }

    }

    /*===========================================================================================
        function - handleCallResponse()
        class - WebrtcMessageHandler
        parameter - messege,socket,io (3)
        return - none
        functionality :- this handle the response from all the clients if they taking call or not
                         and response send back to the agent.
    ==============================================================================================*/
    handleCallResponse(messege, socket, io) {
        if (messege.callStatus == 1) {
            const emitResponse = {
                type: "_CALL_RESPONSE",
                data: {
                    meetingId: messege.meetingId,
                    userId: messege.userId,
                    callStatus: messege.callStatus,
                    userName: messege.userName
                }
            }
            socket.broadcast.emit("message", emitResponse);
            console.log("User's response : ", messege.userName);
        }//end of if
        else {
            console.log("************** CALL REJECTED ************** ");
            const callRejected = {
                type: "_CALL_RESPONSE",
                data: {
                    id: "rejected",
                    messege: "Call is declined"
                }
            }
            socket.broadcast.emit("message", callRejected);
            console.log("CAll rejected ");
        }//end of else.
    }

    /*===========================================================================================
        function - handleSdpOfferRequest()
        class - WebrtcMessageHandler
        parameter - messege,socket,io (3)
        return - none
        functionality :- this handle the request (SDP) which comes from agent to all the client.
    ==============================================================================================*/
    handleSdpOfferRequest(messege, socket, io) {
        const sdpOffer = {
            type: "_SDP_OFFER",
            data: {
                meetingId: messege.meetingId,
                userId: messege.userId,
                userName: messege.userName,
                sdpOffer: messege.sdpOffer
            }
        }

        socket.broadcast.emit("message", sdpOffer);
        console.log("Sdp offer (Agent) : ", messege.userName);
    }

    /*===========================================================================================
        function - handleSdpAnswer()
        class - WebrtcMessageHandler
        parameter - messege,socket,io (3)
        return - none
        functionality :- this handle the sdp answer of users and send back to the agent.
    ==============================================================================================*/
    handleSdpAnswer(messege, socket, io) {
        const sdpAnswer = {
            type: "_SDP_ANSWER",
            data: {
                meetingId: messege.meetingId,
                userId: messege.userId,
                userName: messege.userName,
                sdpAnswer: messege.sdpAnswer
            }
        }

        socket.broadcast.emit("message", sdpAnswer);
        console.log("Sdp answer (User) : ", messege.userName);
    }

    /*===========================================================================================
        function - handleIceCandidateRequest()
        class - WebrtcMessageHandler
        parameter - messege,socket,io (3)
        return - none
        functionality :- this handle the connected users ice candidate.
    ==============================================================================================*/
    handleIceCandidateRequest(message, socket, io) {
        const iceCandidate = {
            type: "_ICE_CANDIDATE",
            data: {
                meetingId: message.meetingId,
                userId: message.userId,
                userName: message.userName,
                iceCandidate: message.iceCandidate
            }
        }

        socket.broadcast.emit("message", iceCandidate);
        console.log(`Sharing of iceCandidate : ${iceCandidate} : of user : ${message.userName}`);

    }

    /*===========================================================================================
        function - handleCallEnd()
        class - WebrtcMessageHandler
        parameter - messege,socket,io (3)
        return - none
        functionality :- this function pass the call end messege to the another users.
    ==============================================================================================*/
    handleCallEnd(message, socket, io) {
        console.log("************** CALL END ************** ");
        const callEnd = {
            type: "_CALL_ENDED",
            data: {
                meetingId: message.meetingId,
                userId: message.userId,
                userName: message.userName,
                messege: "plane webrtc call ended"
            }
        }
        socket.broadcast.emit("message", callEnd);
        console.log("communication stop by user : ", message.userName);
    }
}

module.exports = WebrtcMessageHandler;