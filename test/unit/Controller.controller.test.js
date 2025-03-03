// Controllers

const Controller = require('../../controller/Controller.controller.js');

// Errors

const DownloadFail = require('../../error/DownloadFail.error.js');
const BadFormat = require('../../error/BadFormat.error.js');
const {FILE_SYSTEM_SEPARATOR} = require("../../helper/Constant.helper");

// Setup

const languages = ['javascript'];
const exampleRepository = process.cwd() + FILE_SYSTEM_SEPARATOR + 'test' + FILE_SYSTEM_SEPARATOR + 'unit' + FILE_SYSTEM_SEPARATOR + 'asset' + FILE_SYSTEM_SEPARATOR + 'example.zip';

// Happy path test suite

describe('Controller', () => {

    it('analyzes statically a repository with heuristics', async () => {

        // Given

        let controller = new Controller();

        // When Then

        await controller.analyzeStaticallyHeuristics(exampleRepository, languages[0]).then((result) => {

            // console.log(JSON.stringify(result));

            // When Then
            expect(JSON.stringify(result).includes('location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L0C0-L0C0"')).toBe(true);
        });
    });

    it('analyzes statically a repository with NLP', async () => {

        // Given

        let controller = new Controller();

        // When Then

        await controller.analyzeStaticallyNLP(exampleRepository, languages[0]).then((result) => {

            // console.log(JSON.stringify(result));

            // When Then
            expect(JSON.stringify(result).includes('https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/"')).toBe(true);
        });
    });
});

// Failure cases test suite

describe('Controller tries to', () => {

    it('analyzes statically a not found repository', async () => {

        // Given

        let controller = new Controller();

        // When Then

        await expect(controller.analyzeStatically("unknownRepository", languages[0])).rejects.toThrow(DownloadFail);
    });

    it('analyzes statically an undefined repository', async () => {

        // Given

        let controller = new Controller();
        let repository = undefined;

        // When Then

        await expect(controller.analyzeStatically(repository, languages[0])).rejects.toThrow(BadFormat);
    });

    it('analyzes statically a null repository', async () => {

        // Given

        let controller = new Controller();
        let repository = null;

        // When Then

        await expect(controller.analyzeStatically(repository, languages[0])).rejects.toThrow(BadFormat);
    });

    it('analyzes statically an non-existent repository', async () => {

        // Given

        let controller = new Controller();
        let repository = '';

        // When Then

        await expect(controller.analyzeStatically(repository, languages[0])).rejects.toThrow(BadFormat);
    });

    it('analyzes statically an empty repository', async () => {

        // Given

        let controller = new Controller();
        let repository = process.cwd() + FILE_SYSTEM_SEPARATOR + 'test' + FILE_SYSTEM_SEPARATOR + 'unit' + FILE_SYSTEM_SEPARATOR + 'asset' + FILE_SYSTEM_SEPARATOR + 'empty.zip';

        // When Then

        await expect(controller.analyzeStatically(repository, languages[0])).rejects.toThrow(BadFormat);
    });

    it('analyzes statically a repository with an undefined language', async () => {

        // Given

        let controller = new Controller();

        // When Then

        await expect(controller.analyzeStatically(exampleRepository, undefined)).rejects.toThrow(BadFormat);
    });

    it('analyzes statically a repository list with a null language', async () => {

        // Given

        let controller = new Controller();

        // When Then

        await expect(controller.analyzeStatically(exampleRepository, null)).rejects.toThrow(BadFormat);
    });

    it('analyzes statically a repository list with an empty language', async () => {

        // Given

        let controller = new Controller();

        // When Then

        await expect(controller.analyzeStatically(exampleRepository, '')).rejects.toThrow(BadFormat);
    });

    it('analyzes statically a repository list with unknown language', async () => {

        // Given

        let controller = new Controller();

        // When Then

        await expect(controller.analyzeStatically(exampleRepository, 'unknownLanguage')).rejects.toThrow(BadFormat);
    });
});