const express = require('express')
const router = express.Router()

const SemesterController = require('../controllers/SemesterController')

router.post('/', SemesterController.setSemester)

module.exports = router
