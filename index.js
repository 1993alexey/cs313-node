const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const path = require('path')
const bodyParser = require('body-parser')
const postalRoutes = require('./routes/postal')
const PORT = process.env.PORT || 5000

app
   .use(bodyParser.urlencoded({ extended: true }))
   .use(express.static(path.join(__dirname, 'public')))
   .set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs')
   .get('/messenger', (req, res) => {
      res.render('pages/messenger')
   })
   
io.on('connection', (socket) => {
   console.log('user connected')
   socket.on('disconnect', () => {
      console.log('user disconnected')
   })
})

http.listen(PORT, () => console.log(`Listening on ${ PORT }`))