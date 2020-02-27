const examParser = require('../../../helpers/parser/exam')
const HttpError = require('../../middleware/Error').HttpError

const { Exam } = require('../../model/ExamModel')
const InstituteNumbers = require('../../../helpers/institute').InstituteNumbers

exports.uploadExams = async (req, res, next) => {

    if (!req.files.exams) throw new HttpError('NO_XLSX_PROVIDED')
    if (!req.body.meta) throw new HttpError('NO_META_PROVIDED')

    let meta = JSON.parse(req.body.meta)

    if (InstituteNumbers[meta.institute] === undefined) throw new HttpError('WRONG_INSTITUTE')

    let exams = examParser.getExams(
        req.files.exams.path, 
        InstituteNumbers[meta.institute], 
        meta.cource
    )

    await Exam.collection.deleteMany({ 
        'meta.institute': InstituteNumbers[meta.institute], 
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
