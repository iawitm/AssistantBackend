const core = require('./core/parserCore')
const groupCore = require('./core/groupCore')

exports.getTests = (fileName, institute, cource, startDate) => {
    let columns = core.xlsxToColumns(fileName)
    return columnsToTests(columns, startDate, institute, cource)
}

function columnsToTests(columns, startDate, institute, cource) {
    let tests = []
 
    for (let i = 0; i < columns.length; i++) {
        let column = columns[i]
        let beginIndex = column.indexOf('Предмет')
        if (beginIndex > -1 && column[beginIndex - 1] != '') {

            let groupName = groupCore.parseGroupName(column[beginIndex - 1], tests)
 
            let meta = {
                group:  groupName,
                cource: cource,
                institute: institute
            }
 
            tests.push.apply(tests, columnToTests(
                columns, i, beginIndex, meta, startDate
            ))
        }
    }

    console.log(tests)
    return tests
}
 
function columnToTests(columns, colIndex, beginIndex, meta, startDate) {
    let tests = []
    for (i = beginIndex + 1; i <= 72 + beginIndex; i += 1) {
 
        if (columns[colIndex][i].match(/[0-9,\s]+н?\.? /g)) {
 
            let number = (i - beginIndex - 1) / 2
            let day = Math.trunc(number / 6) + 1
            let rawName = columns[colIndex][i]
 
            let name = rawName.split(/[0-9,\s]+н?\.? /g).filter(Boolean)[0]
            let week = rawName.match(/[0-9,\s]+н?\.? /g)[0]
                .replace(/\s?н\.?/g, '')
                .replace(/ /g, '')
 
            let date = new Date(startDate.getTime())
            setDays(date, day)
            correctByWeeks(date, 17 - week)
            setTime(date, columns[2][getTimeIndex(i)].split('-'))

            tests.push({
                date: date,
                name: name,
                type: getType(columns[colIndex + 1][i]),
                professor: columns[colIndex + 2][i],
                room: columns[colIndex + 3][i],
                meta: meta,
            })
        }
    }
    return tests
}

const getTimeIndex = (index) => {
    return (index % 2) ? index : index - 1
}

const setDays = (date, day) => {
    date.setTime(date.getTime() + (dayToMills(day) - dayToMills(1)))
}

const dayToMills = (day) => {
    return day * 86400000
}

const correctByWeeks = (date, weeks) => {
    date.setTime(date.getTime() - dayToMills(7 * weeks))
}

const setTime = (date, time) => {
    if (time.length > 1) {
        date.setHours(time[0], time[1])
        date.setHours(date.getHours() + 3)
    }
}
 
const getType = (rawType) => {
    if (rawType.match(/кр/gi)) {
        return 'Курсовая работа'
    } else if (rawType == 'ЗД') {
        return 'Защита'
    } else return 'Зачет'
}
