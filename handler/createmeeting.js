const Id = require("short-uuid"); //for unique Id creation.

const meeting_request = {
    
    createMeetingHandler(req,res)
    {
        var _meeting_name = req.body.meetingname;
        if(_meeting_name)
        {
            const _meeting_id = Id.generate(_meeting_name);
            
            function returnId()
            {
                return _meeting_id;
            }
            module.exports.returnId = returnId;

            res.status(200).json({
                messege : "meeting is created",
                _meeting_name : _meeting_name,
                _meeting_id : _meeting_id
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
