const core = require('./core/parserCore')
const groupCore = require('./core/groupCore')

exports.ParseTypes = {
    EXAMS: 0,
    TESTS: 1
}

exports.getExams = (fileName, institute, cource, parseType) => {
    let columns = core.xlsxToColumns(fileName)
    formatMonthColumn(columns)
    return columnsToExams(columns, institute, cource, parseType)
}

const columnsToExams = (columns, institute, cource, parseType) => {
    let exams = []

    for (let i = 0; i < columns.length; i++) {
        let column = columns[i]
        let beginIndex = column.indexOf('время')

        if (beginIndex > -1 && (i - 1) > -1) {

            let rawGroupName = columns[i - 1][beginIndex]
            if (!rawGroupName) { continue }

            let groupName = groupCore.parseGroupName(rawGroupName, exams)

            let meta = {
                group: groupName,
                institute: institute,
                cource: cource
            }
            exams.push.apply(exams, columnToExams(columns, i - 1, beginIndex, meta, parseType))
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

const columnToExams = (columns, colIndex, beginIndex, meta, parseType) => {
    let exams = []

    for (let i = beginIndex + 1; i < columns[colIndex].length; i++) {
        /* Получаем заголовок из таблицы */
        let colData = getParsedType(columns[colIndex][i])

        /* Если это начало информации о зачете или экзамене, добавляем информацию в массив */
        if (
            parseType == this.ParseTypes.EXAMS && matchesExamsFormat(colData) ||
            parseType == this.ParseTypes.TESTS && matchesTestsFormat(colData)
        ) {
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
    /* Возвращаем полученную информацию по группе */
    return exams
}

const getDate = (columns, recordIndex, timeString) => {
    let year = new Date().getFullYear()
    let month = getMonth(columns[0][recordIndex])
    let day = getDay(columns[1][recordIndex].replace(/[а-я]/g, ''))
    /* Получаем первое время, которое указано в таблице */
    let time = timeString.substring(0, 4).split('-')

    const nowIsDecember = isCurrentMonthDecember()

    /* Прибавляем год, если экзамен будет в январе следующего года */
    if (nowIsDecember && month == '01') { year++ }

    /* Убираем лишний год, если экзамен был в декабре прошлого года */
    if (!nowIsDecember && month == '12') { --year }

    let date = new Date(`${year}-${month}-${day}`)
    if (time.length > 1) {
        date.setHours(time[0], time[1])
        date.setHours(date.getHours() + 3)
    }
    return date
}

const isCurrentMonthDecember = () => {
    return new Date().getMonth() == 11
}

const getMonth = (month) => {
    switch(month) {
        case 'декабрь': return '12'
        case 'январь': return '01'
        case 'февраль': return '02'
        case 'март': return '03'
        case 'апрель': return '04'
        case 'май': return '04'
        case 'июнь': return '06'
        case 'июль': return '07'
        default: return '01'
    }
}

const getDay = (day) => {
    if (day.length == 1) return `0${day}`
    else return day
}

const matchesTestsFormat = (type) => {
    return type == 'Дифференцированный зачет' || type == 'Зачет'
}

const matchesExamsFormat = (type) => {
    return type == 'Консультация' || type == 'Экзамен'
}

const getParsedType = (rawType) => {
    if (rawType.match(/Диф. Зачет/gi)) {
        return 'Дифференцированный зачет'
    } else return rawType
}
