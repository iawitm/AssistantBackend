const jwt = require('jsonwebtoken')
const HttpError = require('./Error').HttpError
const { UserRole } = require('../model/UserModel')

module.exports = async (req, res, next) => {
    const tokenHeader = req.headers.authorization

    try {
        const token = tokenHeader.split(' ')[1]
        const user = jwt.verify(token, process.env.JWT_SECRET).user

        if (user.role == UserRole.ADMIN || user.role == UserRole.MODERATOR) {
            req.user = user
            next()
        } else {
            throw new HttpError('BAD_ROLE')
        }
    } catch (err) {
        throw new HttpError('BAD_AUTH_CREDENTIALS')
    }
}