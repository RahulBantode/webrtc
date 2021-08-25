
//global declaration of the userlist array.

class SessionsCache
{
    userList = [];
    usersMesseges = [];

    sessionStore = {};
    
    //this is responsible for saving the user details
    saveUserDetails(meetingId,userId,userName,sdpOffer)
    {
        let meetingStore = this.sessionCache.sessionStore.get(meetingId);

        let userDetails = {};
        if(!meetingStore) {
            this.sessionCache.sessionStore[meetingId] = {};
            this.sessionCache.sessionStore[meetingId][userId] = userDetails;
        } else {
            userDetails = this.sessionCache.sessionStore[meetingId][userId];
        }
        userDetails.userName = userName;
        userDetails.sdpOffer = sdpOffer;

        console.log(sessionStore);
        
    }

    //reponsible for get the user data.
    setUserData(users)
    {
        userList.push(users);
    }

    //responsible for the storing the messeges of users with respective their names.
    setUsersChat(usersChat)
    {
        usersMesseges.push(usersChat);
    }

    //TODO - clean
    displayUsers()
    {
        console.log(userList);
    }

    getArray()
    {
        return userList;
    }
}

module.exports = SessionsCache;