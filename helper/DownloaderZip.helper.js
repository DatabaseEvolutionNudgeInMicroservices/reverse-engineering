// Constants

const { FILE_SYSTEM_SEPARATOR, TEMP_FOLDER_NAME } = require('./Constant.helper.js')

// Errors

const DownloadFail = require('../error/DownloadFail.error.js')
const BadFormat = require('../error/BadFormat.error.js')
const { INPUT_INCORRECTLY_FORMATTED } = require('../error/Constant.error')

// Helpers

const Downloader = require('./Downloader.helper.js')

// Libraries

const fs = require('fs')
const AdmZip = require('adm-zip')

/**
 * @overview This class represents a downloader.
 */
class DownloaderZip extends Downloader {
  /**
   * Instantiates a downloader.
   */
  constructor() {
    super()
  }

  /**
   * Downloads an element.
   * @param element {String} The given element.
   * @param destination [String] The destination.
   * @returns {Promise} A promise for the downloading.
   */
  downloadByElement(element, destination) {
    return new Promise((resolve, reject) => {
      if (element !== undefined && element !== null && element.length !== 0) {
        // 1. Acquisition

        try {
          fs.access(element, fs.constants.F_OK, (error) => {
            if (error) {
              reject(new DownloadFail(error.message))
              return
            }

            const extractionFolderPath =
              process.cwd() +
              FILE_SYSTEM_SEPARATOR +
              TEMP_FOLDER_NAME +
              FILE_SYSTEM_SEPARATOR +
              destination

            try {
              const zip = new AdmZip(element) // Load the ZIP file
              zip.extractAllTo(extractionFolderPath, true) // Extract all files

              const folders = fs
                .readdirSync(extractionFolderPath)
                .filter((file) =>
                  fs.statSync(extractionFolderPath + FILE_SYSTEM_SEPARATOR + file).isDirectory()
                )

              resolve(folders)
            } catch (extractionError) {
              reject(new DownloadFail(extractionError.message))
            }
          })
        } catch (error) {
          reject(new DownloadFail(error.message))
        }
      } else {
        reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
      }
    })
  }
}

module.exports = DownloaderZip
