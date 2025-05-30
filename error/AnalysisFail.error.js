/**
 * @overview Represents an analysis failure.
 */
const { ANALYSIS_FAIL } = require('./Constant.error.js')

class AnalysisFail extends Error {
  constructor(message) {
    super()
    this.name = ANALYSIS_FAIL
    this.message = message !== undefined ? message : ''
  }
}

module.exports = AnalysisFail
