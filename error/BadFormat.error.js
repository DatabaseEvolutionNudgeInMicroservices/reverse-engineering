/**
 * @overview Represents a bad format error.
 */
const { BAD_FORMAT } = require('./Constant.error.js')

class BadFormat extends Error {
  constructor(message) {
    super()
    this.name = BAD_FORMAT
    this.message = message !== undefined ? message : ''
  }
}

module.exports = BadFormat
