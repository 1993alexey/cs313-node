const express = require('express')
const router = express.Router()

router
   .get('/', (req, res) => res.render('pages/index'))
   .post('/getPrice', (req, res) => {
      const weight = req.body.weight
      const type = req.body.type
      const rate = getRate(weight, type)

      if (!rate) {
         const errorInfo = {
            code: 400,
            message: 'Unable to calculate the rate because incorrect weight has been provided'
         }
         res.status(errorInfo.code)
         res.render('pages/client-error', errorInfo)
         return
      }
         
      res.render('pages/postal-price', { rate, weight, type })
   })


function getRate(weight, type) {
   type = type.toLowerCase()

   if (type.includes('stamped')) {
      if (weight <= 1)
         return .55
      else if (weight <= 2)
         return .7
      else if (weight <= 3)
         return .85
      else if (weight <= 3.5)
         return 1
   } else if (type.includes('metered')) {
      if (weight <= 1)
         return .5
      else if (weight <= 2)
         return .65
      else if (weight <= 3)
         return .8
      else if (weight <= 3.5)
         return .95
   } else if (type.includes('flats')) {
      if (weight <= 1)
         return 1
      else if (weight <= 2)
         return 1.2
      else if (weight <= 3)
         return 1.4
      else if (weight <= 4)
         return 1.6
      else if (weight <= 5)
         return 1.8
      else if (weight <= 6)
         return 2
      else if (weight <= 7)
         return 2.2
      else if (weight <= 8)
         return 2.4
      else if (weight <= 9)
         return 2.6
      else if (weight <= 10)
         return 2.8
      else if (weight <= 11)
         return 3
      else if (weight <= 12)
         return 3.2
      else if (weight <= 13)
         return 3.4
   } else if (type.includes('package')) {
      return 4
   }
}

module.exports = router