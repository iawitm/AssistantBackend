const express = require('express') //import library
const mongoose = require('mongoose')
require('express-async-errors')
const app = express() //to this variable connects everything, something like main function
const scheduleRoute = require('./api/routes/scheduleRoute')
const errorMiddleware = require('./api/middleware/Error').errorMiddleware

app.use('/schedule', scheduleRoute)

mongoose.connect(
  process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }
)
mongoose.Promise = global.Promise

app.listen(8080, () => {
  console.log('Server started')
})
