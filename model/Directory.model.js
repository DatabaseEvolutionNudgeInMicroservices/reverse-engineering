// Model

const File = require("./File.model");

// Error

const BadFormat = require('../error/BadFormat.error.js');

/**
 * @overview This class represents a directory.
 */
class Directory {

    /**
     * Instantiates a directory.
     */
    constructor(location, directories, files) {
        this.setLocation(location);
        this.setDirectories(directories);
        this.setFiles(files);
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

    setFiles(files) {
        if (files !== null && files !== undefined) {
            this.files = files;
        } else {
            throw new BadFormat();
        }
    }

    getFiles() {
        return this.files;
    }

    /**
     * Revives a Directory object.
     * @param object {Object} The given JavaScript object.
     * @return {Directory} The related Directory object.
     * @throws {Error} In the case of an invalid object format.
     */
    static revive(object) {
        try {
            if (object !== null && object !== undefined
                && object.hasOwnProperty('location') && object.location !== null && object.location !== undefined
                && object.hasOwnProperty('directories') && object.directories !== null && object.directories !== undefined
                && object.hasOwnProperty('files') && object.files !== null && object.files !== undefined) {
                let files = [];
                object.files.forEach(file => files.push(File.revive(file)))
                let directories = [];
                object.directories.forEach(directory => directories.push(Directory.revive(directory)))
                return new Directory(object.location, directories, files);
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

module.exports = Directory;