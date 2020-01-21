const express = require('express') //import library
const app = express() //to this variable connects everything, something like main function
const scheduleRoute = require('./api/routes/scheduleRoute')

app.use('/schedule', scheduleRoute)

app.listen(8080, () => {
  console.log('Server started')
})
