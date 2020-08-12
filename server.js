const express = require('express');
const app = express();
const server = require('http').Server(app);
const { v4: uuidv4 } = require('uuid')
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/peerjs', peerServer);

app.get('/', (req, res) => {
  // res.status(200).send("hello world");
  //embedded js it will help us to get variable from frontend to backend
  // res.render('room');
  res.redirect(`/${uuidv4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => { //now we need listed that userId after emit
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId); //emit for every one that certain user just connected
    // console.log("joined room");
  })
})



server.listen(3030);