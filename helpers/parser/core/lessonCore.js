const { handleRanges, exceptedRange } = require('./range')

const weeksRegex = /(?!=\()[0-9,\s]+н?\.? (?![\/А-Яа-я\s\.]*[\)])/g
const exceptedWeeksRegex = /(?!=\()кр(оме)?.? [0-9,\s]+н?\.? (?![\/А-Яа-я\s\.]*[\)])/g
const professorRegex = /[а-яё-]+ ([А-Я].)+/ig
const subGroupsRegex = /[0-9]+ п\/гр/g

exports.getLessonInfo = (rawLesson, parity) => {

    rawLesson.name = handleRanges(rawLesson.name, !parity)

    /* Блок с обработкой пары по исключенным неделям (пример - 'кр 3, 5, 7 н') */
    if (rawLesson.name.match(exceptedWeeksRegex)){
        return getExceptedLessonsInfo(rawLesson, parity)
    }

    let weeksMatches = filterWeeks(
        rawLesson.name
            .replace(subGroupsRegex, '')
            .match(weeksRegex)
    )

    /* Блок с обработкой пары по неделям */
    if (weeksMatches && weeksMatches.length > 0) {
        return getLessonInfoByWeekMatches(rawLesson, weeksMatches, parity)
    }

    /* Просто информация о паре */
    return getNormalLessonInfo(rawLesson, parity)
}

/**
 * Метод, возвращающий информацию о паре, которая проходит по определенным неделям
 * @param rawLesson - "сырой" объект пары
 * @param weeks - Отфильтрованные недели
 * @param parity - Четность пары
 */
function getLessonInfoByWeekMatches(rawLesson, weeks, parity) {
    let info = []

    let names = removeEmptyFromArray(rawLesson.name.split(weeksRegex).filter(Boolean))
    let professors = rawLesson.professor.match(professorRegex)

    for (let i = 0; i < weeks.length; i++) {
        /* Объект новой пары */
        let lessonToPush = {
            name: clearName(names[i]),
            weeks: clearWeek(weeks[i]),
            professor: indexOrFirst(professors, i),
            type: indexOrFirst(rawLesson.type.split(' '), i),
            room: clearRoom(indexOrFirst(rawLesson.room.split(' '), i))
        }

        /* Проверка, есть ли в info пары с таким же набором недель */
        let sameWeekLesson = info.find(lesson => {
            return lesson.weeks == lessonToPush.weeks
        })
        if (sameWeekLesson) {
            let index = info.indexOf(sameWeekLesson)

            info[index].name += `\n${lessonToPush.name}`
            info[index].professor += `/ ${lessonToPush.professor}`
            info[index].room += `/ ${lessonToPush.room}`
            info[index].type += `/ ${lessonToPush.type}`
        } else {
            info.push(lessonToPush)
        }
    }
    /* Пустая пара на остальные недели с той же четностью */
    info.push(getEmptyLessonInfo(parity))
    return info
}

const getExceptedLessonsInfo = (rawLesson, parity) => {
    let infos = []
    let matches = rawLesson.name.match(exceptedWeeksRegex)
    let professors = rawLesson.professor.match(professorRegex)
    let names = rawLesson.name
        .replace(/кр(оме)?.? /, '')
        .split(weeksRegex)
        .filter(Boolean)

    for (let i = 0; i < matches.length; i++) {
        infos.push({
            name: clearName(names[i]),
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
    info.name = clearName(info.name)
    infos.push(info)
    return infos
}

const clearWeek = (week) => {
    return week
        .replace(/\s?н\.?/g, '')
        .replace(/кр(оме)?.? /, '')
        .replace(/ /g, '')
}

const clearName = (name) => {
    return name
        .replace('……………', '')
        .replace('…………..', '')
        .replace('День самостоятельных занятий', '')
        .replace('День', '')
        .replace('самостоятельных', '')
        .replace('занятий', '')
        .replace(/^\s*\/*|\/+$/, '')
}

const clearRoom = (room) => {
    return room.replace(/\s*\/*|\/+/, ' ')
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

/**
 * Метод, убирающий пустые значения недель, чтобы исключить
 * совпадения по trailing spaces
 * @param weeks Массив заматченных недель из названия пары
 */
const filterWeeks = (weeks) => {
    if (!weeks) { return weeks }

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
