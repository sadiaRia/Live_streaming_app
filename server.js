const express = require('express');
const app = express();
const server = require('http').Server(app);
const { v4: uuidv4 } = require('uuid')

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  // res.status(200).send("hello world");
  //embedded js it will help us to get variable from frontend to backend
  // res.render('room');
  res.redirect(`/${uuidv4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})


server.listen(3030);