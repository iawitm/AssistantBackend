exports.getLessonInfo = (rawLesson, parity) => {
    if (rawLesson.name.match(/(?![0-9] п\/г)кр.? [0-9,\s]+н?\.? /g))
        return getExceptedLessonsInfo(rawLesson, parity)
    let weeksMatches = rawLesson.name.match(/(?![0-9] п\/г)[0-9,\s]+н?\.? /g)

    if (weeksMatches) {
        let info = []
        let names = rawLesson.name.split(/(?![0-9] п\/г)[0-9,\s]+н?\.? /g).filter(Boolean)
        removeEmptyFromArray(names)
        
        let professors = rawLesson.professor.match(/[а-я]+ ([А-Я].)+/ig)

        for (let i = 0; i < weeksMatches.length; i++) {
            info.push({
                name: names[i],
                type: indexOrFirst(rawLesson.type.split(' '), i),
                professor: indexOrFirst(professors, i),
                room: indexOrFirst(rawLesson.room.split(' '), i),
                weeks: weeksMatches[i]
                    .replace(/\s?н\.?/g, '')
                    .replace(/ /g, '')
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
    let matches = rawLesson.name.match(/(?![0-9] п\/г)кр.? [0-9,\s]+н?\.? /g)
    let names = rawLesson.name.replace(/кр.? /, '').split(/(?![0-9] п\/г)[0-9,\s]+н?\.? /g).filter(Boolean)
    let professors = rawLesson.professor.match(/[а-я]+ ([А-Я].)+/ig)
    
    for (let i = 0; i < matches.length; i++) {
        infos.push({
            name: removeFirstIfSpace(names[i]),
            type: indexOrFirst(rawLesson.type.split(' '), i),
            professor: indexOrFirst(professors, i),
            room: indexOrFirst(rawLesson.room.split(' '), i),
            weeks: (matches[i].match(/(?![0-9] п\/г)кр.? [0-9,\s]+н?\.? /g)) ?
                ((parity == 0) ? 'odd' : 'even') : matches[i].replace(/ н\./, '')
        })
    }

    if (infos.length == 1) {
        let empty = getEmptyLessonInfo(parity)
        empty.weeks = rawLesson.name.match(/(?![0-9] п\/г)кр.? [0-9,\s]+н?\.? /g)[0]
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
