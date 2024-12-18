/**
 * @overview Represents a download failure.
 */
const {CLEANING_FAIL} = require('./Constant.error.js');

class CleaningFail extends Error {
    constructor(message) {
        super();
        this.name = CLEANING_FAIL;
        this.message = message !== undefined ? message : '';
    }
}

module.exports = CleaningFail;