/**
 * @overview Represents a bad operation error.
 */
const {BAD_OPERATION} = require("./Constant.error");

class BadOperation extends Error {
    constructor(message) {
        super();
        this.name = BAD_OPERATION;
        this.message = message !== undefined ? message : '';
    }
}

module.exports = BadOperation;