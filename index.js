const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const path = require('path')
const bodyParser = require('body-parser')
const DbService = require('./dbService')
const PORT = process.env.PORT || 5000

app
   .use(bodyParser.urlencoded({ extended: true }))
   .use(express.static(path.join(__dirname, 'public')))
   .set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs')
   .get('/', (req, res) => res.redirect('messenger'))
   .get('/messenger', (req, res) => {
      res.render('pages/messenger')
   })
   

const activeUsers = {}
let messages = []
const dbService = new DbService()
dbService.getMessages().then((data) => {
   messages = [...messages, ...data]
})

io.on('connection', (socket) => {
   socket.on('disconnect', () => {
      const user = activeUsers[socket.id]
      socket.broadcast.emit('userDisconnected', user)
      delete activeUsers[socket.id]
   })

   socket.on('init', name => {
      const user = {
         name,
         imgUrl: `https://avatars.dicebear.com/api/male/${name}.svg?mood[]=happy`
      }
      activeUsers[socket.id] = user

      socket.emit('init', activeUsers, messages)
      socket.broadcast.emit('newUser', user)
   })

   socket.on('message', messageRaw => {
      const user = activeUsers[socket.id]
      const message = {
         user,
         timestamp: Date.now(),
         message: messageRaw
      }
      messages.push(message)
      dbService.saveMessage(message)
      io.send(message)
   })
})

http.listen(PORT, () => console.log(`Listening on ${ PORT }`))