const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const postalRoutes = require('./routes/postal')
const PORT = process.env.PORT || 5000

const app = express()
   .use(bodyParser.urlencoded({ extended: true }))
   .use(express.static(path.join(__dirname, 'public')))
   .set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs')
   .use(postalRoutes)
   .listen(PORT, () => console.log(`Listening on ${ PORT }`))
