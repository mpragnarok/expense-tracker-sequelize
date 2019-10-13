const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    res.render('404')
  } catch (e) {
    res.status(404).send(e)
  }

})
module.exports = router