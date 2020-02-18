const express = require('express')
const router = express.Router()

const ExamController = require('../controllers/ExamController')

router.post('/', ExamController.uploadExams)
router.get('/', ExamController.getExams)

module.exports = router