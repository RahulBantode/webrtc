const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");

router.use(bodyparser.urlencoded({ extended: false }));
router.use(bodyparser.json());

const createMeeting = require("./ApiHandler/createmeeting");
const joinMeeting = require("./ApiHandler/joiningmeeting");

//This handler works when the meeting is start or newly created.
router.post("/createmeeting", (req, res) => {
    createMeeting.createMeetingHandler(req, res);
    //console.log(meeting.name);
});

//This handler works when the meeting_id provided and wants to join the
//the meeting.
router.post("/joinmeeting", (req, res) => {
    joinMeeting.joinMeetingHandler(req, res);
})





module.exports = router;
