const Semester = require('../model/SemesterModel')
const HttpError = require('../middleware/Error').HttpError

exports.setSemester = async (req, res, next) => {
  const { startDate, endDate } = req.body

  const startCalendar = Date.parse(startDate)
  const endCalendar = Date.parse(endDate)

  if (startCalendar >= endCalendar) throw new HttpError('INCORRECT_DATE')

  let semester = new Semester ({
    startDate: startCalendar,
    endDate: endCalendar
  })

  //await semester.save()

  res.status(200).json( {created: semester} )
}
