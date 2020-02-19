const express = require('express')
const router = express.Router()

const ProfessorController = require('../controllers/ProfessorController')

router.get('/', ProfessorController.getByProfessor)

module.exports = router
