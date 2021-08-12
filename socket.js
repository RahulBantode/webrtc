
const Helper = require("./Helper");  //It having the handler for chatting and joining the users.
const SessionsCache = require("./sessionCache"); //It maintain the log of the users and its messeges.
const WebrtcHelper = require("./WebrtcHelper");  //It having the function of wwebrtc requests.

class socketHandler 
{
    io;
    HelperObj;
    cacheObj;
    webrtcobj;

    constructor(io)
    {
        this.io = io;
        this.HelperObj = new Helper();
        this.cacheObj = new SessionsCache();
        this.webrtcobj = new WebrtcHelper();
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
                        this.cacheObj.displayUsers(); //its for check whether function working or not.
                        break;
    
                    case 'CHAT':
                        this.HelperObj.handleChatMsg(msg.data, socket, this.io);
                        break;

                    case 'CALL_REQUEST':
                        this.webrtcobj.handleCallRequest(msg.data,socket,this.io);
                        break;
                    
                    case 'CALL_RESPONSE':
                        this.webrtcobj.handleCallResponse(msg.data,socket,this.io);
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






//let clientId = socket.id ; //it will gives an socket id.
//io.sockets.in('user1@example.com').emit('new_msg', {msg: 'hello'});
