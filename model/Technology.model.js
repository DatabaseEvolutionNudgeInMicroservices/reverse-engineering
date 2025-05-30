// Error

const BadFormat = require('../error/BadFormat.error.js')

/**
 * @overview This class represents a technology.
 */
class Technology {
  /**
   * Instantiates a technology.
   */
  constructor(id) {
    this.setId(id)
  }

  setId(id) {
    if (id !== null && id !== undefined && id.length > 0) {
      this.id = id
    } else {
      throw new BadFormat()
    }
  }

  getId() {
    return this.id
  }

  /**
   * Revives a Technology object.
   * @param object {Object} The given JavaScript object.
   * @return {Technology} The related Technology object.
   * @throws {Error} In the case of an invalid object format.
   */
  static revive(object) {
    try {
      if (
        object !== null &&
        object !== undefined &&
        object.hasOwnProperty('id') &&
        object.id !== null &&
        object.id !== undefined
      ) {
        return new Technology(object.id)
      } else {
        throw new BadFormat()
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

module.exports = Technology
