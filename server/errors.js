class SwipeError extends Error {
  constructor (message, status, cause) {
    super(message)
    this.status = status
    this.cause = cause
  }
}

module.exports = {
  SwipeError
}