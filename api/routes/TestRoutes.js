const express = require('express')
const router = express.Router()

const TestController = require('../controllers/TestController')

router.get('/', TestController.getTests)

module.exports = router
