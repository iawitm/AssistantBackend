const testParser = require('../../../helpers/parser/test')
const HttpError = require('../../middleware/Error').HttpError

const { Test } = require('../../model/ExamModel')
const InstituteNumbers = require('../../../helpers/institute').InstituteNumbers

exports.uploadTests = async (req, res, next) => {
    
    if (!req.files.tests) throw new HttpError('NO_XLSX_PROVIDED')
    if (!req.body.meta) throw new HttpError('NO_META_PROVIDED')

    let meta = JSON.parse(req.body.meta)

    if (InstituteNumbers[meta.institute] === undefined) throw new HttpError('WRONG_INSTITUTE')
    if (!new Date(meta.date)) throw new HttpError('INCORRECT_DATE')

    let tests = testParser.getTests(
        req.files.tests.path, 
        InstituteNumbers[meta.institute], 
        meta.cource,
        new Date(meta.date)
    )

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
