const core = require('./parserCore')
const lessonCore = require('./lessonCore')

exports.getSchedule = (fileName) => {
    let columns = core.xlsxToColumns(fileName)
    return columnsToSchedule(columns)
}

function columnsToSchedule(columns) {
    let schedule = []

    for (let i = 0; i < columns.length; i++) {
        let column = columns[i]
        let beginIndex = column.indexOf('Предмет')
        if (beginIndex > -1 && column[beginIndex - 1] != '') {
            schedule.push.apply(schedule, columnToLessons(
                columns, i, beginIndex, core.convertGroupName(column[beginIndex - 1]
            )))
        }
    }
    return schedule
}

function columnToLessons(columns, colIndex, beginIndex, group) {
    let lessons = []
    for (i = beginIndex + 1; i <= 73 + beginIndex; i += 2) {

        let number = (i - beginIndex - 1) / 2

        let lesson = {
            day: Math.trunc(number / 6) + 1,
            number: number % 6,
            info: [],
            meta: {
                group: group
            }
        }

        for (j = 0; j < 2; j++) {
            let rawLesson = getRawLesson(columns, colIndex, i + j)
            lesson.info.push.apply(lesson.info, lessonCore.getLessonInfo(rawLesson, j))
        }
        lessons.push(lesson)
    }
    return lessons
}

const getRawLesson = (columns, colIndex, lessonIndex) => {
    return {
        name: columns[colIndex][lessonIndex],
        type: columns[colIndex + 1][lessonIndex],
        professor: columns[colIndex + 2][lessonIndex],
        room: columns[colIndex + 3][lessonIndex]
    }
}
