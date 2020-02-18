const Exam = require('../model/ExamModel')
const examParser = require('../../helpers/parser/exam')
const HttpError = require('../middleware/Error').HttpError

exports.uploadExams = async (req, res, next) => {

    if (!req.files.exams) throw new HttpError('NO_XLSX_PROVIDED')
    if (!req.body.meta) throw new HttpError('NO_META_PROVIDED')

    let meta = JSON.parse(req.body.meta)

    let exams = examParser.getExams(
        req.files.exams.path, 
        meta.institute, 
        meta.cource
    )

    await Exam.collection.deleteMany({ 
        'meta.institute': meta.institute, 
        'meta.cource': meta.cource 
    })
    await Exam.collection.insertMany(exams)

    res.sendStatus(200)
}

exports.getExams = async (req, res, next) => {

    let exams = await Exam.find({ 
        'meta.group': req.query.group
    }).select('-meta -_id')

    res.status(200).json(exams)
}
