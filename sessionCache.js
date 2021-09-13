
//global declaration of the sessionStore object
var sessionStore = {};

//global declaration of the userList and userMesseges array. 
var userList = [];
var usersMesseges = [];

class SessionsCache {

    meetingId;

    //setter for meetingId
    setMeetingId(meetingId) {
        this.meetingId = meetingId;
    }

    //getter for meetingId
    getMeetingId() {
        return this.meetingId;
    }

    //this is responsible for saving the user details
    saveUserDetails(meetingId, userId, userName, sdpOffer) {
        let meetingStore = sessionStore[meetingId];
        let userDetails = {};

        if (!meetingStore) {
            this.setMeetingId(meetingId);
            sessionStore[meetingId] = {};
            sessionStore[meetingId].participants = {};
            sessionStore[meetingId].participants[userId] = userDetails;
        } else {
            sessionStore[meetingId].participants[userId] = userDetails;
        }

        userDetails.userName = userName;
        userDetails.sdpOffer = sdpOffer;

        console.log("Users data from session cache :", sessionStore);

    }

    //getter of the sessionStore object.
    getSessionStore() {
        return sessionStore;
    }

    //this function set the mediaPipeline into the sessioncache.
    setMediaPipeline(meetingId, webrtcPipeline) {
        sessionStore[meetingId].webrtcPipeline = webrtcPipeline;
        console.log("webrtcpipeline from sessionCache : ", sessionStore[meetingId].webrtcPipeline);
    }

    //this function set the userEndpoint into the sessioncache
    setUserEndpoints(meetingId, userId, webrtcEndpoints) {
        sessionStore[meetingId].participants[userId].webrtcEndpoints = webrtcEndpoints;
        //console.log("Endpoint from sessioncache : ", sessionStore[meetingId].participants[userId].webrtcEndpoints);
    }

    //this function is used to initialize the iceCandidateQueue for the specified user.
    initializeIceCandidateQueue(meetingId, userId) {
        sessionStore[meetingId].participants[userId].iceCandidateQueue = [];
    }

    setSdpOfferNull(meetingId, userId) {
        sessionStore[meetingId].participants[userId].sdpOffer = null;
        console.log("SDP offer : ", sessionStore[meetingId].participants);
    }

    //reponsible for set the user data.
    setUserData(users) {
        userList.push(users);
    }

    //responsible for the storing the messeges of users with respective their names.
    setUsersChat(usersChat) {
        usersMesseges.push(usersChat);
    }

    //getter of the userList Array
    getArray() {
        return userList;
    }
}

module.exports = SessionsCache;