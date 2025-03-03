// Helpers

const StaticAnalyzerNLP = require('../../helper/StaticAnalyzerNLP.helper.js');

// Constants

const {FILE_SYSTEM_SEPARATOR, LANGUAGES_RESERVED_KEYWORDS} = require('../../helper/Constant.helper');

// Libraries

const fs = require('fs');
const StaticAnalyzerCodeQL = require("../../helper/StaticAnalyzerCodeQL.helper");

// Setup

const repositoryList = ['example', 'example-codeql', 'unknown-codeql'];
const languages = ['javascript'];

// Example of JS code

const jsCode = `
    const db = require("./database");

    function fetchOrders(userId) {
        return db.query(\`SELECT * FROM orders WHERE user_id = \${userId}\`);
    }

    class OrderService {
        createOrder(order) {
            console.log("Creating order:", order);
            return db.insert("orders", order);
        }
    }

    module.exports = { fetchOrders, OrderService };
`;

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

    let staticAnalyzerNLP;

    beforeEach(() => {
        // Preparing.
        fs.mkdirSync(process.cwd() + FILE_SYSTEM_SEPARATOR + 'TEMP' + FILE_SYSTEM_SEPARATOR + repositoryList[0]);
        fs.copyFileSync(process.cwd() + FILE_SYSTEM_SEPARATOR + 'test' + FILE_SYSTEM_SEPARATOR + 'unit' + FILE_SYSTEM_SEPARATOR + 'asset' + FILE_SYSTEM_SEPARATOR + 'index.example.js', process.cwd() + FILE_SYSTEM_SEPARATOR + 'TEMP' + FILE_SYSTEM_SEPARATOR + repositoryList[0] + FILE_SYSTEM_SEPARATOR + 'example.js');

        staticAnalyzerNLP = new StaticAnalyzerNLP();
    });

    afterEach(async () => {
        await clean();
    });

    it("should extract raw concepts from text", () => {
        const concepts = staticAnalyzerNLP.extractRawConcepts(jsCode);
        console.log(concepts)
        expect(concepts).toEqual(expect.arrayContaining(["db", "require", "fetchOrders", "userId", "OrderService", "createOrder", "console", "log", "order"]));
    });

    it("should remove single-character concepts", () => {
        const concepts = ["a", "hello", "b", "world"];
        expect(staticAnalyzerNLP.filterNoisyConcepts(concepts)).toEqual(["hello", "world"]);
    });

    it("should remove stop words", () => {
        const concepts = ["hello", "the", "world", "and", "great"];
        expect(staticAnalyzerNLP.removeStopWords(concepts)).toEqual(["hello", "world", "great"]);
    });

    it("should handle multi-word concepts in removeStopWords", () => {
        const concepts = ["hello world", "is amazing", "great", "nice to meet you"];
        expect(staticAnalyzerNLP.removeStopWords(concepts)).toEqual(["hello world", "amazing", "great", "nice meet"]);
    });

    it('should remove reserved keywords based on file type', () => {
        jest.spyOn(staticAnalyzerNLP, 'getFileExtension').mockReturnValue("js");
        const concepts = ["function", "hello", "var", "world"];
        const result = staticAnalyzerNLP.removeReservedKeywords("test.js", concepts);
        expect(result).toEqual(["hello", "world"]);
    });

    it('should split kebab-case, snake_case, CamelCase, and PascalCase into individual words', () => {
        const concepts = ["helloWorld", "my-variable", "some_function", "BigClassName"];
        const result = staticAnalyzerNLP.separateMultipleWordsConcepts(concepts);
        expect(result).toEqual(["hello world", "my variable", "some function", "big class name"]);
    });

    it('should lemmatize plural and derived words', () => {
        const concepts = ["cars", "libraries", "hello"];
        const result = staticAnalyzerNLP.lemmatizeConcepts(concepts);
        expect(result).toEqual(["car", "library", "hello"]);
    });

    it('should return the same words if they are already in base form', () => {
        const concepts = ["computer", "world"];
        const result = staticAnalyzerNLP.lemmatizeConcepts(concepts);
        expect(result).toEqual(["computer", "world"]);
    });

    it('should keep concepts that contain at least one dictionary word', () => {
        const concepts = ["hello world", "xyz abc", "great day"];
        const result = staticAnalyzerNLP.filterByDictionaryType(concepts);
        expect(result).toEqual(["hello world", "great day"]);
    });

    it('should remove concepts with no dictionary words', () => {
        const concepts = ["xyz abc", "notarealword", "car"];
        const result = staticAnalyzerNLP.filterByDictionaryType(concepts);
        expect(result).toEqual(["car"]);
    });

    it('should count the occurrences of each word in the concepts list', () => {
        const concepts = ["hello world", "hello", "great world"];
        const result = staticAnalyzerNLP.getConceptsOccurences(concepts);
        expect(result).toEqual({ "hello": 2, "world": 2, "great": 1 });
    });

    it('should return an empty object for an empty concepts list', () => {
        const result = staticAnalyzerNLP.getConceptsOccurences([]);
        expect(result).toEqual({});
    });

    // TODO
    // it('should refine concepts by keeping only the most relevant ones', () => {
    //     const sortedResults = [
    //         { file: 'file1', tokens: { concept1: 3, concept2: 2 } },
    //         { file: 'file2', tokens: { concept2: 5, concept3: 1 } }
    //     ];
    //
    //     const bestConceptsSorted = [
    //         { concept: 'concept1' },
    //         { concept: 'concept2' }
    //     ];
    //
    //     // Mocker la méthode filterAndSortBestConcepts
    //     staticAnalyzerNLP.filterAndSortBestConcepts.mockReturnValue(bestConceptsSorted);
    //
    //     const refinedResults = staticAnalyzerNLP.refineResultsByKeepingMostPertinentConceptsOnly(sortedResults);
    //
    //     expect(refinedResults).toEqual([
    //         { file: 'file1', tokens: { concept1: 3, concept2: 2 } },
    //         { file: 'file2', tokens: { concept2: 5 } }
    //     ]);
    // });

    it('should correctly organize concepts with their occurrences and files', () => {
        const sortedResults = [
            { file: 'file1', tokens: { conceptA: 3, conceptB: 2 } },
            { file: 'file2', tokens: { conceptB: 5, conceptC: 1 } }
        ];

        const concepts = staticAnalyzerNLP.getConceptsWithFilesAndOccurences(sortedResults);

        expect(concepts).toEqual({
            conceptA: [{ sourceFile: 'file1', nbOccurence: 3 }],
            conceptB: [{ sourceFile: 'file1', nbOccurence: 2 }, { sourceFile: 'file2', nbOccurence: 5 }],
            conceptC: [{ sourceFile: 'file2', nbOccurence: 1 }]
        });
    });

    it('should build a correct directory tree with files and code fragments', () => {
        const extractionResults = [
            { file: 'repo\\TEMP\\file1.js', fileNumberOfLinesOfCode: 10, tokens: { token1: 1, token2: 2 }, repository: "repo" },
            { file: 'repo\\TEMP\\dir1\\file2.js', fileNumberOfLinesOfCode: 20, tokens: { token3: 3 }, repository: "repo" }
        ];

        const result = staticAnalyzerNLP.buildDirectoryTreeWithFilesAndCodeFragments(extractionResults);
        expect(result).toHaveProperty('directories');
        expect(result.directories.length).toBeGreaterThan(0);
        expect(result.directories[0].files[0].location).toBe('file1.js');
        expect(result.directories[0].files[0].codeFragments[0].concepts.length).toBe(2);
        expect(result.directories[1].files[0].location).toBe('dir1/file2.js');
        expect(result.directories[1].files[0].codeFragments[0].concepts.length).toBe(1);
    });

    it('should return true for supported file types', () => {
        expect(staticAnalyzerNLP.fileIsSupportedForNLPAnalysis('file.js')).toBe(true);
        expect(staticAnalyzerNLP.fileIsSupportedForNLPAnalysis('file.mjs')).toBe(true);
        expect(staticAnalyzerNLP.fileIsSupportedForNLPAnalysis('file.cjs')).toBe(true);
    });

    it('should return false for unsupported file types', () => {
        expect(staticAnalyzerNLP.fileIsSupportedForNLPAnalysis('file.txt')).toBe(false);
        expect(staticAnalyzerNLP.fileIsSupportedForNLPAnalysis('file.html')).toBe(false);
    });

    it('should return the correct file extension', () => {
        expect(staticAnalyzerNLP.getFileExtension('file.js')).toBe('js');
        expect(staticAnalyzerNLP.getFileExtension('file.java')).toBe('java');
        expect(staticAnalyzerNLP.getFileExtension('file.txt')).toBe('txt');
    });

    it('should return an empty string if there is no extension', () => {
        expect(staticAnalyzerNLP.getFileExtension('file')).toBe('');
    });

    it('should return the correct number of lines of code for supported file types', () => {
        const lines = staticAnalyzerNLP.getFileNumberOfLinesOfCode(jsCode, "js");
        expect(lines).toBe(11);
    });

});