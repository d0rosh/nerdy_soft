const express = require('express');
var app = express();
const http = require('http');
const socketIo = require('socket.io');
const server = http.Server(app);
const io = socketIo(server);
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const keys = require('./configuration/keys');

mongoose
  .connect(process.env.MONGODB_URI || keys.mongoURI)
  .then(() => console.log('MongoDB connected.'))
  .catch(error => console.log(error));

// ****MIDDLEWARES****
app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

const TaskMethods = require('./controllers/task');
var connectedUsers = {};
io.on('connection', socket => {
  socket.on('register', function(username) {
    socket.username = username;
    connectedUsers[username] = socket;
  });

  socket.on('private_chat', function(data) {
    const to = data.to;
    if (connectedUsers.hasOwnProperty(to)) {
      var promise = new Promise((resolve, reject) => {
        var x = TaskMethods.updateTask(data.to);
        if (x) {
          resolve(x);
        } else {
          reject();
        }
      });

      promise.then(
        res => {
          connectedUsers[to].emit('private_chat', {
            data: res
          });
        },
        err => console.log('error')
      );
    }
  });

  socket.on('disconnect', function() {
    console.log('disconnect: ', socket.id);
  });
});

const auth = require('./routes/auth');
const profile = require('./routes/profile');
const task = require('./routes/task');

app.use('/auth', auth);
app.use('/profile', profile);
app.use('/task', task);

// if (process.env.NODE_ENV === 'production') {
app.use(express.static(__dirname + '/public'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});
// }

// ****HANDLING ERRORS****

app.use((req, res, next) => {
  const err = new Error('not found!');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message
  });
});

const port = process.env.PORT || 3333;
server.listen(port, function() {
  console.log(`Server listen port ${port}`);
});

module.exports = app;
