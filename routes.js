const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");

router.use(bodyparser.urlencoded({extended:false}));
router.use(bodyparser.json());

const meeting = require("./handler/createmeeting");
const join_meeting = require("./handler/joiningmeeting");

//This handler works when the meeting is start or newly created.
router.post("/createmeeting",(req,res)=>{
    meeting.createMeetingHandler(req,res);
});

//This handler works when the meeting_id provided and wants to join the
//the meeting.
router.post("/joinmeeting",(req,res)=>{
    join_meeting.joinMeetingHandler(req,res);
})





module.exports = router;
