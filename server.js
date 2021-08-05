const express = require("express");
const app = express();
const port = 3000;
const router = require("./routes");

const http = require("http").createServer(app);


app.use("/",router);

const io = require("socket.io")(http);

http.listen(port,()=>{
    console.log(`server is listening on port:${port}`);
})



module.exports = io;
