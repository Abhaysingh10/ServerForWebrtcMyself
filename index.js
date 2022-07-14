const { fork } = require("child_process");
const console = require("console");
const { Socket } = require("dgram");
const express = require("express");
var http = require("http");
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
var i = 0;
var peerId;
var gotTheOffer = false;
var gotThePeerId = false;
var offerData;
var answerData;
var candy;
io.on("connection", (socket) => {
  socket.emit("remoteConnection", socket.id);
  socket.on("connection", (id) => {

    socket.on('disconnect', () => {
      console.log("this is disconnecting ", id);
      peers.forEach((ele, index) => {
        if (ele.userid === id) {
            users.splice(index, 1)
            peers.splice(index, 1)
        }
      })

     
    socket.broadcast.emit("broadcastingMessage", "some data")}
    );
    let peer = {
      id: socket.id,
      userid: id
    }
    peers.push(peer);
    console.log("This is peer added", peers);
    socket.emit("connectionResponse", users);
    clients[id] = socket;
    users.push(id);
    socket.broadcast.emit("broadcastingMessage", "some data")
  });

  socket.on("offer", async (offerSdp) => {
    gotTheOffer = true;
    offerData = offerSdp;
  });

  socket.on("answer", (answerSdp) => {
    answerData = answerSdp;
  })

  socket.on("rec", (peerid) => {
    var offertosend;
    //   console.log("This peer is received " , peerid);
    peers.forEach(element => {

      //console.log ("This is elementals ", element['id']);

      if (element['userid'] == peerid) {
        //   console.log("I have the user in list ", peerid, " ", element['userid']);
        //    console.log("And this socketID associated with it ", element['id']);
        gotThePeerId = true;
        io.to(element['id']).emit('broadcastingMessagesdp', offerData);
      }
    });
  })

  socket.on("recAns", (peerid) => {
    var offertosend;
    //  console.log("This peer is received " , peerid);
    peers.forEach(element => {

      //console.log ("This is elementals ", element['id']);

      if (element['userid'] == peerid) {
        // console.log("I have the user in list ", peerid, " ", element['userid']);
        // console.log("And this socketID associated with it ", element['id']);
        gotThePeerId = true;
        io.to(element['id']).emit('broadcastingMessagesdp', answerData);

        io.to(element['id']).emit('recCandy', candy);
      }
    });
  })

  socket.on("sendingCandidate", (candidate) => {
    candy = candidate;
    console.log("I also got the candidate ", candidate);
  });

  socket.on("_sendingPeerId", (data) => {
    peerId = data;
    console.log("This is peerId received from client", peerId);
  })

  socket.on("getMeSdp", () => {
    //console.log("sending sdp" , description.get(0));
    socket.emit("givingsdp", description.get(0));
    socket.emit("givingCandidate", description.get(1));
  });

  socket.on("reply", () => {
    //console.log(description);
    socket.emit("answer", description);
  });

  try {
    socket.on("ans", (data) => {
      var obj = JSON.parse(data);
      var value = obj.data.to;  // ------> Got the value of "to" to emit to offer sender

      peers.forEach((element, index) => {
        if (element.userid == value) {
          console.log("Got the element", element.id);
          socket.broadcast.to(element.id).emit("ansResponse", data);
        } else {
          console.log("Missed");
        }
      });

    });
  } catch (error) {
    console.log("This was the error", error);
  }

  socket.on("SendingpeerID", (peerId) => {
    console.log("This is peerId", peerId);
  });




  socket.on("refresh", () => {
    socket.emit("RefreshResponse", users);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log("Server Started on port :" + port);
});