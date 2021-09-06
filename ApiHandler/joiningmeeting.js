
const join_meeting = {
    
    joinMeetingHandler(req,res)
    {
        //this meeting_id is the unique id which is created at the time of create meeting.
        meeting_id = req.body.meeting_id;
        if(meeting_id)
        {
            res.status(200).json({
                messege : "Join to the meeting and room creation using socket",

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