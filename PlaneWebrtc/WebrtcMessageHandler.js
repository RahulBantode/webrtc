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

        const emitResponse =
        {
            type: '_CALL_REQUEST',
            data:
            {
                meetingId: messege.meetingId,
                userName: messege.userName,
                userId: messege.userId
            }
        }

        if (messege.meetingId) {
            //socket.to(messege.meetingId).emit("messege",emit); //
            socket.broadcast.emit("message", emitResponse);
            console.log("Agents request : ", emitResponse);
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
        const emitResponse =
        {
            type: "_CALL_RESPONSE",
            data:
            {
                meetingId: messege.meetingId,
                userId: messege.userId,
                callStatus: messege.callStatus,
                userName: messege.userName
            }
        }

        if (messege.meetingId) {
            socket.broadcast.emit("message", emitResponse);
            console.log("User's response : ", emitResponse);
        }
    }

    /*===========================================================================================
        function - handleSdpOfferRequest()
        class - WebrtcMessageHandler
        parameter - messege,socket,io (3)
        return - none
        functionality :- this handle the request (SDP) which comes from agent to all the client.
    ==============================================================================================*/
    handleSdpOfferRequest(messege, socket, io) {
        const sdpOffer =
        {
            type: "_SDP_OFFER",
            data:
            {
                meetingId: messege.meetingId,
                userId: messege.userId,
                userName: messege.userName,
                sdpOffer: messege.sdpOffer
            }
        }

        if (messege.meetingId) {
            socket.broadcast.emit("message", sdpOffer);
            console.log("Sdp offer (Agent) : ", sdpOffer);
        }
    }

    /*===========================================================================================
        function - handleSdpAnswer()
        class - WebrtcMessageHandler
        parameter - messege,socket,io (3)
        return - none
        functionality :- this handle the sdp answer of users and send back to the agent.
    ==============================================================================================*/
    handleSdpAnswer(messege, socket, io) {
        const sdpAnswer =
        {
            type: "_SDP_ANSWER",
            data:
            {
                meetingId: messege.meetingId,
                userId: messege.userId,
                userName: messege.userName,
                sdpAnswer: messege.sdpAnswer
            }
        }


        if (messege.meetingId) {
            socket.broadcast.emit("message", sdpAnswer);
            console.log("Sdp answer (User) : ", sdpAnswer);
        }
    }

    /*===========================================================================================
        function - handleIceCandidateRequest()
        class - WebrtcMessageHandler
        parameter - messege,socket,io (3)
        return - none
        functionality :- this handle the connected users ice candidate.
    ==============================================================================================*/
    handleIceCandidateRequest(message, socket, io) {
        const iceCandidate =
        {
            type: "_ICE_CANDIDATE",
            data:
            {
                //meetingId : message.meetingId,
                userId: message.userId,
                userName: message.userName,
                iceCandidate: message.iceCandidate
            }
        }

        socket.broadcast.emit("message", iceCandidate);
        console.log(`Sharing of iceCandidate : ${iceCandidate}`);

    }
}

module.exports = WebrtcMessageHandler;