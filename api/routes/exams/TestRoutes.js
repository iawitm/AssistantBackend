const express = require('express')
const router = express.Router()

const TestController = require('../../controllers/exams/TestController')

router.post('/', TestController.uploadTests)
router.get('/', TestController.getTests)

module.exports = router
