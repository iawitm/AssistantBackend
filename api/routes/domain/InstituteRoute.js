const express = require('express')
const router = express.Router()

const InstitutesController = require('../../controllers/domain/InstitutesController')

router.get('/', InstitutesController.getInstitutes)

module.exports = router
