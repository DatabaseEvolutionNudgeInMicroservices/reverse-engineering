// Error

const BadFormat = require('../error/BadFormat.error.js')
const { INPUT_INCORRECTLY_FORMATTED } = require('../error/Constant.error.js')

/**
 * @overview This class represents a sample.
 */
class Sample {
  /**
   * Instantiates a sample.
   */
  constructor(content) {
    this.setContent(content)
  }

  setContent(content) {
    if (content !== null && content !== undefined) {
      this.content = content
    } else {
      throw new BadFormat(INPUT_INCORRECTLY_FORMATTED)
    }
  }

  getContent() {
    return this.content
  }

  /**
   * Revives a Sample object.
   * @param object {Object} The given JavaScript object.
   * @return {Sample} The related Sample object.
   * @throws {Error} In the case of an invalid object format.
   */
  static revive(object) {
    try {
      if (
        object !== null &&
        object !== undefined &&
        object.hasOwnProperty('content') &&
        object.content !== null &&
        object.content !== undefined
      ) {
        return new Sample(object.content)
      } else {
        throw new BadFormat(INPUT_INCORRECTLY_FORMATTED)
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Prints the object in a human-readable way (JSON).
   */
  toString() {
    return JSON.stringify(this)
  }
}

module.exports = Sample
