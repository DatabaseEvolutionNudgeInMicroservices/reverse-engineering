// Imports

const express = require('express');
const Controller = require('../controller/Controller.controller.js');
const BadFormat = require('../error/BadFormat.error.js');
const DownloadFail = require('../error/DownloadFail.error.js');
const AnalysisFail = require('../error/AnalysisFail.error.js');
const CleaningFail = require('../error/CleaningFail.error.js');
const {DOWNLOAD_FAIL, INPUT_INCORRECTLY_FORMATTED} = require('../error/Constant.error');
const {FILE_SYSTEM_SEPARATOR} = require("../helper/Constant.helper");
const multer = require('multer');
const {readFileSync} = require("fs");

// Configuration

const router = express.Router();

const controller = new Controller();

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, process.cwd() + FILE_SYSTEM_SEPARATOR + 'TEMP' + FILE_SYSTEM_SEPARATOR);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })
});

// Helper function for handling file uploads and responses

const handleFileUploadAndResponse = (fileMethod) => (request, response) => {
    if (request.files.file) {
        const {path: zipTempFilePath, originalname: originalFileName} = request.files.file[0];
        const db_details = request.files.concepts ? JSON.parse(readFileSync(request.files.concepts[0].path, 'utf-8')) : undefined;
        fileMethod.call(controller, zipTempFilePath, request.params.language, db_details)
            .then((result) => {
                response.status(200);
                response.json(result);
            })
            .catch((error) => {
                switch (true) {
                    case error instanceof BadFormat:
                        response.status(400);
                        break;
                    case error instanceof DownloadFail:
                        response.status(404);
                        break;
                    case error instanceof AnalysisFail:
                        response.status(500);
                        break;
                    case error instanceof CleaningFail:
                        response.status(500);
                        break;
                    default:
                        response.status(500);
                        break;
                }
                response.json({name: error.name, message: error.message});
            });
    } else {
        response.status(400).json({name: DOWNLOAD_FAIL, message: INPUT_INCORRECTLY_FORMATTED});
    }
};

// Endpoints

router.post('/static/heuristics/language/:language/repository/zip', upload.single('file'), handleFileUploadAndResponse(controller.analyzeStaticallyHeuristics));

router.post('/static/nlp/language/:language/repository/zip', upload.fields([
    {name: 'file'},
    {name: 'concepts', maxCount: 1}
]), handleFileUploadAndResponse(controller.analyzeStaticallyNLP));


module.exports = router;