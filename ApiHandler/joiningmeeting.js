/**
 * joinMeetingHandler API
 * @param {*} req 
 * @param {*} res 
 */
async function joinMeetingHandler(req, res) {
  //this meeting_id is the unique id which is created at the time of create meeting.
  const { meetingId } = req.body;
  if (meetingId) {
    res.status(200).json({
      message: 'Join to the meeting and room creation using socket',
    });
  } else {
    res.status(400).json({
      message: 'meetingId is not provided at the time of join the meeting.',
    });
  }
}

module.exports = joinMeetingHandler;
