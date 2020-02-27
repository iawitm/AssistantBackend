const express = require('express')
const router = express.Router()
const checkAdmin = require('../../middleware/Admin')

const ScheduleController = require('../../controllers/schedule/ScheduleController')

router.get('/', ScheduleController.getSchedule)
router.post('/', checkAdmin, ScheduleController.uploadSchedule)

module.exports = router
