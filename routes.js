const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');

router.use(bodyparser.urlencoded({ extended: false }));
router.use(bodyparser.json());

const createMeeting = require('./ApiHandler/createMeeting');
const joinMeeting = require('./ApiHandler/joiningMeeting');

//This handler works when the meeting is start or newly created.
router.post('/createMeeting', (req, res) => {
  createMeeting(req, res);
});

//This handler works when the meeting_id provided and wants to join the the meeting.
router.post('/joinMeeting', (req, res) => {
  joinMeeting(req, res);
});

module.exports = router;
