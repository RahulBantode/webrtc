const uuid = require('short-uuid'); //for unique Id creation.

/**
 * createMeetingHandlerAPI
 * @param {*} req 
 * @param {*} res 
 */
async function createMeetingHandler(req, res) {
  const { meetingName } = req.body;
  console.log(meetingName, 'succsess');

  if (meetingName) {
    const meetingId = uuid.generate(meetingName);

    res.status(200).json({
      message: 'meeting is created',
      meetingName,
      meetingId,
    });
  } else {
    console.log(meetingName, 'error');
    res.status(400).json({
      message: 'meeting name is not provided',
    });
  }
}

module.exports = createMeetingHandler;
