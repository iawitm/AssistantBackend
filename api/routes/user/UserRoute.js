const express = require('express')
const router = express.Router()

const AuthController = require('../../controllers/user/AuthController')
const ManageController = require('../../controllers/user/ManageController')

router.post('/register', AuthController.createUser)
router.post('/login', AuthController.obtainToken)
router.get('/', ManageController.getUsers)
router.delete('/', ManageController.removeUser)

module.exports = router
