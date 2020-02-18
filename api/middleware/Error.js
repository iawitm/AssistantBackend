const ErrorTypes = {
  INCORRECT_DATE: 400,
  NO_XLSX_PROVIDED: 400,
  NO_META_PROVIDED: 400
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
