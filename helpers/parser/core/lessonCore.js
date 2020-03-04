const weeksRegex = /(?!=\()[0-9,\s]+н?\.? (?![\/А-Яа-я\s\.]*[\)])/g
const exceptedWeeksRegex = /(?![0-9] п\/г)кр.? [0-9,\s]+н?\.? /g

exports.getLessonInfo = (rawLesson, parity) => {

    rawLesson.name = handleRanges(rawLesson.name, !parity)

    if (rawLesson.name.match(exceptedWeeksRegex))
        return getExceptedLessonsInfo(rawLesson, parity)
    let weeksMatches = rawLesson.name.match(weeksRegex)

    if (weeksMatches) {
        let info = []

        let names = rawLesson.name.split(weeksRegex).filter(Boolean)
        let professors = rawLesson.professor.match(/[а-я]+ ([А-Я].)+/ig)

        removeEmptyFromArray(names)

        for (let i = 0; i < weeksMatches.length; i++) {
            info.push({
                name: names[i],
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
        .replace(/кр.? /, '')
        .split(weeksRegex)
        .filter(Boolean)
    let professors = rawLesson.professor.match(/[а-я]+ ([А-Я].)+/ig)
    
    for (let i = 0; i < matches.length; i++) {
        infos.push({
            name: removeFirstIfSpace(names[i]),
            type: indexOrFirst(rawLesson.type.split(' '), i),
            professor: indexOrFirst(professors, i),
            room: indexOrFirst(rawLesson.room.split(' '), i),
            weeks: (matches[i].match(exceptedWeeksRegex)) ?
                ((parity == 0) ? 'odd' : 'even') : matches[i].replace(/ н\./, '')
        })
    }

    if (infos.length == 1) {
        let empty = getEmptyLessonInfo(parity)
        empty.weeks = rawLesson.name.match(exceptedWeeksRegex)[0]
            .replace(/кр.? /, '')
            .replace(/ н\.?/, '')
            .replace(/ /g, '')
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
}

const indexOrFirst = (arr, index) => {
    if (!arr) return ''
    return (arr[index]) ? arr[index] : arr[0]
}

const removeFirstIfSpace = (text) => {
    return (text[0] == ' ') ? text.substr(1) : text
}

const removeEmptyFromArray = (array) => {
    for (let i = 0; i < array.length; i++) {
        if (!array[i].replace(/\s/g, '').length) array.splice(i, 1)
    }
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

const range = (str, isOdd) => {
    const numbers = str.split('-')
    const start = parseInt(numbers[0])
    const end = parseInt(numbers[1])

    const arr = Array.from({ length: 1 + end - start });

    return arr
        .map((_,i) => start + i)
        .filter(n => isOdd ? n % 2 : !(n % 2)).join(',')
}

const handleRanges = (str, isOdd) => { 
    const regex = /(?!=\()[\d]+-[\d]+(?![\/-А-Яа-я\s\.]*[\)])/
    while (m = str.match(regex)) {
        mm = m[0];
        str = str.replace(regex, range(mm, isOdd)) 
    }
    return str;
}
