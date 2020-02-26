const express = require('express')
const router = express.Router()

const ScheduleController = require('../../controllers/schedule/ScheduleController')

router.get('/', ScheduleController.getSchedule)
router.post('/', ScheduleController.uploadSchedule)

module.exports = router
