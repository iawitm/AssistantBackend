const express = require('express')
const router = express.Router()
const checkAdmin = require('../../middleware/Admin')

const SemesterController = require('../../controllers/semester/SemesterController')

router.get('/', SemesterController.getSemester)
router.post('/', checkAdmin, SemesterController.setSemester)

module.exports = router
