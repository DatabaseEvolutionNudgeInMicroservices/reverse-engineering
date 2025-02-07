// Helpers

const StaticAnalyzerNLP = require('../../helper/StaticAnalyzerNLP.helper.js');

// Constants

const {FILE_SYSTEM_SEPARATOR} = require('../../helper/Constant.helper');

// Libraries

const fs = require('fs');

// Setup

const repositoryList = ['example', 'example-codeql', 'unknown-codeql'];
const languages = ['javascript'];

async function clean() {
    // Cleaning.

    for (let i = 0; i < repositoryList.length; i++) {
        if (fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + 'TEMP' + FILE_SYSTEM_SEPARATOR + repositoryList[i])) {
            await fs.rmdirSync(process.cwd() + FILE_SYSTEM_SEPARATOR + 'TEMP' + FILE_SYSTEM_SEPARATOR + repositoryList[i], {recursive: true});
        }
    }
}

// Happy path test suite

describe('NLP static analyzer', () => {

    beforeEach(() => {
        // Preparing.
        fs.mkdirSync(process.cwd() + FILE_SYSTEM_SEPARATOR + 'TEMP' + FILE_SYSTEM_SEPARATOR + repositoryList[0]);
        fs.copyFileSync(process.cwd() + FILE_SYSTEM_SEPARATOR + 'test' + FILE_SYSTEM_SEPARATOR + 'unit' + FILE_SYSTEM_SEPARATOR + 'asset' + FILE_SYSTEM_SEPARATOR + 'index.example.js', process.cwd() + FILE_SYSTEM_SEPARATOR + 'TEMP' + FILE_SYSTEM_SEPARATOR + repositoryList[0] + FILE_SYSTEM_SEPARATOR + 'example.js');
        // fs.copyFileSync(process.cwd() + FILE_SYSTEM_SEPARATOR + 'test' + FILE_SYSTEM_SEPARATOR + 'unit' + FILE_SYSTEM_SEPARATOR + 'asset' + FILE_SYSTEM_SEPARATOR + 'examples' + FILE_SYSTEM_SEPARATOR + 'example2.js', process.cwd() + FILE_SYSTEM_SEPARATOR + 'TEMP' + FILE_SYSTEM_SEPARATOR + repositoryList[0] + FILE_SYSTEM_SEPARATOR + 'example2.js');
        // fs.copyFileSync(process.cwd() + FILE_SYSTEM_SEPARATOR + 'test' + FILE_SYSTEM_SEPARATOR + 'unit' + FILE_SYSTEM_SEPARATOR + 'asset' + FILE_SYSTEM_SEPARATOR + 'examples' + FILE_SYSTEM_SEPARATOR + 'example3.js', process.cwd() + FILE_SYSTEM_SEPARATOR + 'TEMP' + FILE_SYSTEM_SEPARATOR + repositoryList[0] + FILE_SYSTEM_SEPARATOR + 'example3.js');
        // fs.copyFileSync(process.cwd() + FILE_SYSTEM_SEPARATOR + 'test' + FILE_SYSTEM_SEPARATOR + 'unit' + FILE_SYSTEM_SEPARATOR + 'asset' + FILE_SYSTEM_SEPARATOR + 'examples' + FILE_SYSTEM_SEPARATOR + 'example4.js', process.cwd() + FILE_SYSTEM_SEPARATOR + 'TEMP' + FILE_SYSTEM_SEPARATOR + repositoryList[0] + FILE_SYSTEM_SEPARATOR + 'example4.js');
        // fs.copyFileSync(process.cwd() + FILE_SYSTEM_SEPARATOR + 'test' + FILE_SYSTEM_SEPARATOR + 'unit' + FILE_SYSTEM_SEPARATOR + 'asset' + FILE_SYSTEM_SEPARATOR + 'examples' + FILE_SYSTEM_SEPARATOR + 'example5.java', process.cwd() + FILE_SYSTEM_SEPARATOR + 'TEMP' + FILE_SYSTEM_SEPARATOR + repositoryList[0] + FILE_SYSTEM_SEPARATOR + 'example5.java');
        // fs.copyFileSync(process.cwd() + FILE_SYSTEM_SEPARATOR + 'test' + FILE_SYSTEM_SEPARATOR + 'unit' + FILE_SYSTEM_SEPARATOR + 'asset' + FILE_SYSTEM_SEPARATOR + 'examples' + FILE_SYSTEM_SEPARATOR + 'example6.js', process.cwd() + FILE_SYSTEM_SEPARATOR + 'TEMP' + FILE_SYSTEM_SEPARATOR + repositoryList[0] + FILE_SYSTEM_SEPARATOR + 'example6.js');
    });

    afterEach(async () => {
        await clean();
    });

    // TODO
    it('identifies a NLP static analysis by repository', async () => {

        // Given

        let staticAnalyzerNLP = new StaticAnalyzerNLP();

        // When Then
        await staticAnalyzerNLP.extractByElement(repositoryList[0], languages[0]).then((result) => {
            // console.log(result)
            result.forEach(x => {
                console.log(x.file);

                const sortedTokens = x.tokens.sort((a, b) => b.score - a.score);
                console.log(sortedTokens);
            })
            // expect(result).toBe(true);
        });
    });
});