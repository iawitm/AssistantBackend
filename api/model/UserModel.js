const mongoose = require('mongoose')

const UserRole = {
    ADMIN: 'ADMIN',
    MODERATOR: 'MODERATOR'
}

const userSchema = mongoose.Schema({
    login: {
        type: String,
        unique: true,
        required: true,
        match: /[a-z0-9A-Z]+/
    },
    password: { 
        type: String, 
        required: true
    },
    role: {
        type: String,
        default: UserRole['MODERATOR']
    }
})

module.exports = {
    User: mongoose.model('User', userSchema),
    UserRole: UserRole
}