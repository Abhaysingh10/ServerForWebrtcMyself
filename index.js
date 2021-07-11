const console = require("console");
const { Socket } = require("dgram");
const express = require("express");
var http  = require("http");
const { emit } = require("process");
const app = express().use(express.static(__dirname + '/'));
const port = process.env.PORT || 5000;
var server = http.createServer(app);
var io = require("socket.io")(server);
//middleware

app.use(express.json());

var clients = {};
var users = [];


io.on("connection", (socket) =>{
    socket.emit("remoteConnection", socket.id);
    console.log("Connected");
    //console.log("This is Socket -> ",socket);
    socket.on("/test", (msg) => {
            console.log(msg);
            
    })
    socket.on("connection", (id) =>{
      console.log(id, " has joined");
      socket.emit("connectionResponse", users);
      clients[id] = socket;
    //  console.log(clients);
        users.push(id);
    })
    socket.on("offer", (data)=>{
      console.log(data);
    })

    socket.on("disconnectt", (userId) => {
      console.log("Request to remove -> ");
      //  let indexx = users.findIndex(userId);
      //  console.log(indexx);
      //  users.splice(indexx, 1);
      console.log(users);
       socket.emit("RefreshResponse", users);
    });
    socket.on("refresh",()=> {
      console.log("Refreshing")
      socket.emit("RefreshResponse", users);
    })
});

server.listen(port,"0.0.0.0", () => {
  console.log("Server Started on port :" + port);  
});