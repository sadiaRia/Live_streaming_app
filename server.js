const express = require('express');
const app = express();
const server = require('http').Server(app);

app.set('view engine','ejs');

app.get('/', (req, res) => {
// res.status(200).send("hello world");
//embedded js it will help us to get variable from frontend to backend
res.render('room');
})


server.listen(3030);