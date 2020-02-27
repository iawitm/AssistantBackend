const Lesson = require('../../model/LessonModel')

exports.getGroups = async (req, res, next) => {
    let groups = await Lesson
        .find()
        .distinct('meta.group')

    res.status(200).json(groups)
}