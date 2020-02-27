const express = require('express')
const router = express.Router()
const checkAdmin = require('../../middleware/Admin')

const TestController = require('../../controllers/exams/TestController')

router.post('/', checkAdmin, TestController.uploadTests)
router.get('/', TestController.getTests)

module.exports = router
