const mongoose = require('mongoose')

const lessonSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  day: {
    type: Number,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  interval: {
    startTime: {
      type:String,
      required: true
    },
    endTime: {
      type:String,
      required: true
    }
  },
  info: [{
    name: {
      type: String,
      required: true
    },
    week: {
      type: String,
      required: true
    },
    room: {
      type: String,
      required: true
    },
    professor: {type: String},
    type: {type: String}
  }],
  meta:{
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

module.exports = mongoose.model('Lesson', lessonSchema)
