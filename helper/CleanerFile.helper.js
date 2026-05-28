// Constants

const { TEMP_FOLDER_NAME } = require('./Constant.helper.js')

// Errors

const BadFormat = require('../error/BadFormat.error.js')
const CleaningFail = require('../error/CleaningFail.error.js')
const { FILES_MISSING, INPUT_INCORRECTLY_FORMATTED } = require('../error/Constant.error.js')

// Helpers

const Cleaner = require('./Cleaner.helper.js')

// Libraries

const fs = require('fs')
const path = require('path')

/**
 * @overview This class represents a file cleaner.
 */
class CleanerFile extends Cleaner {
  /**
   * Instantiates a cleaner.
   */
  constructor() {
    super()
  }

  /**
   * Cleans a list.
   * @param list {[String]} The given list.
   * @returns {Promise} A promise for the cleaning.
   */
  cleanByList(list) {
    return new Promise((resolveAll, rejectAll) => {
      if (list !== undefined && list !== null) {
        let promises = []
        list.forEach((element) => {
          promises.push(
            new Promise((resolve, reject) => {
              this.cleanByElement(element)
                .then((result) => {
                  resolve(result)
                })
                .catch((error) => {
                  reject(new CleaningFail(error.message))
                })
            })
          )
        })
        Promise.all(promises)
          .then((resultsAll) => {
            resolveAll(resultsAll)
          })
          .catch((errorAll) => {
            rejectAll(errorAll)
          })
      } else {
        rejectAll(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
      }
    })
  }

  /**
   * Cleans an element.
   * @param element {String} The given element.
   * @returns {Promise} A promise for the cleaning.
   */
  cleanByElement(element) {
    return new Promise((resolve, reject) => {
      if (element !== undefined && element !== null && element.length !== 0) {
        let elementPath = path.join(process.cwd(), TEMP_FOLDER_NAME, element)
        if (fs.existsSync(elementPath)) {
          try {
            const stats = fs.lstatSync(elementPath)
            if (stats.isDirectory()) {
              fs.rmSync(elementPath, { recursive: true, force: true })
              resolve(true)
            } else if (stats.isFile()) {
              fs.rmSync(elementPath, { force: true })
              resolve(true)
            }
          } catch (error) {
            reject(new CleaningFail(error.message))
          }
          reject(new CleaningFail(FILES_MISSING))
        } else {
          reject(new CleaningFail(FILES_MISSING))
        }
      } else {
        reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
      }
    })
  }
}

module.exports = CleanerFile
