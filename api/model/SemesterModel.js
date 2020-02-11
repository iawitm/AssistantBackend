const mongoose = require('mongoose')

const semesterSchema = mongoose.Schema({
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
})

module.exports = mongoose.model('Semester', semesterSchema)
