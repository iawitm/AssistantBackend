const HttpError = require('../middleware/Error').HttpError

const Semester = require('../model/SemesterModel')
const Lesson = require('../model/LessonModel')

exports.getByProfessor = async (req, res, next) => {

	if (!req.query.query) throw new HttpError('NO_QUERY')

	let semester = await Semester.findOne()
		.select('-_id')

	let result = await Lesson.aggregate([
		{ $unwind: '$info' },
		{
			$match: {
				'info.professor': {
					$regex: req.query.query, $options: 'i'
				}
			}
		},
		{ $unset: 'meta' },
		{
			$group: {
				_id: {
					day: '$day',
					number: '$number',
					info: '$info',
					interval: '$interval'
				},
				id: { $first: '$_id' },
			}
		},
		{
			$group: {
				_id: '$id',
				day: { $first: '$_id.day' },
				number: { $first: '$_id.number' },
				interval: { $first: '$_id.interval' },
				info: { $push: '$_id.info' },
			}
		}
	])

	res.status(200).json({ semester: semester, schedule: result })
}