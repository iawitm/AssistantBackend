/** 
 * Module, which provides methods for create or parse weeks ranges
 **/
exports.exceptedRange = (excepted, isOdd) => {
    const semesterRange = '1-16'
    const exceptedArr = excepted.split(',')

    return range(semesterRange, isOdd)
        .split(',')
        .filter(n => !exceptedArr.includes(n))
        .join(',')
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

exports.handleRanges = (str, isOdd) => { 
    const regex = /(?!=\()[\d]+-[\d]+(?![\/-А-Яа-я\s\.]*[\)])/
    while (m = str.match(regex)) {
        mm = m[0];
        str = str.replace(regex, range(mm, isOdd)) 
    }
    return str;
}