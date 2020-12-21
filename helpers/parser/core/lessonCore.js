const { handleRanges, exceptedRange } = require('./range')

const weeksRegex = /(?!=\()[0-9,\s]+н?\.? (?![\/А-Яа-я\s\.]*[\)])/g
const exceptedWeeksRegex = /(?!=\()кр(оме)?.? [0-9,\s]+н?\.? (?![\/А-Яа-я\s\.]*[\)])/g
const professorRegex = /[а-яё-]+ ([А-Я].)+/ig
const subGroupsRegex = /[0-9]+ п\/гр/g

exports.getLessonInfo = (rawLesson, parity) => {

    rawLesson.name = handleRanges(rawLesson.name, !parity)

    if (rawLesson.name.match(exceptedWeeksRegex)){
        return getExceptedLessonsInfo(rawLesson, parity)
    }

    let weeksMatches = rawLesson.name
        .replace(subGroupsRegex, '')
        .match(weeksRegex)

    if (weeksMatches) {
        let info = []

        weeksMatches = filterWeeks(weeksMatches)
        let names = rawLesson.name.split(weeksRegex).filter(Boolean)
        let professors = rawLesson.professor.match(professorRegex)
        names = removeEmptyFromArray(names)

        for (let i = 0; i < weeksMatches.length; i++) {
            info.push({
                name: clear(names[i]),
                type: indexOrFirst(rawLesson.type.split(' '), i),
                professor: indexOrFirst(professors, i),
                room: indexOrFirst(rawLesson.room.split(' '), i),
                weeks: clearWeek(weeksMatches[i])
            })
        }
        info.push(getEmptyLessonInfo(parity))
        return info
    } else {
        return getNormalLessonInfo(rawLesson, parity)
    }
}

const getExceptedLessonsInfo = (rawLesson, parity) => {
    let infos = []
    let matches = rawLesson.name.match(exceptedWeeksRegex)
    let names = rawLesson.name
        .replace(/кр(оме)?.? /, '')
        .split(weeksRegex)
        .filter(Boolean)
    let professors = rawLesson.professor.match(professorRegex)
    
    for (let i = 0; i < matches.length; i++) {
        infos.push({
            name: clear(names[i]),
            type: indexOrFirst(rawLesson.type.split(' '), i),
            professor: indexOrFirst(professors, i),
            room: indexOrFirst(rawLesson.room.split(' '), i),
            weeks: (matches[i].match(exceptedWeeksRegex)) ?
                exceptedRange(clearWeek(matches[i]), !parity) : 
                matches[i].replace(/ н\./, '')
        })
    }

    if (infos.length == 1) {
        let empty = getEmptyLessonInfo(parity)
        infos.push(empty)
    }

    return infos
}

const getNormalLessonInfo = (rawLesson, parity) => {
    let infos = []
    let info = rawLesson
    info.weeks = ((parity == 0) ? 'odd' : 'even')
    info.name = clear(info.name)
    infos.push(info)
    return infos
}

const clearWeek = (week) => {
    return week
        .replace(/\s?н\.?/g, '')
        .replace(/кр(оме)?.? /, '')
        .replace(/ /g, '')
}

const clear = (name) => {
    return name
        .replace('……………', '')
        .replace('…………..', '')
        .replace('День самостоятельных занятий', '')
        .replace('День', '')
        .replace('самостоятельных', '')
        .replace('занятий', '')
        .replace(/^\s*\/*|\/+$/, '')
}

const indexOrFirst = (arr, index) => {
    if (!arr) return ''
    return (arr[index]) ? arr[index] : arr[0]
}

const removeEmptyFromArray = (array) => {
    return array.filter(element => {
        return element.replace(/\s+/, '').length > 0
    })
}

const filterWeeks = (weeks) => {
    return weeks.filter(week => {
        return week.replace(/\s+?[н?\s+?]+/, '').length > 0
    })
}

const getEmptyLessonInfo = (parity) => {
    return {
        name: '',
        type: '',
        professor: '',
        room: '',
        weeks: ((parity == 0) ? 'odd' : 'even')
    }
}
