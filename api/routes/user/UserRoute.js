const express = require('express')
const router = express.Router()
const checkAdmin = require('../../middleware/Admin')

const AuthController = require('../../controllers/user/AuthController')
const ManageController = require('../../controllers/user/ManageController')

router.post('/login', AuthController.obtainToken)
router.post('/register', checkAdmin, AuthController.createUser)
router.get('/', checkAdmin, ManageController.getUsers)
router.delete('/', checkAdmin, ManageController.removeUser)

module.exports = router
