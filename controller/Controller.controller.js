// Libraries

const fs = require('fs')
const crypto = require('crypto')
const path = require('path')

// Helpers

const DownloaderZip = require('../helper/DownloaderZip.helper.js')
const CleanerFile = require('../helper/CleanerFile.helper.js')
const StaticAnalyzerAST = require('../helper/StaticAnalyzerAST.helper.js')
const StaticAnalyzerNLPTR = require('../helper/StaticAnalyzerNLPTR.helper.js')

// Model

const Repository = require('../model/Repository.model.js')

// Errors

const BadFormat = require('../error/BadFormat.error.js')
const { INPUT_INCORRECTLY_FORMATTED } = require('../error/Constant.error.js')

// Constants

const { TEMP_FOLDER_NAME } = require('../helper/Constant.helper.js')

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
    this.staticAnalyzerAST = new StaticAnalyzerAST()
    this.staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
  }

  /**
   * Cleans the destination directory.
   * @param destinationDirectoryRelativePath {String} The destination directory relative path to clean.
   * @param attempts {Number} The number of attempts in case of failure (e.g., lock on files).
   */
  clean(destinationDirectoryRelativePath, attempts = 5) {
    this.cleanerFile.cleanByElement(destinationDirectoryRelativePath).catch(() => {
      let self = this
      if (attempts > 0) {
        let newRetry = attempts - 1
        setTimeout(() => {
          self.clean(destinationDirectoryRelativePath, newRetry)
        }, 1000)
      }
    })
  }

  /**
   * Analyzes statically with AST technique.
   * @param zipTempFilePath {String} A zip temp file path.
   * @param options {Object} The options for the static analysis.
   * @returns {Promise} A promise for the analysis.
   */
  analyzeStaticallyAST(zipTempFilePath, options) {
    return new Promise((resolve, reject) => {
      if (
        zipTempFilePath !== undefined &&
        zipTempFilePath !== null &&
        zipTempFilePath.length !== 0
      ) {
        const zipTempFile = zipTempFilePath.split(path.sep).pop()
        const destinationDirectoryRelativePath = crypto.randomUUID()
        fs.mkdirSync(path.join(process.cwd(), TEMP_FOLDER_NAME, destinationDirectoryRelativePath)) // Unique directory for distinguishing the requests from different users.
        if (options !== undefined && options !== null && options instanceof Object) {
          try {
            // 1. Acquisition
            this.downloaderZip
              .downloadByElement(zipTempFilePath, destinationDirectoryRelativePath)
              .then((downloadedRepositoryList) => {
                let downloadedRepositories = downloadedRepositoryList.map(
                  (repository) => new Repository(repository, [])
                )
                // 2. Initialization
                this.staticAnalyzerAST
                  .initializesByRepositories(
                    downloadedRepositories,
                    destinationDirectoryRelativePath,
                    options
                  )
                  .then((initializedRepository) => {
                    // 3. Identification
                    this.staticAnalyzerAST
                      .identifyByRepositories(
                        initializedRepository,
                        destinationDirectoryRelativePath,
                        options
                      )
                      .then((analyzedRepositories) => {
                        // 4. Extraction
                        this.staticAnalyzerAST
                          .extractByRepositories(
                            analyzedRepositories,
                            destinationDirectoryRelativePath,
                            options
                          )
                          .then((extractedRepository) => {
                            // 5. Interpretation
                            this.staticAnalyzerAST
                              .interpretByRepositories(
                                extractedRepository,
                                destinationDirectoryRelativePath,
                                options
                              )
                              .then((interpretedRepository) => {
                                // 6. Presentation
                                let repositories = interpretedRepository
                                resolve(repositories)
                                this.clean(destinationDirectoryRelativePath)
                                this.clean(zipTempFile)
                              })
                          })
                          .catch((error) => {
                            reject(error)
                            this.clean(destinationDirectoryRelativePath)
                            this.clean(zipTempFile)
                          })
                      })
                      .catch((error) => {
                        reject(error)
                        this.clean(destinationDirectoryRelativePath)
                        this.clean(zipTempFile)
                      })
                  })
                  .catch((error) => {
                    reject(error)
                    this.clean(destinationDirectoryRelativePath)
                    this.clean(zipTempFile)
                  })
              })
              .catch((error) => {
                reject(error)
                this.clean(destinationDirectoryRelativePath)
                this.clean(zipTempFile)
              })
          } catch (error) {
            reject(error)
            this.clean(destinationDirectoryRelativePath)
            this.clean(zipTempFile)
          }
        } else {
          reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
          this.clean(destinationDirectoryRelativePath)
          this.clean(zipTempFile)
        }
      } else {
        reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
      }
    })
  }

  /**
   * Analyzes statically with NLP and Text Retrieval techniques.
   * @param zipTempFilePath {String} A zip temp file path.
   * @param options {Object} The options for the NLP TR analysis.
   * @returns {Promise} A promise for the analysis.
   */
  analyzeStaticallyNLPTR(zipTempFilePath, options) {
    return new Promise((resolve, reject) => {
      if (
        zipTempFilePath !== undefined &&
        zipTempFilePath !== null &&
        zipTempFilePath.length !== 0
      ) {
        const zipTempFile = zipTempFilePath.split(path.sep).pop()
        const destinationDirectoryRelativePath = crypto.randomUUID()
        fs.mkdirSync(path.join(process.cwd(), TEMP_FOLDER_NAME, destinationDirectoryRelativePath)) // Unique directory for distinguishing the requests from different users.
        if (options !== undefined && options !== null && options instanceof Object) {
          try {
            // 1. Acquisition
            this.downloaderZip
              .downloadByElement(zipTempFilePath, destinationDirectoryRelativePath)
              .then((downloadedRepositoryList) => {
                let downloadedRepositories = downloadedRepositoryList.map(
                  (repository) => new Repository(repository, [])
                )
                // 2. Initialization
                this.staticAnalyzerNLPTR
                  .initializesByRepositories(
                    downloadedRepositories,
                    destinationDirectoryRelativePath,
                    options
                  )
                  .then((initializedRepository) => {
                    // 3. Identification
                    this.staticAnalyzerNLPTR
                      .identifyByRepositories(
                        initializedRepository,
                        destinationDirectoryRelativePath,
                        options
                      )
                      .then((analyzedRepositories) => {
                        // 4. Extraction
                        this.staticAnalyzerNLPTR
                          .extractByRepositories(
                            analyzedRepositories,
                            destinationDirectoryRelativePath,
                            options
                          )
                          .then((extractedRepository) => {
                            // 5. Interpretation
                            this.staticAnalyzerNLPTR
                              .interpretByRepositories(
                                extractedRepository,
                                destinationDirectoryRelativePath,
                                options
                              )
                              .then((interpretedRepository) => {
                                // 6. Presentation
                                let repositories = interpretedRepository
                                resolve(repositories)
                                this.clean(destinationDirectoryRelativePath)
                                this.clean(zipTempFile)
                              })
                          })
                          .catch((error) => {
                            reject(error)
                            this.clean(destinationDirectoryRelativePath)
                            this.clean(zipTempFile)
                          })
                      })
                      .catch((error) => {
                        reject(error)
                        this.clean(destinationDirectoryRelativePath)
                        this.clean(zipTempFile)
                      })
                  })
                  .catch((error) => {
                    reject(error)
                    this.clean(destinationDirectoryRelativePath)
                    this.clean(zipTempFile)
                  })
              })
              .catch((error) => {
                reject(error)
                this.clean(destinationDirectoryRelativePath)
                this.clean(zipTempFile)
              })
          } catch (error) {
            reject(error)
            this.clean(destinationDirectoryRelativePath)
            this.clean(zipTempFile)
          }
        } else {
          reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
          this.clean(destinationDirectoryRelativePath)
          this.clean(zipTempFile)
        }
      } else {
        reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
      }
    })
  }
}

module.exports = Controller
