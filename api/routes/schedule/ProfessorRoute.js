const express = require('express')
const router = express.Router()

const ProfessorController = require('../../controllers/schedule/ProfessorController')

router.get('/', ProfessorController.getByProfessor)

module.exports = router
