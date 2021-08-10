class Helper
{
    //this function responsible for handling the join event.
    handleJoinMsg(message, socket, io) 
    {
        const joinReply = 
        {
            type: '_JOIN',
            data: 
            {
              meetingId: message.meetingId
            }
        }

        console.log("user joined in room:", message.meetingId);
        let roomClients = io.sockets.adapter.rooms.get(message.meetingId);
    
        let numberOfClients = roomClients ? roomClients.size : 0;
        console.log("roomClient before:", roomClients, numberOfClients);
        
        if (numberOfClients < 3) 
        {
          socket.join(message.meetingId);
          roomClients = io.sockets.adapter.rooms.get(message.meetingId);
          numberOfClients = roomClients ? roomClients.size : 0;
          console.log("roomClient after:", roomClients, numberOfClients);
        }
        else 
        {
          console.log(`can't join the room and emmiting the room_full socket event`);
          joinReply.data.isRoomFull = true;
        }
        socket.emit('message', joinReply);
    }//joinhandler function end.


    //This will store all the messeges send by client.
    allmeseges = [];
    //function handling the chat between the clients
    chathandler(chatMessage,socket,io)
    {
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
        
        allmeseges.push(chatReply.data);
        console.log(chatReply);

        if(chatMessage.meetingId)
        {
            console.log("The messege is : ",chatReply);
             
            //to send the messege to all the clients inside the room broadcast event is used.
            socket.broadcast.emit("messege",chatReply);
            
            //socket.to(message.meetingId).emit("_CHAT",message.data);
        }

    }//chathandler function end
}//Helper function end

module.exports = Helper;