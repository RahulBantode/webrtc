const Id = require("short-uuid"); //for unique Id creation.

const meeting_request = {
    
    createMeetingHandler(req,res)
    {
        var MeetingName = req.body.MeetingName;
        var UserName = req.body.UserName;
        if(MeetingName)
        {
            const MeetingId = Id.generate(MeetingName);

            res.status(200).json({
                Messege : "meeting is created and this user joined to the room",
                MeetingName : MeetingName,
                UserName : UserName,
                MeetingId : MeetingId,

            });
        }
        else
        {
            res.status(400).json({
                messege : "meeting name is not provided"
            });
        }
    }
}

module.exports = meeting_request;