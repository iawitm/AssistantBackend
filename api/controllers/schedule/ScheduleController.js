const HttpError = require('../../middleware/Error').HttpError
const bachelorParser = require('../../../helpers/parser/bachelor')
const InstituteNumbers = require('../../../helpers/institute').InstituteNumbers

const Lesson = require('../../model/LessonModel')
const Semester = require('../../model/SemesterModel')

exports.uploadSchedule = async (req, res, next) => {

	if (!req.files.schedule) throw new HttpError('NO_XLSX_PROVIDED')
	if (!req.body.meta) throw new HttpError('NO_META_PROVIDED')

	let meta = JSON.parse(req.body.meta)

	if (InstituteNumbers[meta.institute] === undefined) throw new HttpError('WRONG_INSTITUTE')

	// TODO: add check for type of schedule
	let schedule = bachelorParser.getSchedule(
		req.files.schedule.path,
		InstituteNumbers[meta.institute],
		meta.cource
	)

	await Lesson.collection.deleteMany({
		'meta.institute': InstituteNumbers[meta.institute],
		'meta.cource': meta.cource
	})
	await Lesson.collection.insertMany(schedule)

	res.sendStatus(200)
}

exports.getSchedule = async (req, res, next) => {

	let schedule = await Lesson.find({
		'meta.group': req.query.group
	}).select('-meta -_id')

	if (!schedule.length) throw new HttpError('NO_SUCH_SCHEDULE')

	let semester = await Semester.findOne()
		.select('-_id')

	res.status(200).json({
		semester: semester,
		schedule: schedule
	})
}