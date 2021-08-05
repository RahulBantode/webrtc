const io = require("./server");
const meeting = require("./handler/createmeeting");

io.on("connection",(socket)=>{
    /*===========================================================================
    here logic can be replaced when client creates some function on client side
    for posting messege or data if its chat application.
    =============================================================================*/
    console.log("Socket connection established");
    let _meeting_id = 111; //this temporary purpose, I have to make changes.
    
    socket.on("CREATE_MEETING",()=>{
        console.log("The create meeting request is hits");
        /*===============================
            para list of emit fun.
            1. event name
            2. is string which is passed
        ==================================*/
        //_meeting_id = meeting.createMeetingHandler();

        socket.emit("_CREATE_MEETING",{
          _meeting_id : _meeting_id,
          messege : "Meeting is created"
        });

    });

    //after join the meeting the room is created,
    //_meeting_id is the unique id which used as room_id
    socket.on("_JOIN",(_meeting_id)=>{
      const roomClients = io.sockets.adapter.rooms[_meeting_id] || {length : 0}
      const numberOfClients = roomClients.length;

      if(numberOfClients == 0)
      {
        console.log(`Creating the room and emiting the _ROOM_CREATED socket event`);
        socket.join(_meeting_id);
        socket.emit('_ROOM_CREATED',_meeting_id);
      }
      else if(numberOfClients == 1)
      {
        console.log(`Joining the room and emiting the _ROOM_JOINED socket event`);
        socket.join(_meeting_id);
        socket.emit('_ROOM_JOINED',_meeting_id);
      }
      else
      {
        console.log(`can't join the room and emmiting the room_full socket event`);
        socket.emit("_ROOM_FULL",_meeting_id);
      }

    });
    
    
    socket.on('disconnect',()=>{
        console.log("meeting is disconnected");
    });

});

//In the client side file ....client needs to call the socket function
//then socket gets connected with server.











/*
// server-side
io.on("connection", (socket) => {
  socket.emit("hello", "world");
});

// client-side
socket.on("hello", (arg) => {
  console.log(arg); // world
});

=================================================

// server-side
io.on("connection", (socket) => {
  socket.on("hello", (arg) => {
    console.log(arg); // world
  });
});

// client-side
socket.emit("hello", "world");

*/