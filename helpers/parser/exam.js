const core = require('./parserCore')

exports.getExams = (fileName, institute, cource) => {
    let columns = core.xlsxToColumns(fileName)
    formatMonthColumn(columns)
    return columnsToExams(columns, institute, cource)
}

const columnsToExams = (columns, institute, cource) => {
    let exams = []

    for (let i = 0; i < columns.length; i++) {
        let column = columns[i]
        let beginIndex = column.indexOf('время')
        if (beginIndex > -1 && (i - 1) > -1) {
            let meta = {
                group: core.convertGroupName(columns[i - 1][beginIndex]),
                institute: institute,
                cource: cource
            }
            exams.push.apply(exams, columnToExams(columns, i - 1, beginIndex, meta))
        }
    }
    return exams
}

const formatMonthColumn = (columns) => {
    let monthIndex = columns[0].indexOf('месяц')
    if (monthIndex > -1) {
        let lastMonth = columns[0][monthIndex + 1].replace(/ /g,'').toLowerCase()
        for (let i = monthIndex + 1; i < columns[0].length; i++) {
            if (columns[0][i] == '') columns[0][i] = lastMonth
            else {
                columns[0][i] = columns[0][i].replace(/ /g,'').toLowerCase()
                lastMonth = columns[0][i]
            }
        }
    }
}

const columnToExams = (columns, colIndex, beginIndex, meta) => {
    let exams = []

    for (let i = beginIndex + 1; i < columns[colIndex].length; i++) {
        let colData = columns[colIndex][i]

        if (colData == 'Консультация' || colData == "Экзамен") {
            let exam = {
                type: colData,
                date: getDate(columns, i, columns[colIndex + 1][i]),
                name: columns[colIndex][i + 1],
                professor: columns[colIndex][i + 2],
                room: columns[colIndex + 2][i],
                meta: meta
            }
            exams.push(exam)
        }
    }
    return exams
}

const getDate = (columns, recordIndex, timeString) => {
    let year = new Date().getFullYear()
    let month = getMonth(columns[0][recordIndex])
    let day = getDay(columns[1][recordIndex].replace(/[а-я]/g, ''))
    let time = timeString.split('-')
    let date = new Date(`${year}-${month}-${day}`)
    date.setHours(time[0], time[1])
    return date
}

const getMonth = (month) => {
    switch(month) {
        case 'январь': return '01'
        case 'февраль': return '02'
        case 'декабрь': return '12'
        case 'июнь': return '06'
        case 'июль': return '07'
        default: return '01'
    }
}

const getDay = (day) => {
    if (day.length == 1) return `0${day}`
    else return day
}
