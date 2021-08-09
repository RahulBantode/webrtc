
class socketHandler 
{
    io;
    HelperObj;

    constructor(io)
    {
        this.io = io;
        this.HelperObj = new Helper();
    }

    socketconnection()
    {
        this.io.on("connection", (socket) => {
          /*===========================================================================
          here logic can be replaced when client creates some function on client side
          for posting messege or data if its chat application.
          =============================================================================*/
          console.log("Socket connection established");

          socket.on("message", (msg,chat) => {
            switch (msg.type) 
            {
                case 'JOIN':
                    this.HelperObj.joinhandler(msg.data,socket,this.io);
                    break;

                case 'CHAT':
                    this.HelperObj.chathandler(chat,msg.data,socket,this.io);
                    break;
                     
                default : console.log("Invalid selection of case "); break;
            }

          });    
            
            //on disconnect function.
            socket.on('disconnect',()=>{
                console.log("meeting is disconnected");
            });

        });
    } //end of the socketconnection() method  
}//end of the socketHandler class 

class Helper
{
    //this function responsible for handling the join event.
    joinhandler(message,socket,io)
    {
        //let message = msg.data;
        console.log("user joined in room:", message.meetingId);
        let roomClients = io.sockets.adapter.rooms.get(message.meetingId);//io.sockets.clients(_meeting_id)//io.sockets.adapter.rooms[_meeting_id];

        let numberOfClients = roomClients ? roomClients.size : 0;
        console.log("roomClient before:", roomClients, numberOfClients);

        if (numberOfClients < 3) 
        {
          socket.join(message.meetingId);
          roomClients = io.sockets.adapter.rooms.get(message.meetingId);//io.sockets.clients(_meeting_id)//io.sockets.adapter.rooms[_meeting_id];
          numberOfClients = roomClients ? roomClients.size : 0;
          console.log("roomClient after:", roomClients, numberOfClients);

          socket.emit('_JOIN', message.meetingId);
        } 
        else 
        {
          console.log(`can't join the room and emmiting the room_full socket event`);
          socket.emit("_ROOM_FULL", message.meetingId);
        }
    }//joinhandler function end.

    //The data which comes from the client after socket connected.
    //so using the messege.meetingId which is our room.
    //so I send reply back to all the room clients using - socket.broadcast.emit("_CHAT",server);
    //(data which is comes from client is displayed to all the clients inside the rooms)
    chathandler(chat,messege,socket,io)
    {
        //this is the reply object which consist the username who sends the messege and
        //data which sends . (and then this data is displayed to all the connected clients.)
        
        /*client needs to create one object like (implement it in client side)
        chat = 
        {
            t
            msgString = "Hii all clients ,,, Welcome to the room",or here client can give the data from input field.
        }
        */
        reply = 
        {
            UserName : messege.UserName,
            msgData  : chat.msgString
        }

        //This will store all the messeges send by client.
        var allmeseges = [];
        allmeseges.push(reply.msgData);

        if(message.meetingId)
        {
            console.log("The messege is : ",reply);
            //let clientId = socket.id ; //it will gives an socket id.
            
            //to send the messege to all the clients inside the room broadcast event is used.
            socket.broadcast.emit("_CHAT",reply.data);
            
            //socket.to(message.meetingId).emit("_CHAT",message.data);
        }

    }//chathandler function end
}

module.exports = socketHandler;






//io.sockets.in('user1@example.com').emit('new_msg', {msg: 'hello'});




