/**
 * this module is a XLSX parser core
 * It provides methods for converting XLSX file to array of columns
 * and group name parsing
 */
const XLSX = require('xlsx')
const translit = require('../../translit')

exports.xlsxToColumns = (fileName) => {
    const workbook = XLSX.readFile(fileName)
    return sheetToColumns(workbook.Sheets[workbook.SheetNames[0]])
}

const sheetToColumns = (sheet) => {
    let json = XLSX.utils.sheet_to_json(sheet, { header : 1 })
    let rowLength = json[1].length

    for (let i = 0; i < json.length; i++) {
        if (json[i].length > rowLength) rowLength = json[i].length
    }

    let object = {}

    for(let i = 0; i < json.length; i++) {

        if (json[i].length < rowLength) {
            let diff = rowLength - json[i].length
            for (let s = 0; s < diff; s++) {
                json[i].push(null)
            }
        }

        for(let j = 0; j < json[i].length; j++) {
            if(!object[`FIELD${j}`]) object[`FIELD${j}`] = []
            if(!json[i][j]) json[i][j] = ''
            object[`FIELD${j}`].push(json[i][j].toString().replace(/\r\n/g,' '))
        }
    }

    return Object.values(object)
};

exports.convertGroupName = (name) => {
    name = name.replace(/ /g,'')
    name = translit(name, 5).toLowerCase()

    return name
}
