class demo
{
    fun()
    {
        console.log("Inside the <fun> function class <demo>");
    } 
    
    hello()
    {
        return "Inside the hello method";
    }
    
         reply = 
         {
            admin : "Rahul Bantode",
            data : 
            {
                uname : "mohit",
                id : 101
            },
            details : this.hello(),

            messeges : [],

            type : ["JOIN" , "CHAT" ,"Me"]
            
        }
    
}



class mode 
{
    constructor()
    {
        this.demoobj = new demo();
    }

    gun()
    {
        console.log("Inside the gun method of mode class");
        this.demoobj.fun();
    }

    sun()
    {
        var array = ["Mango","Oranges","santra"];
        console.log(this.demoobj.reply);
        console.log(this.demoobj.reply.details);
        this.demoobj.reply.messeges.push(array);
        console.log(this.demoobj.reply.messeges);
        
        let type = "JOIN";
        switch(type)
        {
            case "JOIN" : console.log("Join");
            break;
        }
    }
}

const mObj = new mode();
mObj.gun();
mObj.sun();


class meeting
{
    meetingId;
    constructor()
    {
        this.meetingId = 1234;
    }

    details = 
    {
        meetingId : this.meetingId

    }
    
}


class sessionsCache
{
    obj;
    constructor()
    {
        this.obj = new meeting();        
    }

    display()
    {
        console.log("Meeting Id : ",this.obj.data.meetingId);
        console.log("UserName : ",this.obj.data.userNames);
    }

    Add()
    {
        let uname = "Prashant Patil";
        this.obj.data.userNames.push(uname);
    }

    array = [
        {user : "Rahul",mobile:8624924587},
        {user : "kunal",mobile:9734237865},
        {user : "nitin",mobile:9012437824}
    ]

    arrayAccess()
    {
        console.log("length of array : ", this.array.length);
        let icnt ;
        for(icnt=0; icnt < this.array.length; icnt++)
        {
            if(icnt != 0)
                console.log(`UserName : ${this.array[icnt].user} , Mobile : ${this.array[icnt].mobile}`);
        }      
    }
}

var o = new sessionsCache();
//o.display();
//o.Add();
//o.display();
o.arrayAccess();







/*  For sockets.

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