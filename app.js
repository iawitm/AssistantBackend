const os = require("os")
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const formData = require("express-form-data")
require('express-async-errors')
require('dotenv').config()

const app = express() //to this variable connects everything, something like main function

const routes = require('./api/routes/index')
const errorMiddleware = require('./api/middleware/Error').errorMiddleware

const formDataOptions = {
	uploadDir: os.tmpdir(),
	autoClean: true
}

app.use(cors())
app.use(bodyParser.json())
app.use(formData.parse(formDataOptions))
app.use('/', routes)
app.use(errorMiddleware)

mongoose.connect(
	process.env.DB_URL, { 
		useCreateIndex: true,
		useNewUrlParser: true, 
		useUnifiedTopology: true, 
		useFindAndModify: false
	 }
)
mongoose.Promise = global.Promise

app.listen(process.env.PORT, () => {
	console.log('Server started 🚀')
})
