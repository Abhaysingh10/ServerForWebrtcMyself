const { fork } = require("child_process");
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
let peers = [];
var description = new Map();
var i = 0 ;


io.on("connection", (socket) =>{
    socket.emit("remoteConnection", socket.id);
    console.log("Connected with " , socket.id);
    socket.on("connection", (id) =>{
      //console.log(peers, " has joined");
      let peer = {
        id : socket.id,
        userid : id
      }
      peers.push(peer);
      console.log("This is peer added",peers);
      socket.emit("connectionResponse", users);
      clients[id] = socket;
    //  console.log(clients);
        users.push(id);

    });
  
    socket.on("offer", (data)=>{
      description.set(i, data);
      i++;
      socket.broadcast.emit('broadcast', "Message received, turn the button blue" );             // Goes into switch statement in flutter call widget.
      });

      socket.on("getMeSdp", ()=>{
          //console.log("sending sdp" , description.get(0));
          socket.emit("givingsdp", description.get(0));
          socket.emit("givingCandidate", description.get(1));
      });
      
    socket.on("reply", ()=>{
        //console.log(description);
        socket.emit("answer", description);
    });
    
    try {
      socket.on("ans", (data)=>{
        var obj = JSON.parse(data);
        var value = obj.data.to;  // ------> Got the value of "to" to emit to offer sender
       // console.log(users);
        //console.log("Displaying the value in ans event", id);
        peers.forEach((element, index) =>{
          if(element.userid == value) {
            console.log("Got the element" ,element.id);
            socket.broadcast.to(element.id).emit("ansResponse", data);
        //  socket.emit("ansResponse", element.id)
          } else {
            console.log("Missed");
          }
        });
        // for(let key in peers){
        //   console.log(key);
        //   console.log(peers[key]);
        // }
      });
    } catch (error) {
      console.log("This was the error" , error);
    }
   
    socket.on("SendingpeerID", (peerId)=>{
        console.log("This is peerId" , peerId);
    });

    // socket.on("answer", (answerData)=>{
    //     console.log("Answer Data " , answerData);
    // });
    
    
    socket.on("refresh",()=> {
      console.log("Refreshing")
      socket.emit("RefreshResponse", users);
    })
  });

server.listen(port,"0.0.0.0", () => {
  console.log("Server Started on port :" + port);  
});