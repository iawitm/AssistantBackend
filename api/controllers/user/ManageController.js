const HttpError = require('../../middleware/Error').HttpError
const { User } = require('../../model/UserModel')

exports.getUsers = async (req, res, next) => {
    let users = await User
        .find()
        .select('-password')

    res.status(200).json(users)
}

exports.removeUser = async (req, res, next) => {
    const { login } = req.query

    if (!login) throw new HttpError('NO_QUERY')
    await User.deleteOne({ login: login })

    res.sendStatus(200)
}