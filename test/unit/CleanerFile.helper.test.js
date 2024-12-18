// Helpers

const CleanerFile = require('../../helper/CleanerFile.helper.js');

// Libraries

const fs = require('fs');

// Constants

const {FILE_SYSTEM_SEPARATOR, TEMP_FOLDER_NAME} = require('../../helper/Constant.helper');

// Errors

const CleaningFail = require('../../error/CleaningFail.error.js');
const BadFormat = require('../../error/BadFormat.error.js');

// Setup

let directories = ['test1', 'test2', 'test3'];
let files = ['file1.txt', 'file2.txt', 'file3.txt'];

// Happy path test suite

describe('File cleaner', () => {

    beforeEach(() => {
        const tempPath = `${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}`;
        directories.forEach((directory) => {
            const directoryPath = `${tempPath}${FILE_SYSTEM_SEPARATOR}${directory}`
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath);
            }
            files.forEach((fileName) => {
                const filePath = `${directoryPath}${FILE_SYSTEM_SEPARATOR}${fileName}`;
                fs.writeFileSync(filePath, 'Test');
            });
        });
        files.forEach((fileName) => {
            const filePath = `${tempPath}${FILE_SYSTEM_SEPARATOR}${fileName}`;
            fs.writeFileSync(filePath, 'Test');
        });
    });

    it('cleans a file', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await cleanerFile.cleanByElement(files[0]).then((result) => {
            const fileDeleted = fs.existsSync(`${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${files[0]}`);
            expect(fileDeleted).toBe(false);
        });
    });

    it('cleans a directory', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await cleanerFile.cleanByElement(directories[0]).then((result) => {
            const directoryDeleted = fs.existsSync(`${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${directories[0]}`);
            expect(directoryDeleted).toBe(false);
        });
    });

    it('cleans a directory list', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await cleanerFile.cleanByList(directories).then(async (result) => {
            const directoryDeleted1 = fs.existsSync(`${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${directories[0]}`);
            const directoryDeleted2 = fs.existsSync(`${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${directories[1]}`);
            const directoryDeleted3 = fs.existsSync(`${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${directories[2]}`);
            expect(directoryDeleted1 || directoryDeleted2 || directoryDeleted3).toBe(false);
        });
    });

    it('cleans a file list', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await cleanerFile.cleanByList(files).then(async (result) => {
            const fileDeleted1 = fs.existsSync(`${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${files[0]}`);
            const fileDeleted2 = fs.existsSync(`${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${files[1]}`);
            const fileDeleted3 = fs.existsSync(`${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${files[2]}`);
            expect(fileDeleted1 || fileDeleted2 || fileDeleted3).toBe(false);
        });
    });

    it('cleans all directories and files in a directory', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await cleanerFile.cleanAll().then(async (result) => {
            const directoryDeleted1 = fs.existsSync(`${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${directories[0]}`);
            const directoryDeleted2 = fs.existsSync(`${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${directories[1]}`);
            const directoryDeleted3 = fs.existsSync(`${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${directories[2]}`);
            const fileDeleted1 = fs.existsSync(`${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${files[0]}`);
            const fileDeleted2 = fs.existsSync(`${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${files[1]}`);
            const fileDeleted3 = fs.existsSync(`${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${files[2]}`);
            expect(directoryDeleted1 || directoryDeleted2 || directoryDeleted3 || fileDeleted1 || fileDeleted2 || fileDeleted3).toBe(false);
        });
    });
});

// Failure cases test suite

describe('File cleaner tries to', () => {

    it('clean a not found file or directory', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await expect(cleanerFile.cleanByElement('unknown')).rejects.toThrow(CleaningFail);
    });

    it('clean a list with not found files or directories', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await expect(cleanerFile.cleanByList(['unknown'])).rejects.toThrow(CleaningFail);
    });

    it('clean an undefined file or directory', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await expect(cleanerFile.cleanByElement(undefined)).rejects.toThrow(BadFormat);

    });

    it('clean an undefined file or directory list', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await expect(cleanerFile.cleanByList(undefined)).rejects.toThrow(BadFormat);
    });

    it('clean a null file or directory', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await expect(cleanerFile.cleanByElement(null)).rejects.toThrow(BadFormat);

    });

    it('clean a null file or directory list', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await expect(cleanerFile.cleanByList(null)).rejects.toThrow(BadFormat);
    });

    it('clean a file or directory list with undefined directories', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await expect(cleanerFile.cleanByList([undefined])).rejects.toThrow(CleaningFail);
    });

    it('clean a file or directory list with null directories', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await expect(cleanerFile.cleanByList([null])).rejects.toThrow(CleaningFail);
    });

    it('clean an empty file or directory list', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await expect(cleanerFile.cleanByList([])).toBeInstanceOf(Promise);
    });
});