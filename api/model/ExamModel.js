const mongoose = require('mongoose')

const examSchema = mongoose.Schema({
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
    required: false
  },
  room: {
    type: String,
    required: true
  },
  professor: {
    type: String,
    required: true
  },
  meta: {
    institute: {
      type: String,
      required: true
    },
    cource: {
      type: String,
      required: true
    },
    group: {
      type: String,
      required: true
    }
  }
})

module.exports = mongoose.model('Exam', examSchema)
