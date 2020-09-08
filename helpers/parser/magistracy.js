const core = require('./core/parserCore')
const lessonCore = require('./core/lessonCore')

exports.getSchedule = (fileName, institute, cource) => {
    let columns = core.xlsxToColumns(fileName)
    formatDayColumn(columns)
    return columnsToSchedule(columns, institute, cource)
}

const formatDayColumn = (columns) => {
    let dayIndex = columns[0].indexOf('День недели')
    if (dayIndex > -1) {
        let lastDay = columns[0][dayIndex + 1].replace(/ /g,'').toLowerCase()
        for (let i = dayIndex + 1; i < columns[0].length; i++) {
            if (columns[0][i] == '') columns[0][i] = lastDay
            else {
                columns[0][i] = columns[0][i].replace(/ /g,'').toLowerCase()
                lastDay = columns[0][i]
            }
        }
    }
}

function columnsToSchedule(columns, institute, cource) {
    let schedule = []

    for (let i = 0; i < columns.length; i++) {
        let column = columns[i]
        let beginIndex = column.indexOf('Предмет')
        if (beginIndex > -1 && column[beginIndex - 1] != '') {

            let groupName = core
                .convertGroupName(column[beginIndex - 1])
                .match(/([a-z]`?)+(-[0-9]{2}){2}/g)[0]

            let sameGroupCount = schedule.filter(item => 
                item.meta.group.match(groupName)
            ).length

            if (sameGroupCount) groupName = `${groupName}(${sameGroupCount / 36})`

            let meta = {
                group: groupName,
                cource: cource,
                institute: institute
            }

            schedule.push.apply(schedule, columnToLessons(
                columns, i, beginIndex + 1, meta
            ))
        }
    }
    return schedule
}

function columnToLessons(columns, colIndex, beginIndex, meta) {
    let lessons = []
    let index = beginIndex
    let testColumn = columns[4]

    while(testColumn[index] != '') {
    
        let lesson = {
            day: getDay(columns[0][index]),
            number: columns[1][index],
            info: [],
            meta: meta,
            interval: {
                startTime: columns[2][index].replace(/-/, ':'),
                endTime: columns[3][index].replace(/-/, ':')
            }
        }

        for (j = 0; j < 2; j++) {
            let rawLesson = getRawLesson(columns, colIndex, index + j)
            lesson.info.push.apply(
                lesson.info, 
                lessonCore.getLessonInfo(rawLesson, j)
            )
        }

        if (lesson.number < 7 || lessonIsFilled(lesson)) {
            lessons.push(lesson)
        }

        index = index + 2
    }

    return lessons
}

const lessonIsFilled = (lesson) => {
    let isFilled = false

    lesson.info.forEach(info => {
        if (info.name.length > 0) {
            isFilled = true
            return
        }
    })

    return isFilled
}

const getDay = (day) => {
    switch(day) {
        case 'понедельник': return 1
        case 'вторник': return 2
        case 'среда': return 3
        case 'четверг': return 4
        case 'пятница': return 5
        case 'суббота': return 6
        default: return 1
    }
}

const getRawLesson = (columns, colIndex, lessonIndex) => {
    return {
        name: columns[colIndex][lessonIndex],
        type: columns[colIndex + 1][lessonIndex],
        professor: columns[colIndex + 2][lessonIndex],
        room: columns[colIndex + 3][lessonIndex]
    }
}
