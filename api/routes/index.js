const express = require('express')
const router = express.Router()

const semesterRoute = require('./semester/SemesterRoute')

const scheduleRoute = require('./schedule/ScheduleRoute')
const professorRoute = require('./schedule/ProfessorRoute')

const examRoute = require('./exams/ExamRoute')
const testRoute = require('./exams/TestRoutes')

const userRoute = require('./user/UserRoute')

router.use('/semester', semesterRoute)

router.use('/schedule', scheduleRoute)
router.use('/professor', professorRoute)

router.use('/exams', examRoute)
router.use('/tests', testRoute)

router.use('/user', userRoute)

module.exports = router