const testParser = require('../../../helpers/parser/test')
const examParser = require('../../../helpers/parser/exam')
const HttpError = require('../../middleware/Error').HttpError

const { Test } = require('../../model/ExamModel')
const InstituteNumbers = require('../../../helpers/institute').InstituteNumbers

exports.uploadTests = async (req, res, next) => {
    
    if (!req.files.tests) throw new HttpError('NO_XLSX_PROVIDED')
    if (!req.body.meta) throw new HttpError('NO_META_PROVIDED')

    let meta = JSON.parse(req.body.meta)

    if (InstituteNumbers[meta.institute] === undefined) throw new HttpError('WRONG_INSTITUTE')
    if (!new Date(meta.date) && !meta.useNewFormat) throw new HttpError('INCORRECT_DATE')

    let tests = getParsedTests(req.files.tests.path, meta)

    await Test.collection.deleteMany({ 
        'meta.institute': InstituteNumbers[meta.institute], 
        'meta.cource': meta.cource 
    })
    await Test.collection.insertMany(tests)

    res.sendStatus(200)
}

exports.getTests = async (req, res, next) => {

    let tests = await Test.find({ 
        'meta.group': req.query.group
    }).select('-meta -_id')

    res.status(200).json(tests)
}

getParsedTests = (filePath, meta) => {
    if (meta.useNewFormat) {
        return examParser.getExams(
            filePath, 
            InstituteNumbers[meta.institute], 
            meta.cource,
            examParser.ParseTypes.TESTS,
        )
    } else {
        return testParser.getTests(
            filePath, 
            InstituteNumbers[meta.institute], 
            meta.cource,
            new Date(meta.date),
        )
    }
}
