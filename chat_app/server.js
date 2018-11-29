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

app.post('/messages', async (req, res) => {

  try {

    var message = new Message(req.body);

    const savedMessage = await message.save()

      console.log('saved');

    const censored = await Message.findOne({message: 'badword'});

    if (censored)
      await Message.deleteOne({_id: censored.id});
    else
      io.emit('message', req.body);

    res.sendStatus(200);

  } catch (error) {
      res.sendStatus(500);
      return console.error(error);
  }

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
