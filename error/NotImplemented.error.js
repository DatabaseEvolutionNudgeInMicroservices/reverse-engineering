/**
 * @overview Represents a not implemented error.
 */
const {NOT_IMPLEMENTED} = require('./Constant.error.js');

class NotImplemented extends Error {
    constructor(message) {
        super();
        this.name = NOT_IMPLEMENTED;
        this.message = message !== undefined ? message : '';
    }
}

module.exports = NotImplemented;