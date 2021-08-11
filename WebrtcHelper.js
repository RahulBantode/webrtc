class WebrtcHelper
{
    handleCallRequest(messege,socket,io)
    {

        emit = 
        {
            type : '_CALL_REQUEST',
            data : 
            {
                meetingId : messege.meetingId,
                userId : messege.userId
            }
        }

        socket.to(messege.meetingId).emit("messege",emit);
        
        //if vrchi method work nahi jhali tr hi use kr 
        //
        //------))))
        //socket.broadcast.emit("messege",emit);
    }
}

module.exports = WebrtcHelper;