const express = require("express");
const app = express();
var cors = require("cors");
const port = 4001;
const router = require("./routes");
const socketHandler = require("./socket");

const http = require("http").createServer(app);

app.use(cors());
app.use("/",router);

const io = require("socket.io")(http);
//socket class object creation and 
//passing of the io object which consiste the socket.io 
const socket = new socketHandler(io);
socket.socketconnection();


http.listen(port,()=>{
    console.log(`server is listening on = localhost:${port}/`);
})


