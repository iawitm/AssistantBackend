const HttpError = require('../../middleware/Error').HttpError
const { User, UserRole } = require('../../model/UserModel')

exports.getUsers = async (req, res, next) => {
    if (req.user.role != UserRole.ADMIN) throw new HttpError('NOT_ADMIN')

    let users = await User
        .find()
        .select('-password')

    res.status(200).json(users)
}

exports.removeUser = async (req, res, next) => {
    if (req.user.role != UserRole.ADMIN) throw new HttpError('NOT_ADMIN')

    const { login } = req.query

    if (!login) throw new HttpError('NO_QUERY')
    await User.deleteOne({ login: login })

    res.sendStatus(200)
}