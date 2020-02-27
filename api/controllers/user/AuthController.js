const HttpError = require('../../middleware/Error').HttpError
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User, UserRole } = require('../../model/UserModel')

exports.createUser = async (req, res, next) => {
    const { role, login, password } = req.body

    if (!UserRole[role]) throw new HttpError('BAD_ROLE')

    let hash = await bcrypt.hash(password, 10)

    try {
        let user = await User.create({
            login: login,
            role: UserRole[role],
            password: hash
        })

        res.status(200).json(user)
    } catch(err) {
        if (err.code == 11000) throw new HttpError('DUPLICATE_LOGIN')
        else throw err
    }
}

exports.obtainToken = async (req, res, next) => {
    const { login, password } = req.body

    let user = await User.findOne({ login: login })
    if (!user) throw new HttpError('NO_SUCH_USER')

    let correctPassword = await bcrypt.compare(password, user.password)
    if (!correctPassword) throw new HttpError('INCORRECT_PASSWORD')

    const token = jwt.sign({ user: user }, process.env.JWT_SECRET)

    res.status(200).json({ user: user, token: token })
}