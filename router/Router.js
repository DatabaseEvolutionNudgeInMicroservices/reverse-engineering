// Imports

const express = require('express')
const Controller = require('../controller/Controller.controller.js')
const BadFormat = require('../error/BadFormat.error.js')
const DownloadFail = require('../error/DownloadFail.error.js')
const AnalysisFail = require('../error/AnalysisFail.error.js')
const CleaningFail = require('../error/CleaningFail.error.js')
const { DOWNLOAD_FAIL, INPUT_INCORRECTLY_FORMATTED } = require('../error/Constant.error')
const { FILE_SYSTEM_SEPARATOR } = require('../helper/Constant.helper')
const multer = require('multer')
const path = require('path')

// Configuration

const router = express.Router()

const controller = new Controller()

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, process.cwd() + FILE_SYSTEM_SEPARATOR + 'TEMP' + FILE_SYSTEM_SEPARATOR)
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now()
      const ext = path.extname(file.originalname)
      const uniqueFileName = `${timestamp}${ext}`
      cb(null, uniqueFileName)
    }
  })
})

router.post(
  '/static/language/:language/repository/zip',
  upload.single('file'),
  function (request, response) {
    if (request.file) {
      const { path: zipTempFilePath } = request.file
      controller
        .analyzeStatically(zipTempFilePath, request.params.language)
        .then((result) => {
          response.status(200)
          response.json(result)
        })
        .catch((error) => {
          switch (true) {
            case error instanceof BadFormat:
              response.status(400)
              break
            case error instanceof DownloadFail:
              response.status(404)
              break
            case error instanceof AnalysisFail:
              response.status(500)
              break
            case error instanceof CleaningFail:
              response.status(500)
              break
            default:
              response.status(500)
              break
          }
          response.json({ name: error.name, message: error.message })
        })
    } else {
      response.status(400).json({ name: DOWNLOAD_FAIL, message: INPUT_INCORRECTLY_FORMATTED })
    }
  }
)

module.exports = router
