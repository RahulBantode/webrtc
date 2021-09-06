
//global declaration of the userlist array.

var sessionStore = {};

class SessionsCache {
    userList = [];
    usersMesseges = [];
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

    getSessionStore() {
        return sessionStore;
    }

    //this function set the mediaPipeline into the sessioncache.
    setMediaPipeline(meetingId, webrtcPipeline) {
        //console.log("webrtcpipeline : ", webrtcPipeline.id);
        sessionStore[meetingId].webrtcPipeline = webrtcPipeline;

    }
    //this function set the userEndpoint into the sessioncache
    setUserEndpoints(meetingId, userId, webrtcEndpoints) {
        //console.log("Endpoint from sessioncache : ", webrtcEndpoints);
        sessionStore[meetingId].participants[userId].webrtcEndpoints = webrtcEndpoints;
    }

    //this function is used to initialize the iceCandidateQueue for the specified user.
    initializeIceCandidateQueue(meetingId, userId) {
        sessionStore[meetingId].participants[userId].iceCandidateQueue = [];
    }
    //reponsible for get the user data.
    setUserData(users) {
        this.userList.push(users);
    }

    //responsible for the storing the messeges of users with respective their names.
    setUsersChat(usersChat) {
        this.usersMesseges.push(usersChat);
    }

    getArray() {
        return userList;
    }
}

module.exports = SessionsCache;