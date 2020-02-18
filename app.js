const express = require('express') //import library
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('express-async-errors')
require('dotenv').config()

const app = express() //to this variable connects everything, something like main function
const scheduleRoute = require('./api/routes/ScheduleRoute')
const semesterRoute = require('./api/routes/semesterRoute')
const errorMiddleware = require('./api/middleware/Error').errorMiddleware

app.use(bodyParser.json())
app.use('/schedule', scheduleRoute)
app.use('/semester', semesterRoute)
app.use(errorMiddleware)

mongoose.connect(
  process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }
)
mongoose.Promise = global.Promise
mongoose.set('useFindAndModify', false);

app.listen(8080, () => {
  console.log('Server started 🚀')
})
