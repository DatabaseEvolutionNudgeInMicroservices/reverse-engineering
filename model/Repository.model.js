// Model

const Directory = require("./Directory.model");

// Error

const BadFormat = require('../error/BadFormat.error.js');

/**
 * @overview This class represents a repository.
 */
class Repository {

    /**
     * Instantiates a repository.
     */
    constructor(location, directories) {
        this.setLocation(location);
        this.setDirectories(directories);
    }

    setLocation(location) {
        if (location !== null && location !== undefined && location.length > 0) {
            this.location = location;
        } else {
            throw new BadFormat();
        }
    }

    getLocation() {
        return this.location;
    }

    setDirectories(directories) {
        if (directories !== null && directories !== undefined) {
            this.directories = directories;
        } else {
            throw new BadFormat();
        }
    }

    getDirectories() {
        return this.directories;
    }

    /**
     * Revives a Repository object.
     * @param object {Object} The given JavaScript object.
     * @return {Repository} The related Repository object.
     * @throws {Error} In the case of an invalid object format.
     */
    static revive(object) {
        try {
            if (object !== null && object !== undefined
                && object.hasOwnProperty('location') && object.location !== null && object.location !== undefined
                && object.hasOwnProperty('directories') && object.directories !== null && object.directories !== undefined) {
                let directories = [];
                object.directories.forEach(directory => directories.push(Directory.revive(directory)));
                return new Repository(object.location, directories);
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

module.exports = Repository;