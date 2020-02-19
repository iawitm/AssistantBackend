const os = require("os")
const express = require('express') //import library
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const formData = require("express-form-data")
require('express-async-errors')
require('dotenv').config()

const app = express() //to this variable connects everything, something like main function

const scheduleRoute = require('./api/routes/ScheduleRoute')
const semesterRoute = require('./api/routes/SemesterRoute')
const professorRoute = require('./api/routes/ProfessorRoute')
const examRoute = require('./api/routes/ExamRoute')
const errorMiddleware = require('./api/middleware/Error').errorMiddleware

const formDataOptions = {
	uploadDir: os.tmpdir(),
	autoClean: true
}

app.use(bodyParser.json())
app.use(formData.parse(formDataOptions));
app.use('/schedule', scheduleRoute)
app.use('/semester', semesterRoute)
app.use('/exams', examRoute)
app.use('/professor', professorRoute)
app.use(errorMiddleware)

mongoose.connect(
	process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
)
mongoose.Promise = global.Promise

app.listen(process.env.PORT, () => {
	console.log('Server started 🚀')
})
