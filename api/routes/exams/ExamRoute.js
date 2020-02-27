const express = require('express')
const router = express.Router()
const checkAdmin = require('../../middleware/Admin')

const ExamController = require('../../controllers/exams/ExamController')

router.post('/', checkAdmin, ExamController.uploadExams)
router.get('/', ExamController.getExams)

module.exports = router
