/* 
  **************************** SESSION CACHE ****************************
  sessionStore = {
      1212(meetingId) : {
        userlist : {
          {
            userId = 012,
            userName = "Rahul"
          }
          {
            userId = 022,
            userName = "Karan"
          }
        },

        webrtcPipeline : [webrtcPipelineObject],
        kurentoClient : [kurentoClientObject],
        
        participants : {
          012(userId) : {
            userName : "Rahul",
            sdpOffer : [sdpOfferObject],
            webrtcEndpoint : [webrtcEndpointObject],
            iceCandidateQueue : [IceCandidates...]
          },
          022(userId) : {
            userName : "Karan",
            sdpOffer : [sdpOfferObject],
            webrtcEndpoint : [webrtcEndpointObject],
            iceCandidateQueue : [IceCandidates...]
          }
        }
      }
  }

  **************************** SESSION CACHE *****************************/

class SessionsCache {
  //by using this we are able to create only one instance of SessionCache class
  static getInstance() {
    if (SessionsCache.instance == null) {
      SessionsCache.instance = new SessionsCache();
    }
    return SessionsCache.instance;
  }

  constructor() {
    this.sessionStore = {};
  }

  /*************** CHAT messages + plain WebRTC START *****************/

  //this function is used to add all joined users of meeting to the sessionCache
  addUserToMeeting(meetingId, user) {
    if (!this.sessionStore[meetingId]) {
      this.sessionStore[meetingId] = {};
    }
    let userList = this.sessionStore[meetingId].userList;
    if (!userList) {
      userList = [];
      this.sessionStore[meetingId].userList = userList;
    }
    this.sessionStore[meetingId].userList.push(user);
  }

  //getter of the userList Array
  getMeetingUserList(meetingId) {
    return this.sessionStore[meetingId].userList;
  }

  //responsible for the storing the messages of users with respective their names.
  saveUsersChat(meetingId, usersChat) {
    let chatMessages = this.sessionStore[meetingId].chatMessages;
    if (!chatMessages) {
      chatMessages = [];
      this.sessionStore[meetingId].chatMessages = chatMessages;
    }
    this.sessionStore[meetingId].chatMessages.push(usersChat);
  }

  /*************** CHAT messages + plain WebRTC END *****************/


  /***************************** KMS WEBRTC *****************************/

  //this function is responsible for saving the user details
  saveUserDetails(meetingId, userId, userName, sdpOffer) {
    let meetingDetails = this.sessionStore[meetingId];
    let userDetails = { userName, sdpOffer };

    if (!meetingDetails) {
      this.sessionStore[meetingId] = {};
    }

    let participants = this.sessionStore[meetingId].participants;
    if (!participants) {
      this.sessionStore[meetingId].participants = {};
    }
    this.sessionStore[meetingId].participants[userId] = userDetails;
  }

  //getter of the meeting details
  getMeetingDetails(meetingId) {
    return this.sessionStore[meetingId];
  }

  //this function set the mediaPipeline into the sessioncache.
  setMediaPipeline(meetingId, webrtcPipeline) {
    this.sessionStore[meetingId].webrtcPipeline = webrtcPipeline;
  }

  //this function is used to set the kurento client into the sessionCache.
  setKurentoClient(meetingId, kurentoClient) {
    this.sessionStore[meetingId].kurentoClient = kurentoClient;
  }

  //this function set the userEndpoint into the sessioncache
  setUserEndpoints(meetingId, userId, webrtcEndpoints) {
    this.sessionStore[meetingId].participants[userId].webrtcEndpoints = webrtcEndpoints;
  }

  //this function is used to initialize and get the iceCandidates
  getIceCandidateQueueForParticipant(meetingId, participantId) {
    let iceCandidateQueue = this.sessionStore[meetingId].participants[participantId].iceCandidateQueue;

    if (!iceCandidateQueue) {
      iceCandidateQueue = [];
      this.sessionStore[meetingId].participants[participantId].iceCandidateQueue = iceCandidateQueue;
    }
    return iceCandidateQueue;
  }

  //this function is used to delete webrtcendpoint,sdpoffer, pipeline,kurentoclient from sessionCache
  cleanupKMSWebRTCData(meetingId) {
    let meetingDetails = this.sessionStore[meetingId];
    if (meetingDetails.webrtcPipeline) {
      Object.keys(meetingDetails.participants).forEach((participantId) => {
        delete meetingDetails.participants[participantId].webrtcEndpoints;
        delete meetingDetails.participants[participantId].sdpOffer;
        meetingDetails.participants[participantId].iceCandidateQueue = [];
      });
      delete meetingDetails.webrtcPipeline;
      delete meetingDetails.kurentoClient;
    }
  }

  /***************************** KMS WEBRTC *****************************/
}

module.exports = SessionsCache.getInstance();
