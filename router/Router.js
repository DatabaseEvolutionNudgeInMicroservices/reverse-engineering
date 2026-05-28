// Imports

const express = require('express')
const multer = require('multer')
const path = require('path')
const Controller = require('../controller/Controller.controller.js')

// Errors

const BadFormat = require('../error/BadFormat.error.js')
const DownloadFail = require('../error/DownloadFail.error.js')
const AnalysisFail = require('../error/AnalysisFail.error.js')
const CleaningFail = require('../error/CleaningFail.error.js')
const { DOWNLOAD_FAIL, INPUT_INCORRECTLY_FORMATTED } = require('../error/Constant.error')

// Constants

const { TEMP_FOLDER_NAME } = require('../helper/Constant.helper')

// Configuration

const router = express.Router()

const controller = new Controller()

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(process.cwd(), TEMP_FOLDER_NAME))
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now()
      const ext = path.extname(file.originalname)
      const uniqueFileName = `${timestamp}${ext}`
      cb(null, uniqueFileName)
    }
  })
})

// Helpers

const handleRequest = (fileMethod) => (request, response) => {
  if (request && request.files && request.files.file) {
    const { path: zipTempFilePath } = request.files.file[0]
    let options = {}
    try {
      if (request.body && request.body.options) {
        options = JSON.parse(request.body.options)
      }
    } catch (error) {
      response.status(400).json({ name: DOWNLOAD_FAIL, message: INPUT_INCORRECTLY_FORMATTED })
    }
    fileMethod
      .call(controller, zipTempFilePath, {
        language: options?.language,
        hints: options?.hints
      })
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

// Endpoints

router.post(
  '/static/ast',
  upload.fields([{ name: 'file', maxCount: 1 }]),
  handleRequest(controller.analyzeStaticallyAST)
)

router.post(
  '/static/nlptr',
  upload.fields([{ name: 'file', maxCount: 1 }]),
  handleRequest(controller.analyzeStaticallyNLPTR)
)

module.exports = router
