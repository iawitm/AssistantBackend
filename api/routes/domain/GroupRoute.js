const express = require('express')
const router = express.Router()

const GroupsController = require('../../controllers/domain/GroupsController')

router.get('/', GroupsController.getGroups)
router.get('/check', GroupsController.checkGroup)

module.exports = router
