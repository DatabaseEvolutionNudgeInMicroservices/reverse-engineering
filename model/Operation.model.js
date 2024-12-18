// Error

const BadFormat = require('../error/BadFormat.error.js');
const BadOperation = require("../error/BadOperation.error");

/**
 * @overview This class represents an operation.
 */
class Operation {

    /**
     * Instantiates an operation request.
     */
    constructor(name) {
        this.setName(name);
    }

    setName(name) {
        if (Operation.check(name)) {
            this.name = name;
        } else {
            throw new BadOperation();
        }
    }

    getName() {
        return this.name;
    }

    /**
     * Checks if the operation is valid.
     * @param name The given operation candidate.
     */
    static check(name) {
        return ["CREATE", "READ", "UPDATE", "DELETE", "OTHER"].includes(name);
    }

    /**
     * Revives an Operation object.
     * @param object {Object} The given JavaScript object.
     * @return {Operation} The related Operation object.
     * @throws {Error} In the case of an invalid object format.
     */
    static revive(object) {
        try {
            if (object !== null && object !== undefined
                && object.hasOwnProperty('name') && object.name !== null && object.name !== undefined) {
                return new Operation(object.name);
            } else {
                throw new BadFormat();
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Prints the object in a human-readable way (JSON).
     */
    toString() {
        return JSON.stringify(this);
    }
}

module.exports = Operation;