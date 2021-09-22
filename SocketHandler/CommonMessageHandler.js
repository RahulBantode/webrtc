const SessionsCache = require('../Cache/SessionCache');

class CommonMessageHandler {

  //this function responsible for handling the join event.
  handleJoinMsg(message, socket, io) {
    const joinReply = {
      type: '_JOIN',
      data: {
        meetingId: message.meetingId,
      },
    };

    //this function is used to get room in that meetingId
    let roomClients = io.sockets.adapter.rooms.get(message.meetingId);
    let numberOfClients = roomClients ? roomClients.size : 0;

    if (numberOfClients < 3) {
      socket.join(message.meetingId);

      const user = {
        userName: message.userName,
        userId: socket.id,
      };

      //add the user to the sessionCache
      SessionsCache.addUserToMeeting(message.meetingId, user);

      roomClients = io.sockets.adapter.rooms.get(message.meetingId);
      numberOfClients = roomClients ? roomClients.size : 0;
    } else {
      console.log(`Room is full , unable to join the room !!!`);
      joinReply.data.isRoomFull = true;
    }
    socket.emit('message', joinReply);
  }

  //function handling the chat between the clients
  handleChatMsg(chatMessage, socket) {
    const chatReply = {
      type: '_CHAT',
      data: {
        userName: chatMessage.userName,
        msgData: chatMessage.msg,
      },
    };

    //this function is used to save the Users chat
    SessionsCache.saveUsersChat(chatMessage.meetingId, chatReply.data);

    if (chatMessage.meetingId) {
      let userList = SessionsCache.getMeetingUserList(chatMessage.meetingId);
      userList.foreach((user) => {
        if (user.userId != socket.id) {
          socket.broadcast.to(user.userId).emit('message', chatReply);
        }
      });
    }
  }
}

module.exports = CommonMessageHandler;
