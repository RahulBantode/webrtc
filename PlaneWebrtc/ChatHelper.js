const SessionsCache = require("../sessionCache");


class Helper {
    sessioncache;
    constructor() {
        this.sessionCache = new SessionsCache();

    }

    //this function responsible for handling the join event.
    handleJoinMsg(message, socket, io) {
        const joinReply =
        {
            type: '_JOIN',
            data:
            {
                meetingId: message.meetingId
            }
        }

        //console.log("user joined in room:", message.meetingId);
        let roomClients = io.sockets.adapter.rooms.get(message.meetingId);

        let numberOfClients = roomClients ? roomClients.size : 0;
        //console.log("roomClient before:", roomClients, numberOfClients);

        if (numberOfClients < 3) {
            socket.join(message.meetingId);
            //this object for every join user to the meeting
            const user =
            {
                meetingId: message.meetingId,
                userName: message.userName,
                userId: socket.id
            }

            /*======================================================================== 
              getUserData() function of SessionCache class-
               path          :- ./sessionCache.js 
               parameter     :-  takes the one parameter as object
               functionality :-  It will push that object into the userList array
            ===========================================================================*/
            this.sessionCache.setUserData(user);

            roomClients = io.sockets.adapter.rooms.get(message.meetingId);
            numberOfClients = roomClients ? roomClients.size : 0;
            //console.log("roomClient after:", roomClients, numberOfClients);
        }
        else {
            console.log(`Room is full , unable to join the room !!!`);
            joinReply.data.isRoomFull = true;
        }
        socket.emit('message', joinReply);
    }//joinhandler function end.


    //function handling the chat between the clients
    handleChatMsg(chatMessage, socket, io) {
        //this is the reply object which consist the username who sends the messege and
        //data which sends . (and then this data is displayed to all the connected clients.)

        const chatReply =
        {
            type: '_CHAT',
            data:
            {
                userName: chatMessage.userName,
                msgData: chatMessage.msg
            }
        }

        /*======================================================================== 
             getUsersChat() function of SessionCache class-
             path          :- ./sessionCache.js 
             parameter     :-  takes the one parameter as object (which contains chat of users)
             functionality :-  It will push that object into the userMesseges array.
          ===========================================================================*/
        this.sessionCache.setUsersChat(chatReply.data);

        let userList = this.sessionCache.getArray();
        let arrayLength = userList.length;
        if (chatMessage.meetingId) {
            for (var icnt = 0; icnt < arrayLength; icnt++) {
                if (icnt != 0) {
                    let userId = userList[icnt].userId;
                    //console.log(userId);
                    socket.broadcast.to(userId).emit("message", chatReply.data);
                }

            }

            //console.log("The messege is : ",chatReply);



        }

    }//chathandler function end
}//Helper function end

module.exports = Helper;
