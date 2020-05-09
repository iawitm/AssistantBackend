const HttpError = require('../../middleware/Error').HttpError

const Lesson = require('../../model/LessonModel')
const translit = require('../../../helpers/translit')

const RUQueryRegex = /[А-Я%]/ig

exports.getGroups = async (req, res, next) => {
    let groups = await Lesson
        .find()
        .distinct('meta.group')

    res.status(200).json(groups)
}

exports.checkGroup = async (req, res, next) => {
    
    let query = handleRUQuery(req.query.query)
    let group = await Lesson
        .find({
		    'meta.group': query
        })
        .distinct('meta.group')

    if (group.length == 0) throw new HttpError('NO_SUCH_GROUP')
    
    res.status(200).json(group[0])
}

const handleRUQuery = (query) => {
    if (query.match(RUQueryRegex)) {
        return translit(query, 5).toLowerCase()
    } else {
        return query
    }
}