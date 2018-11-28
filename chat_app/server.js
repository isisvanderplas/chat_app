const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const dbUrl = 'mongodb://user:user10@ds137019.mlab.com:37019/learning-node'

var messages= [
  {name: 'Tim', message: 'Hi'},
  {name: 'Tom', message: 'Hello'}
]

app.get('/messages', (req, res) => {
  res.send(messages);
})

app.post('/messages', (req, res) => {
  messages.push(req.body);
  io.emit('message', req.body)
  res.sendStatus(200);
})

io.on('connection', (socket) => {
  console.log('a user is connected');
})

mongoose.connect(dbUrl, (err) => {
  console.log('mongodb connection', err);
})

var server = http.listen(3000, () => {
  console.log('server is listening on port ', server.address().port);
});
