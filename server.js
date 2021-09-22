const express = require('express');
require('dotenv').config(); //this is .env file
var cors = require('cors');
const router = require('./routes');
const socketHandler = require('./SocketHandler/socket');

const app = express();
const http = require('http').createServer(app);

app.use(cors());
app.use('/', router);

const io = require('socket.io')(http);


//socket class object creation and
//passing of the io object which consist the socket.io
const socket = new socketHandler(io);
socket.init();

http.listen(process.env.PORT, () => {
  console.log(`server is listening on = localhost:${process.env.PORT}/`);
});
