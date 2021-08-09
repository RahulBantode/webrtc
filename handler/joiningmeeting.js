
const join_meeting = {
    

    joinMeetingHandler(req,res)
    {
        //this meeting_id is the unique id which is created at the time of create meeting.
        MeetingId = req.body.MeetingId;
        UserName  = req.body.UserName;
         
        if(MeetingId)
        {
            res.status(200).json({
           
            messege : "You are joined to the room",
            MeetingId : MeetingId,
            UserName : UserName,

            });
    
        }
        else
        {
            res.status(400).json({
                messege : "meeting_id is not provided at the time of join the meeting."
            });
        }
    }
}

module.exports = join_meeting;