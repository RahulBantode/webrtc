
class KmsWebrtcHelper
{
    handleKmsCallRequest(messege,socket,io)
    {
        const emitCallRequest =
        {
            type : "_KMS_CALL_REQUEST",
            data :
            {
                meetingId : messege.meetingId,
                userId    : messege.userId,
                userName  : messege.userName
            }
        }

        //here is the logic for saving the agent sdp offer into the cache.
        console.log("SDP offer of agent : ",messege.sdpOffer);
        socket.brodcast.emitCallRequest("message",emitCallRequest);
    }

    handleCallResponse(messege,socket,io)
    {
        const emitCallResponse = 
        {
            type : "_KMS_CALL_RESPONSE",
            data :
            {
                meetingId  : messege.meetingId,
                userId     : messege.userId,
                userName   : messege.userName,
                callStatus : messege.callStatus
            }
        }

        /*if(messege.callStatus == true)
        {
            //here is the logic for creation of pipeline and initiate of get kurento client.        
        }
        */
       console.log("sdp offer of client : ",messege.sdpOffer);
        socket.brodcast.emit("message",emitCallResponse);
    }
}

module.exports = KmsWebrtcHelper;
