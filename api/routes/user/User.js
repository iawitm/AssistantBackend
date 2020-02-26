const express = require('express')
const router = express.Router()

const AuthController = require('../../controllers/user/Auth')

router.post('/register', AuthController.createUser)
router.post('/login', AuthController.obtainToken)

module.exports = router
