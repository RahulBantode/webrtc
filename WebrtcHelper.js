class WebrtcHelper
{
    /*===========================================================================================
        function - handleCallRequest()
        class -WebrtcHelper
        parameter - messege,socket,io (3)
        return - none
        functionality :- this handle the request of call comes from agent to all the clients
                         with getingusermedia
    ==============================================================================================*/
    handleCallRequest(messege,socket,io)
    {

        const emitResponse = 
        {
            type : '_CALL_REQUEST',
            data : 
            {
                meetingId : messege.meetingId,
                userName  : messege.userName,
                userId : messege.userId
            }
        }

        if(messege.meetingId)
        {
            //socket.to(messege.meetingId).emit("messege",emit); //
            socket.broadcast.emit("message",emitResponse);
        }
    }

    /*===========================================================================================
        function - handleCallResponse()
        class - WebrtcHelper
        parameter - messege,socket,io (3)
        return - none
        functionality :- this handle the response from all the clients if they taking call or not
                         and response send back to the agent.
    ==============================================================================================*/
    handleCallResponse(messege,socket,io)
    {
        const emitResponse = 
        {
            type : "_CALL_RESPONSE",
            data : 
            {
                meetingId : messege.meetingId,
                userId : messege.userId,
                callStatus :  messege.callStatus,
                userName  : messege.userName
            }
        }

        if(messege.meetingId)
        {
            socket.broadcast.emit("message",emitResponse);
        }    
    }
    
    /*===========================================================================================
        function - handleSdpOfferRequest()
        class - WebrtcHelper
        parameter - messege,socket,io (3)
        return - none
        functionality :- this handle the request (SDP) which comes from agent to all the client.
    ==============================================================================================*/
    handleSdpOfferRequest(messege,socket,io)
    {
        const sdpOffer = 
        {
            type : "_SDP_OFFER",
            data : 
            {
                meetingId : messege.meetingId,
                userId  : messege.userId,
                sdpOffer : messege.sdpOffer,
                userName : messege.userName
            }
        }

        if(messege.meetingId)
        {
            socket.broadcast.emit("message",sdpOffer);
        }
    }
}

module.exports = WebrtcHelper;
