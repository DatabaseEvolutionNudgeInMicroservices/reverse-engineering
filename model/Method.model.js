// Error

const BadFormat = require('../error/BadFormat.error.js')

/**
 * @overview This class represents a method.
 */
class Method {
  /**
   * Instantiates a method.
   */
  constructor(name) {
    this.setName(name)
  }

  setName(name) {
    if (name !== null && name !== undefined && name.length > 0) {
      this.name = name
    } else {
      throw new BadFormat()
    }
  }

  getName() {
    return this.name
  }

  /**
   * Revives a Method object.
   * @param object {Object} The given JavaScript object.
   * @return {Method} The related Method object.
   * @throws {Error} In the case of an invalid object format.
   */
  static revive(object) {
    try {
      if (
        object !== null &&
        object !== undefined &&
        object.hasOwnProperty('name') &&
        object.name !== null &&
        object.name !== undefined
      ) {
        return new Method(object.name)
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

module.exports = Method
