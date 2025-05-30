// Model

const CodeFragment = require('./CodeFragment.model')

// Error

const BadFormat = require('../error/BadFormat.error.js')

/**
 * @overview This class represents a file.
 */
class File {
  /**
   * Instantiates a file.
   */
  constructor(location, linesOfCode, codeFragments) {
    this.setLocation(location)
    this.setLinesOfCode(linesOfCode)
    this.setCodeFragments(codeFragments)
  }

  setLocation(location) {
    if (location !== null && location !== undefined && location.length > 0) {
      this.location = location
    } else {
      throw new BadFormat()
    }
  }

  getLocation() {
    return this.location
  }

  setLinesOfCode(linesOfCode) {
    if (linesOfCode !== null && linesOfCode !== undefined) {
      let number = 0
      try {
        number = Number.parseInt(linesOfCode)
      } catch (error) {
        throw new BadFormat()
      }
      if (number >= 0) {
        this.linesOfCode = number
      } else {
        throw new BadFormat()
      }
    } else {
      throw new BadFormat()
    }
  }

  getLinesOfCode() {
    return this.linesOfCode
  }

  setCodeFragments(codeFragments) {
    if (codeFragments !== null && codeFragments !== undefined) {
      this.codeFragments = codeFragments
    } else {
      throw new BadFormat()
    }
  }

  getCodeFragments() {
    return this.codeFragments
  }

  /**
   * Revives a File object.
   * @param object {Object} The given JavaScript object.
   * @return {File} The related File object.
   * @throws {Error} In the case of an invalid object format.
   */
  static revive(object) {
    try {
      if (
        object !== null &&
        object !== undefined &&
        object.hasOwnProperty('location') &&
        object.location !== null &&
        object.location !== undefined &&
        object.hasOwnProperty('linesOfCode') &&
        object.linesOfCode !== null &&
        object.linesOfCode !== undefined
      ) {
        let codeFragments = []
        object.codeFragments.forEach((codeFragment) =>
          codeFragments.push(CodeFragment.revive(codeFragment))
        )
        return new File(object.location, object.linesOfCode, codeFragments)
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

module.exports = File
