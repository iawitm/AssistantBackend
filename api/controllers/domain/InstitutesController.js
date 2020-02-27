const { InstituteNumbers, InstituteNames } = require('../../../helpers/institute')

exports.getInstitutes = (req, res, next) => {
    let institutes = []

    for (let [key, value] of Object.entries(InstituteNumbers)) {
        institutes.push({
            code: key,
            name: InstituteNames[value]
        })
    }

    res.status(200).json(institutes)
}