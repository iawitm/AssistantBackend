/**
 * this module is a group parser core
 * It provides methods for parsing group name and habdling same group names
 */
const translit = require('../../translit')
const groupRegex = /([a-z]`?)+(-[0-9]{2}){2}/g

exports.convertGroupName = (name) => {
    name = name.replace(/ /g,'')
    name = translit(name, 5).toLowerCase()

    return name
}

exports.parseGroupName = (name, metaHolders) => {
    name = this
        .convertGroupName(name)
        .match(groupRegex)[0]
    
    let sameGroupsCount = [...new Set(
        metaHolders.filter(item => 
            item.meta.group.includes(name)
        ).map(item => {
            return item.meta.group
        })
    )].length

    if (sameGroupsCount) {
        name = `${name}(${sameGroupsCount})`
    }

    return name
}
