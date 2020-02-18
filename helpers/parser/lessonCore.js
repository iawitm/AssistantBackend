exports.getLessonInfo = (rawLesson, parity) => {
    if (rawLesson.name.match(/(кр [0-9,\s]+н\.)/g))
        return getExceptedLessonsInfo(rawLesson, parity)
    let weeksMatches = rawLesson.name.match(/([0-9,\s]+н\.)/g)

    if (weeksMatches) {
        let info = []
        let names = rawLesson.name.split(/[0-9,\s]+н\. /g).filter(Boolean)
        let professors = rawLesson.professor.match(/[а-я]+ ([А-Я].)+/ig)

        for (let i = 0; i < weeksMatches.length; i++) {
            info.push({
                name: names[i],
                type: indexOrFirst(rawLesson.type.split(' '), i),
                professor: indexOrFirst(professors, i),
                room: indexOrFirst(rawLesson.room.split(' '), i),
                weeks: weeksMatches[i].replace(/ н\./, '')
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
    let matches = rawLesson.name.match(/(кр )?[0-9,\s]+н\./g)
    let names = rawLesson.name.replace(/кр /, '').split(/[0-9,\s]+н\./g).filter(Boolean)
    let professors = rawLesson.professor.match(/[а-я]+ ([А-Я].)+/ig)
    
    for (let i = 0; i < matches.length; i++) {
        infos.push({
            name: names[i],
            type: indexOrFirst(rawLesson.type.split(' '), i),
            professor: indexOrFirst(professors, i),
            room: indexOrFirst(rawLesson.room.split(' '), i),
            weeks: (matches[i].match(/кр [0-9,\s]+н\./g)) ?
                ((parity == 0) ? 'odd' : 'even') : matches[i].replace(/ н\./, '')
        })
    }

    if (infos.length == 1) {
        let empty = getEmptyLessonInfo(parity)
        empty.weeks = rawLesson.name.match(/кр [0-9,\s]+н\./g)[0]
            .replace(/кр /, '')
            .replace(/ н\./, '')
        infos.push(empty)
    }
    
    return infos
}

const getNormalLessonInfo = (rawLesson, parity) => {
    let infos = []
    let info = rawLesson
    info.weeks = ((parity == 0) ? 'odd' : 'even')
    info.name = info.name.clear()
    infos.push(info)
    return infos
}

const clear = (name) => {
    return name
        .replace('……………', '')
        .replace('…………..', '')
}

const indexOrFirst = (arr, index) => {
    if (!arr) return ''
    return (arr[index]) ? arr[index] : arr[0]
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
