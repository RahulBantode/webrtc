
const Helper = require("./Helper");

class socketHandler 
{
    io;
    HelperObj;

    constructor(io)
    {
        this.io = io;
        this.HelperObj = new Helper();
    }

    init()
    {
        this.io.on("connection", (socket) => {
          /*===========================================================================
          here logic can be replaced when client creates some function on client side
          for posting messege or data if its chat application.
          =============================================================================*/
            console.log("Socket connection established");
    
            socket.on("message", (msg) => {
                switch (msg.type) {
                    case 'JOIN':
                        this.HelperObj.handleJoinMsg(msg.data, socket, this.io);
                        break;
    
                    case 'CHAT':
                        this.HelperObj.handleChatMsg(msg.data, socket, this.io);
                        break;
    
                    default: 
                        console.log("Invalid selection of case "); 
                        break;
                }
    
            });
    
          //on disconnect function.
          socket.on('disconnect', () => {
            console.log("meeting is disconnected");
          });
    
        });

    } //end of the init() method  
}//end of the socketHandler class 


module.exports = socketHandler;






//io.sockets.in('user1@example.com').emit('new_msg', {msg: 'hello'});




