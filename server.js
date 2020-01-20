const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
var session = require('express-session');

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(session({resave: true, saveUninitialized: true, secret: 'XCR3rsasa%RDHHH', cookie: { maxAge: 60000 }}));

const rooms = { }

app.get('/', (req, res) => {
  res.render('index', { rooms: rooms })
})

app.post('/room', (req, res) => {
  console.log(req.body.room);
  if (rooms[req.body.room] != null) {
    return res.redirect('/')
  }
  rooms[req.body.room] = { users: {} }
  res.redirect(req.body.room)
})

app.get('/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/')
  }
  res.render('room', { roomName: req.params.room })
})

server.listen(3000)

io.on('connection', socket => {



  socket.on('new-user', (room) => {
    let name = createName();
    socket.join(room)
    rooms[room].users[socket.id] = name
    io.sockets.to(room).emit('user-connected', rooms[room])
  })

  socket.on('send-chat-message', (room, message) => {
    socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
  })

  socket.on('disconnect', () => {
    console.log('rooms=',rooms);
    getUserRooms(socket).forEach(room => {
      console.log('room=',room);
      io.sockets.to(room).emit('user-disconnected', rooms[room].users[socket.id])
      delete rooms[room].users[socket.id]
    })
  })


})

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name)
    return names
  }, [])
}

function createName() {
  let abc = "abcdefghijklmnopqrstuvwxyz";
  let rs = '';
  while (rs.length < 6) {
      rs += abc[Math.floor(Math.random() * abc.length)]
  }
  return rs
}
