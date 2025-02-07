// Helpers

const DownloaderZip = require('../helper/DownloaderZip.helper.js');
const CleanerFile = require('../helper/CleanerFile.helper.js');
const StaticAnalyzerCodeQL = require('../helper/StaticAnalyzerCodeQL.helper.js');
const StaticAnalyzerNLP = require('../helper/StaticAnalyzerNLP.helper.js');

// Errors

const BadFormat = require('../error/BadFormat.error.js');
const {INPUT_INCORRECTLY_FORMATTED} = require('../error/Constant.error.js');

// Constants

const {
    LANGUAGES_SUPPORTED
} = require('../helper/Constant.helper.js');

/**
 * @overview This class represents the controller.
 */
class Controller {

    /**
     * Instantiates a controller.
     */
    constructor() {
        this.downloaderZip = new DownloaderZip();
        this.cleanerFile = new CleanerFile();
        this.staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();
        this.staticAnalyzerNLP = new StaticAnalyzerNLP();
    }

    /**
     * Cleans the all TEMP directory.
     * @returns {Promise} A promise for the cleaning.
     */
    clean() {
        return this.cleanerFile.cleanAll();
    }

    /**
     * Analyzes statically with heuristics
     * @param zipTempFilePath {String} A zip temp file path.
     * @param language {String} The targeted language for the static analysis.
     * @returns {Promise} A promise for the analysis.
     */
    analyzeStaticallyHeuristics(zipTempFilePath, language) {
        return new Promise((resolve, reject) => {
            if (zipTempFilePath !== undefined && zipTempFilePath !== null && zipTempFilePath.length !== 0 && language !== undefined && language !== null && language.length !== 0 && LANGUAGES_SUPPORTED.includes(language)) {
                try {

                    // 1. Acquisition
                    this.downloaderZip.downloadByElement(zipTempFilePath).then((downloadedRepositoryList) => {

                        // 2. Initialization
                        this.staticAnalyzerCodeQL.initializesByList(downloadedRepositoryList, language).then((initializedRepositoryList) => {

                            // 3. Identification
                            this.staticAnalyzerCodeQL.identifyByList(initializedRepositoryList, language).then((analyzedRepositoryList) => {

                                // 4. Extraction
                                this.staticAnalyzerCodeQL.extractByList(analyzedRepositoryList, language).then((extractedRepositoryList) => {

                                    // 5. Interpretation
                                    this.staticAnalyzerCodeQL.interpretByList(extractedRepositoryList, language).then((interpretedRepositoryList) => {

                                        // 6. Presentation
                                        let finalResult = interpretedRepositoryList;
                                        this.clean().then(() => {
                                            resolve(finalResult);
                                        });
                                    });
                                }).catch(error => {
                                    this.clean().then(() => {
                                        reject(error);
                                    });
                                });
                            }).catch(error => {
                                this.clean().then(() => {
                                    reject(error);
                                });
                            });
                        }).catch(error => {
                            this.clean().then(() => {
                                reject(error);
                            });
                        });
                    }).catch(error => {
                        this.clean().then(() => {
                            reject(error);
                        });
                    });
                } catch (error) {
                    this.clean().then(() => {
                        reject(error);
                    });
                }
            } else {
                this.clean().then(() => {
                    reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED));
                });
            }
        });
    }

    /**
     * Analyzes statically with text retrieval techniques
     * @param zipTempFilePath {String} A zip temp file path.
     * @param language {String} The targeted language for the static analysis.
     * @returns {Promise} A promise for the analysis.
     */
    analyzeStaticallyTextRetrieval(zipTempFilePath, language) {
        return new Promise((resolve, reject) => {

            if (zipTempFilePath !== undefined && zipTempFilePath !== null && zipTempFilePath.length !== 0 && language !== undefined && language !== null && language.length !== 0 && LANGUAGES_SUPPORTED.includes(language)) {
                try {


                    console.log("a", this, this.downloaderZip)

                    // 1. Acquisition
                    this.downloaderZip.downloadByElement(zipTempFilePath).then((downloadedRepositoryList) => {

                        // 2. Extraction
                        this.staticAnalyzerNLP.extractByList(downloadedRepositoryList, language).then((result) => {

                            // 3. Presentation
                            let finalResult = result;
                            this.clean().then(() => {
                                resolve(finalResult);
                            });

                        }).catch(error => {
                            this.clean().then(() => {
                                reject(error);
                            });
                        });
                    }).catch(error => {
                        this.clean().then(() => {
                            reject(error);
                        });
                    });
                } catch (error) {
                    console.log(error)
                    this.clean().then(() => {
                        reject(error);
                    });
                }
            } else {
                this.clean().then(() => {
                    reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED));
                });
            }
        });
    }

}

module.exports = Controller;