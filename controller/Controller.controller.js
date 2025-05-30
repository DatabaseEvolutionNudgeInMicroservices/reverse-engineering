// Libraries

const fs = require('fs')
const crypto = require('crypto')

// Helpers

const DownloaderZip = require('../helper/DownloaderZip.helper.js')
const CleanerFile = require('../helper/CleanerFile.helper.js')
const StaticAnalyzerCodeQL = require('../helper/StaticAnalyzerCodeQL.helper.js')

// Errors

const BadFormat = require('../error/BadFormat.error.js')
const { INPUT_INCORRECTLY_FORMATTED } = require('../error/Constant.error.js')

// Constants

const {
  LANGUAGES_SUPPORTED,
  FILE_SYSTEM_SEPARATOR,
  TEMP_FOLDER_NAME
} = require('../helper/Constant.helper.js')

/**
 * @overview This class represents the controller.
 */
class Controller {
  /**
   * Instantiates a controller.
   */
  constructor() {
    this.downloaderZip = new DownloaderZip()
    this.cleanerFile = new CleanerFile()
    this.staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
  }

  /**
   * Cleans the destination directory.
   * @param destination {String} The destination directory to clean.
   * @param attempts {Number} The number of attempts in case of failure (e.g., lock on files).
   */
  clean(destination, attempts = 5) {
    this.cleanerFile.cleanByElement(destination).catch(() => {
      let self = this
      if (attempts > 0) {
        let newRetry = attempts - 1
        setTimeout(() => {
          self.clean(destination, newRetry)
        }, 1000)
      }
    })
  }

  /**
   * Analyzes statically.
   * @param zipTempFilePath {String} A zip temp file path.
   * @param language {String} The targeted language for the static analysis.
   * @returns {Promise} A promise for the analysis.
   */
  analyzeStatically(zipTempFilePath, language) {
    return new Promise((resolve, reject) => {
      if (
        zipTempFilePath !== undefined &&
        zipTempFilePath !== null &&
        zipTempFilePath.length !== 0
      ) {
        const zipTempFile = zipTempFilePath.split(FILE_SYSTEM_SEPARATOR).pop()
        const destinationDirectory = crypto.randomUUID()
        fs.mkdirSync(
          `${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${destinationDirectory}${FILE_SYSTEM_SEPARATOR}`
        ) // Unique directory for distinguishing the requests from different users.
        if (
          language !== undefined &&
          language !== null &&
          language.length !== 0 &&
          LANGUAGES_SUPPORTED.includes(language)
        ) {
          try {
            // 1. Acquisition
            this.downloaderZip
              .downloadByElement(zipTempFilePath, destinationDirectory)
              .then((downloadedRepositoryList) => {
                // 2. Initialization
                this.staticAnalyzerCodeQL
                  .initializesByList(downloadedRepositoryList, language, destinationDirectory)
                  .then((initializedRepositoryList) => {
                    // 3. Identification
                    this.staticAnalyzerCodeQL
                      .identifyByList(initializedRepositoryList, language, destinationDirectory)
                      .then((analyzedRepositoryList) => {
                        // 4. Extraction
                        this.staticAnalyzerCodeQL
                          .extractByList(analyzedRepositoryList, language, destinationDirectory)
                          .then((extractedRepositoryList) => {
                            // 5. Interpretation
                            this.staticAnalyzerCodeQL
                              .interpretByList(
                                extractedRepositoryList,
                                language,
                                destinationDirectory
                              )
                              .then((interpretedRepositoryList) => {
                                // 6. Presentation
                                let finalResult = interpretedRepositoryList
                                resolve(finalResult)
                                this.clean(destinationDirectory)
                                this.clean(zipTempFile)
                              })
                          })
                          .catch((error) => {
                            reject(error)
                            this.clean(destinationDirectory)
                            this.clean(zipTempFile)
                          })
                      })
                      .catch((error) => {
                        reject(error)
                        this.clean(destinationDirectory)
                        this.clean(zipTempFile)
                      })
                  })
                  .catch((error) => {
                    reject(error)
                    this.clean(destinationDirectory)
                    this.clean(zipTempFile)
                  })
              })
              .catch((error) => {
                reject(error)
                this.clean(destinationDirectory)
                this.clean(zipTempFile)
              })
          } catch (error) {
            reject(error)
            this.clean(destinationDirectory)
            this.clean(zipTempFile)
          }
        } else {
          reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
          this.clean(destinationDirectory)
          this.clean(zipTempFile)
        }
      } else {
        reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
      }
    })
  }
}

module.exports = Controller
