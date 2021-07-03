const { Socket } = require("dgram");
const express = require("express");
var http  = require("http");
const app = express().use(express.static(__dirname + '/'));
const port = process.env.PORT || 5000;
var server = http.createServer(app);
var io = require("socket.io")(server);
//middleware

app.use(express.json());


io.on("connection", (socket) =>{
    console.log("Connected");
    console.log(socket.id, " jas joined");
    socket.on("/test", (msg) => {
            console.log(msg);
    })
});

server.listen(port,"0.0.0.0", () => {
  console.log("Server Started on port :" + port);  
});