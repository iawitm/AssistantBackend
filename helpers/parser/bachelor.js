const core = require('./core/parserCore')
const lessonCore = require('./core/lessonCore')

exports.getSchedule = (fileName, institute, cource) => {
    let columns = core.xlsxToColumns(fileName)
    return columnsToSchedule(columns, institute, cource)
}

function columnsToSchedule(columns, institute, cource) {
    let schedule = []

    for (let i = 0; i < columns.length; i++) {
        let column = columns[i]
        let beginIndex = column.indexOf('Предмет')
        if (beginIndex > -1 && column[beginIndex - 1] != '') {

            let meta = {
                group: core.convertGroupName(column[beginIndex - 1]),
                cource: cource,
                institute: institute
            }

            schedule.push.apply(schedule, columnToLessons(
                columns, i, beginIndex, meta
            ))
        }
    }
    return schedule
}

function columnToLessons(columns, colIndex, beginIndex, meta) {
    let lessons = []
    for (i = beginIndex + 1; i <= 72 + beginIndex; i += 2) {

        let number = (i - beginIndex - 1) / 2

        let lesson = {
            day: Math.trunc(number / 6) + 1,
            number: number % 6,
            info: [],
            meta: meta,
            interval: {
                startTime: columns[2][i].replace(/-/, ':'),
                endTime: columns[3][i].replace(/-/, ':')
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
