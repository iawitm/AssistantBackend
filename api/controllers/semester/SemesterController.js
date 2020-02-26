const Semester = require('../../model/SemesterModel')
const HttpError = require('../../middleware/Error').HttpError

exports.setSemester = async (req, res, next) => {
    const { startDate, endDate } = req.body

    const startCalendar = Date.parse(startDate)
    const endCalendar = Date.parse(endDate)

    if (startCalendar >= endCalendar) throw new HttpError('INCORRECT_DATE')

    const filter = {}
    const update = { startDate: startCalendar, endDate: endCalendar }

    let doc = await Semester.findOneAndUpdate(filter, update, { new: true, upsert: true })

    res.status(200).json({ created: doc })
}

exports.getSemester = async (req, res, next) => {
    let semester = await Semester
        .findOne()
        .select('-_id')

    res.status(200).json(semester)
}