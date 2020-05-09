const ErrorTypes = {
	INCORRECT_DATE: 400,
	NO_XLSX_PROVIDED: 400,
	NO_META_PROVIDED: 400,
	NO_QUERY: 400,
	WRONG_INSTITUTE: 400,
	NO_SUCH_SCHEDULE: 400,
	DUPLICATE_LOGIN: 409,
	BAD_ROLE: 400,
	NO_SUCH_USER: 404,
	INCORRECT_PASSWORD: 401,
	BAD_AUTH_CREDENTIALS: 401,
	NOT_ADMIN: 403,
	NO_SUCH_GROUP: 404
}

class HttpError extends Error {
	constructor(type) {
		super(type.toString())
		this.errorName = type.toString()
		this.statusCode = ErrorTypes[type]
	}
}

exports.errorMiddleware = async function errorMiddleware(err, req, res, next) {
	let text = 'INTERNAL_SERVER_ERROR'
	let code = 500
	if (err instanceof HttpError) {
		text = err.errorName
		code = err.statusCode
	}
	else {
		console.error(err)
	}
	res.status(code)
		.json({ error: text })
		.end()
}

exports.HttpError = HttpError
