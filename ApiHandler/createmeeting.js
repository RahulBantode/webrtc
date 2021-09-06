const Id = require("short-uuid"); //for unique Id creation.

const meeting_request = {

    createMeetingHandler(req, res) {
        var meetingName = req.body.meetingName;
        console.log(meetingName, 'succsess');

        if (meetingName) 
        {
            const meetingId = Id.generate(meetingName);

            res.status(200).json({
                message: "meeting is created",
                meetingName,
                meetingId
            });
        }
        else 
        {
            console.log(meetingName, 'error');
            res.status(400).json({
                messege: "meeting name is not provided"
            });
        }
    }
}

module.exports = meeting_request;