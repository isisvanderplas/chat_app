const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.Promise = Promise;

const dbUrl = 'mongodb://user:user10@ds137019.mlab.com:37019/learning-node'

const Message = mongoose.model('Message', {
  name: String,
  message: String
})

app.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  })
})

app.post('/messages', (req, res) => {
  var message = new Message(req.body);

  message.save()
  .then(() => {
    console.log('saved');
    return Message.findOne({message: 'badword'});
  })
  .then( censored => {
    if(censored) {
      console.log('censored words found', censored);
        return Message.deleteOne({_id: censored.id});
    }
    io.emit('message', req.body);
    res.sendStatus(200);
  })
  .catch((err) => {
    res.sendStatus(500);
    return console.error(err);
  })
})

io.on('connection', (socket) => {
  console.log('a user is connected');
})

mongoose.connect(dbUrl, { useNewUrlParser: true }, (err) => {
  console.log('mongodb connection', err);
})

var server = http.listen(3000, () => {
  console.log('server is listening on port ', server.address().port);
});
