const mongoose = require('mongoose')

const examSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  professor: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Exam', examSchema)
