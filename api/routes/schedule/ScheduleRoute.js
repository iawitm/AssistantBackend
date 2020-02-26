const express = require('express')
const router = express.Router()

const ScheduleController = require('../../controllers/ScheduleController')

router.get('/', ScheduleController.getSchedule)
router.post('/', ScheduleController.uploadSchedule)

module.exports = router
