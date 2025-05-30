/**
 * @overview Represents a download failure.
 */
const { DOWNLOAD_FAIL } = require('./Constant.error.js')

class DownloadFail extends Error {
  constructor(message) {
    super()
    this.name = DOWNLOAD_FAIL
    this.message = message !== undefined ? message : ''
  }
}

module.exports = DownloadFail
