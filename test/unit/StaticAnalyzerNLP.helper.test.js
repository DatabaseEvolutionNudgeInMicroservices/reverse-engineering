// Helpers

const StaticAnalyzerNLP = require('../../helper/StaticAnalyzerNLP.helper.js');

// Constants

const {FILE_SYSTEM_SEPARATOR} = require('../../helper/Constant.helper');

// Libraries

const fs = require('fs');

// Setup

const repositoryList = ['example-microservice'];
const languages = ['javascript'];

// Example of JS code

const exampleJsCode = `
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
        fs.copyFileSync(process.cwd() + FILE_SYSTEM_SEPARATOR + 'test' + FILE_SYSTEM_SEPARATOR + 'unit' + FILE_SYSTEM_SEPARATOR + 'asset' + FILE_SYSTEM_SEPARATOR + "example-microservice" + FILE_SYSTEM_SEPARATOR + 'config.js', process.cwd() + FILE_SYSTEM_SEPARATOR + 'TEMP' + FILE_SYSTEM_SEPARATOR + repositoryList[0] + FILE_SYSTEM_SEPARATOR + 'config.js');
        fs.copyFileSync(process.cwd() + FILE_SYSTEM_SEPARATOR + 'test' + FILE_SYSTEM_SEPARATOR + 'unit' + FILE_SYSTEM_SEPARATOR + 'asset' + FILE_SYSTEM_SEPARATOR + "example-microservice" + FILE_SYSTEM_SEPARATOR + 'model.js', process.cwd() + FILE_SYSTEM_SEPARATOR + 'TEMP' + FILE_SYSTEM_SEPARATOR + repositoryList[0] + FILE_SYSTEM_SEPARATOR + 'model.js');
        fs.copyFileSync(process.cwd() + FILE_SYSTEM_SEPARATOR + 'test' + FILE_SYSTEM_SEPARATOR + 'unit' + FILE_SYSTEM_SEPARATOR + 'asset' + FILE_SYSTEM_SEPARATOR + "example-microservice" + FILE_SYSTEM_SEPARATOR + 'routes.js', process.cwd() + FILE_SYSTEM_SEPARATOR + 'TEMP' + FILE_SYSTEM_SEPARATOR + repositoryList[0] + FILE_SYSTEM_SEPARATOR + 'routes.js');
        fs.copyFileSync(process.cwd() + FILE_SYSTEM_SEPARATOR + 'test' + FILE_SYSTEM_SEPARATOR + 'unit' + FILE_SYSTEM_SEPARATOR + 'asset' + FILE_SYSTEM_SEPARATOR + "example-microservice" + FILE_SYSTEM_SEPARATOR + 'server.js', process.cwd() + FILE_SYSTEM_SEPARATOR + 'TEMP' + FILE_SYSTEM_SEPARATOR + repositoryList[0] + FILE_SYSTEM_SEPARATOR + 'server.js');

        staticAnalyzerNLP = new StaticAnalyzerNLP();
    });

    afterEach(async () => {
        await clean();
    });

    it("should extract raw concepts from text", () => {
        const concepts = staticAnalyzerNLP.extractRawConcepts(exampleJsCode);
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
        const result = staticAnalyzerNLP.removeReservedKeywords(concepts, "test.js");
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

    it('should count the occurrences of each word in the concepts list', () => {
        const concepts = ["hello world", "hello", "great world"];
        const result = staticAnalyzerNLP.getConceptsDetails(concepts);
        expect(result).toEqual({
            "hello": {numberOfOccurence: 2},
            "world": {numberOfOccurence: 2},
            "great": {numberOfOccurence: 1}
        });
    });

    it('should return an empty object for an empty concepts list', () => {
        const result = staticAnalyzerNLP.getConceptsDetails([]);
        expect(result).toEqual({});
    });

    it('should refine concepts by keeping only the most relevant ones', () => {

        const sortedResults = [
            {
                repository: 'example',
                file: 'C:\\Users\\user\\reverse-engineering-text-retrieval\\TEMP\\example-microservice\\config.js',
                tokens: {process: 1, dialect: 1, logging: 1, module: 1, export: 1},
                fileNumberOfLinesOfCode: 7
            },
            {
                repository: 'example',
                file: 'C:\\Users\\user\\reverse-engineering-text-retrieval\\TEMP\\example-microservice\\model.js',
                tokens: {
                    datum: 9,
                    type: 9,
                    movie: 7,
                    define: 4,
                    title: 1,
                    string: 4,
                    allow: 7,
                    null: 7,
                    duration: 1,
                    integer: 2,
                    en: 1,
                    minute: 1,
                    cinema: 5,
                    name: 1,
                    location: 1,
                    seat: 7,
                    row: 1,
                    number: 1,
                    ticket: 5,
                    price: 1,
                    float: 1,
                    status: 1,
                    available: 2,
                    booked: 1,
                    sold: 1,
                    default: 1,
                    value: 1,
                    relation: 1,
                    belongs: 3,
                    one: 1,
                    module: 1,
                    export: 1
                },
                fileNumberOfLinesOfCode: 25
            },
            {
                repository: 'example',
                file: 'C:\\Users\\user\\reverse-engineering-text-retrieval\\TEMP\\example-microservice\\routes.js',
                tokens: {
                    express: 3,
                    movie: 10,
                    cinema: 10,
                    seat: 10,
                    ticket: 10,
                    model: 1,
                    router: 11,
                    crud: 4,
                    res: 16,
                    find: 4,
                    post: 4,
                    create: 4,
                    body: 4,
                    module: 1,
                    export: 1
                },
                fileNumberOfLinesOfCode: 36
            },
            {
                repository: 'example',
                file: 'C:\\Users\\user\\reverse-engineering-text-retrieval\\TEMP\\example-microservice\\server.js',
                tokens: {
                    express: 4,
                    route: 3,
                    db: 2,
                    model: 1,
                    use: 2,
                    port: 5,
                    process: 1,
                    console: 3,
                    log: 2,
                    database: 2,
                    synced: 1,
                    listen: 1,
                    server: 1,
                    running: 1,
                    err: 2,
                    error: 2,
                    syncing: 1
                },
                fileNumberOfLinesOfCode: 13
            }
        ];

        const bestConceptsSorted = staticAnalyzerNLP.filterAndSortBestConcepts(sortedResults);
        const bestConceptsSortedNameOnly = bestConceptsSorted.map(x => x.concept);

        expect(bestConceptsSortedNameOnly.indexOf("cinema") > 0 && bestConceptsSortedNameOnly.indexOf("cinema") < 6);
        expect(bestConceptsSortedNameOnly.indexOf("ticket") > 0 && bestConceptsSortedNameOnly.indexOf("ticket") < 6);
        expect(bestConceptsSortedNameOnly.indexOf("movie") > 0 && bestConceptsSortedNameOnly.indexOf("movie") < 6);
        expect(bestConceptsSortedNameOnly.indexOf("seat") > 0 && bestConceptsSortedNameOnly.indexOf("seat") < 6);
    });

    it('should correctly organize concepts with their occurrences and files', () => {
        const sortedResults = [
            {file: 'file1', tokens: {conceptA: {numberOfOccurence: 3}, conceptB: {numberOfOccurence: 2}}},
            {file: 'file2', tokens: {conceptB: {numberOfOccurence: 5}, conceptC: {numberOfOccurence: 1}}}
        ];

        const concepts = staticAnalyzerNLP.getConceptsWithFilesAndOccurences(sortedResults);

        expect(concepts).toEqual({
            conceptA: [{sourceFile: 'file1', nbOccurence: 3}],
            conceptB: [{sourceFile: 'file1', nbOccurence: 2}, {sourceFile: 'file2', nbOccurence: 5}],
            conceptC: [{sourceFile: 'file2', nbOccurence: 1}]
        });
    });

    it('should build a correct directory tree with files and code fragments', () => {
        const extractionResults = [
            {
                file: 'C:\\Home\\TEMP\\repo\\file1.js',
                fileNumberOfLinesOfCode: 10,
                tokens: {user: {numberOfOccurence: 8, lines: [9,16,1,4,7,32,42,54]}, admin: {numberOfOccurence: 2, lines: [4, 9]}},
                repository: "repo",
                cluster: 1
            },
            {
                file: 'C:\\Home\\TEMP\\repo\\dir1\\file2.js',
                fileNumberOfLinesOfCode: 20,
                tokens: {user: {numberOfOccurence: 3, lines: [5,1,9]}},
                repository: "repo",
                cluster: 1
            }
        ];

        const result = staticAnalyzerNLP.buildDirectoryTreeWithFilesAndCodeFragments(extractionResults);
        console.log(JSON.stringify(result))
        expect(result).toHaveProperty('directories');
        expect(result.directories.length).toBeGreaterThan(0);
        expect(result.directories[0].files[0].location).toBe('repo/file1.js');
        expect(result.directories[0].files[0].codeFragments[0].concepts.length).toBe(2);
        expect(result.directories[0].directories[0].files[0].location).toBe('repo/dir1/file2.js');
        expect(result.directories[0].directories[0].files[0].codeFragments[0].concepts.length).toBe(1);
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
        const lines = staticAnalyzerNLP.getFileNumberOfLinesOfCode(exampleJsCode, "js");
        expect(lines).toBe(11);
    });

});




describe('DB-related tagging methods', () => {
    let staticAnalyzerNLP;

    beforeEach(() => {
        staticAnalyzerNLP = new StaticAnalyzerNLP();
    });

    describe('tagFilesFullyAutomated', () => {
        it('should call tagFiles with correct parameters and return its result', () => {
            const spy = jest.spyOn(staticAnalyzerNLP, 'tagFiles').mockReturnValue('result');
            const element = 'repo';
            const refinedResults = [{tokens: {movie: {numberOfOccurence: 2}}, fileNumberOfLinesOfCode: 10, file: 'file.js'}];
            const bestConcepts = [{concept: 'movie'}, {concept: 'cinema'}];
            const result = staticAnalyzerNLP.tagFilesFullyAutomated(element, refinedResults, bestConcepts);
            expect(spy).toHaveBeenCalledWith(
                element,
                refinedResults,
                {data_concepts: ['movie', 'cinema']},
                "fully_automated"
            );
            expect(result).toBe('result');
        });

        it('should slice bestConcepts to 30 elements', () => {
            const spy = jest.spyOn(staticAnalyzerNLP, 'tagFiles');
            const bestConcepts = Array.from({length: 40}, (_, i) => ({concept: `c${i}`}));
            staticAnalyzerNLP.tagFilesFullyAutomated('repo', [], bestConcepts);
            expect(spy.mock.calls[0][2].data_concepts.length).toBe(30);
        });
    });

    describe('tagFilesSemiAutomated', () => {
        it('should call tagFiles with correct mode when anchor_points are present', () => {
            const spy = jest.spyOn(staticAnalyzerNLP, 'tagFiles');
            const dbDetails = {data_concepts: ['movie'], anchor_points: ['id']};
            staticAnalyzerNLP.tagFilesSemiAutomated('repo', [], dbDetails);
            expect(spy).toHaveBeenCalledWith(
                'repo',
                [],
                dbDetails,
                "semi_automated_with_anchors"
            );
        });

        it('should call tagFiles with correct mode when anchor_points are absent', () => {
            const spy = jest.spyOn(staticAnalyzerNLP, 'tagFiles');
            const dbDetails = {data_concepts: ['movie']};
            staticAnalyzerNLP.tagFilesSemiAutomated('repo', [], dbDetails);
            expect(spy).toHaveBeenCalledWith(
                'repo',
                [],
                dbDetails,
                "semi_automated_without_anchors"
            );
        });
    });

    describe('tagFiles', () => {
        it('should call tagFilesByClusteringWithHeuristics and return its result', () => {
            const spy = jest.spyOn(staticAnalyzerNLP, 'tagFilesByClusteringWithHeuristics').mockReturnValue('tagged');
            const result = staticAnalyzerNLP.tagFiles('repo', [{}, {}], {data_concepts: ['a']}, 'mode');
            expect(spy).toHaveBeenCalledWith([{}, {}], {data_concepts: ['a']});
            expect(result).toBe('tagged');
        });
    });

    describe('tagFilesByClusteringWithHeuristics', () => {
        it('should tag files as DB-related (cluster=1) if density >= threshold', () => {
            const refinedResults = [
                {
                    tokens: {movie: {numberOfOccurence: 4}, user: {numberOfOccurence: 5}},
                    fileNumberOfLinesOfCode: 10,
                    file: 'file1.js'
                }
            ];
            const dbDetails = {data_concepts: ['movie']};
            const result = staticAnalyzerNLP.tagFilesByClusteringWithHeuristics(refinedResults, dbDetails);
            expect(result[0].cluster).toBe(1);
        });

        it('should tag files as not DB-related (cluster=0) if density < threshold', () => {
            const refinedResults = [
                {
                    tokens: {movie: {numberOfOccurence: 1}, user: {numberOfOccurence: 5}},
                    fileNumberOfLinesOfCode: 10,
                    file: 'file1.js'
                }
            ];
            const dbDetails = {data_concepts: ['movie']};
            const result = staticAnalyzerNLP.tagFilesByClusteringWithHeuristics(refinedResults, dbDetails);
            expect(result[0].cluster).toBe(0);
        });

        it('should require anchor_points if present and density >= threshold', () => {
            const refinedResults = [
                {
                    tokens: {movie: {numberOfOccurence: 3}, id: {numberOfOccurence: 1}},
                    fileNumberOfLinesOfCode: 10,
                    file: 'file1.js'
                }
            ];
            const dbDetails = {data_concepts: ['movie'], anchor_points: ['id']};
            const result = staticAnalyzerNLP.tagFilesByClusteringWithHeuristics(refinedResults, dbDetails);
            expect(result[0].cluster).toBe(1);
        });

        it('should not tag as DB-related if anchor_points missing in tokens', () => {
            const refinedResults = [
                {
                    tokens: {movie: {numberOfOccurence: 3}},
                    fileNumberOfLinesOfCode: 10,
                    file: 'file1.js'
                }
            ];
            const dbDetails = {data_concepts: ['movie'], anchor_points: ['id']};
            const result = staticAnalyzerNLP.tagFilesByClusteringWithHeuristics(refinedResults, dbDetails);
            expect(result[0].cluster).toBe(0);
        });

        it('should tag files with no tokens or code as cluster=0', () => {
            const refinedResults = [
                {
                    tokens: {},
                    fileNumberOfLinesOfCode: 0,
                    file: 'file2.js'
                }
            ];
            const dbDetails = {data_concepts: ['movie']};
            const result = staticAnalyzerNLP.tagFilesByClusteringWithHeuristics(refinedResults, dbDetails);
            expect(result[0].cluster).toBe(0);
        });

        it('should handle multiple files and return correct clusters', () => {
            const refinedResults = [
                {
                    tokens: {movie: {numberOfOccurence: 4}},
                    fileNumberOfLinesOfCode: 10,
                    file: 'file1.js'
                },
                {
                    tokens: {},
                    fileNumberOfLinesOfCode: 0,
                    file: 'file2.js'
                }
            ];
            const dbDetails = {data_concepts: ['movie']};
            const result = staticAnalyzerNLP.tagFilesByClusteringWithHeuristics(refinedResults, dbDetails);
            expect(result[0].cluster).toBe(1);
            expect(result[1].cluster).toBe(0);
        });
    });
});;