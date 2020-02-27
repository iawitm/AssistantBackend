const { Test } = require('../../model/ExamModel')
const testParser = require('../../../helpers/parser/test')
const HttpError = require('../../middleware/Error').HttpError

exports.uploadTests = async (req, res, next) => {
    
    if (!req.files.tests) throw new HttpError('NO_XLSX_PROVIDED')
    if (!req.body.meta) throw new HttpError('NO_META_PROVIDED')

    let meta = JSON.parse(req.body.meta)

    if (!new Date(meta.date)) throw new HttpError('INCORRECT_DATE')

    let tests = testParser.getTests(
        req.files.tests.path, 
        meta.institute, 
        meta.cource,
        new Date(meta.date)
    )

    await Test.collection.deleteMany({ 
        'meta.institute': meta.institute, 
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
