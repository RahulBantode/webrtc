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
                callStatus :  messege.callStatus
            }
        }

        if(messege.meetingId)
        {
            socket.broadcast.emit("message",emitResponse);
        }    
    }
}

module.exports = WebrtcHelper;
