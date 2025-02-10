// Constants

const {
    FILE_SYSTEM_SEPARATOR,
    TEMP_FOLDER_NAME,
} = require('./Constant.helper.js');

const FILE_EXTENSIONS_SUPPORTED_FOR_NLP_ANALYSIS = ["js"];

// Error

const BadFormat = require('../error/BadFormat.error.js');
const AnalysisFail = require('../error/AnalysisFail.error.js');
const {INPUT_INCORRECTLY_FORMATTED} = require('../error/Constant.error.js');

// Helpers

const StaticAnalyzer = require('./StaticAnalyzer.helper.js');

// Libraries : File System

const fs = require('fs');

// Libraries : sloc

const sloc = require('sloc');

// Libraries : Wink

const winkNLP = require('wink-nlp');
const model = require('wink-eng-lite-web-model');
const winkNLPLemmatizer = require('wink-lemmatizer');

// Libraries : Natural

const natural = require('natural');

// Libraries : Typo-js

const Typo = require("typo-js");
const dictionary = new Typo("en_US");

// Configuration : Wink

const nlp = winkNLP(model);
const patterns = [{name: 'concept', patterns: ['NOUN', 'PROPN']}]; // Concepts are usually represented as nouns or proper nouns.
nlp.learnCustomEntities(patterns);

// Configuration : Natural

const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

// Languages reserved keywords

const languagesReservedKeywords = require('./languages_reserved_keywords');

/**
 * @overview This class represents the CodeQL static analyzer.
 */
class StaticAnalyzerNLP extends StaticAnalyzer {

    /**
     * Instantiates a NLP static analyzer.
     */
    constructor() {
        super();
    }

    /**
     * Initializes an analysis by list.
     * @param list {[String]} The given list.
     * @param language {String} The targeted language by the analysis.
     * @returns {Promise} A promise for the preparation.
     */
    initializesByList(list, language) {
        return new Promise((resolveAll, rejectAll) => {
            rejectAll(new Error("Not implemented"))
        })
    }

    /**
     * Initializes an analysis by element.
     * @param element {String} The given element.
     * @param language {String} The targeted language by the analysis.
     * @returns {Promise} A promise for the preparation.
     */
    initializesByElement(element, language) {
        return new Promise((resolveAll, rejectAll) => {
            rejectAll(new Error("Not implemented"))
        })
    }

    /**
     * Performs an identification analysis by list.
     * @param list {[String]} The given list.
     * @param language {String} The targeted language by the analysis.
     * @returns {Promise} A promise for the analysis.
     */
    identifyByList(list, language) {
        return new Promise((resolveAll, rejectAll) => {
            rejectAll(new Error("Not implemented"))
        })
    }

    /**
     * Performs an identification analysis by element.
     * @param element {String} The given element.
     * @param language {String} The targeted language by the analysis.
     * @returns {Promise} A promise for the analysis.
     */
    identifyByElement(element, language) {
        return new Promise((resolveAll, rejectAll) => {
            rejectAll(new Error("Not implemented"))
        })
    }

    /**
     * Interprets an analysis by list.
     * @param list {[String]} The given list.
     * @param language {String} The targeted language by the analysis.
     * @returns {Promise} A promise for the interpretation.
     */
    interpretByList(list, language) {
        return new Promise((resolveAll, rejectAll) => {
            rejectAll(new Error("Not implemented"))
        })
    }

    /**
     * Extracts an analysis by list.
     * @param list {[String]} The given list.
     * @param language {String} The targeted language by the analysis.
     * @returns {Promise} A promise for the extraction.
     */
    extractByList(list, language) {
        return new Promise((resolveAll, rejectAll) => {
            if (list !== undefined && list !== null && list.length !== 0) {
                let promises = [];
                list.forEach(element => {
                    promises.push(new Promise((resolve, reject) => {
                        this.extractByElement(element, language).then(result => {
                            resolve(result);
                        }).catch(error => {
                            reject(error);
                        });
                    }));
                });
                Promise.all(promises).then(resultsAll => {
                    resolveAll(resultsAll);
                }).catch(errorAll => {
                    rejectAll(errorAll);
                });
            } else {
                rejectAll(new BadFormat(INPUT_INCORRECTLY_FORMATTED));
            }
        });
    }

    /**
     * Extracts an analysis by element.
     * @param element {String} The given element.
     * @param language {String} The targeted language by the analysis.
     * @returns {Promise} A promise for the extraction.
     */
    extractByElement(element, language) {
        return new Promise((resolve, reject) => {
            if (!(element && element.length > 0 && language && language !== '')) {
                return reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED));
            }

            try {
                const repositoryFolder = this.getRepositoryFolder(element);
                const repositoryName = this.getRepositoryName(element);
                const analysisResults = [];

                // Recursive function to explore directories
                const exploreDirectory = (currentPath) => {
                    const items = fs.readdirSync(currentPath);

                    items.forEach(item => {
                        const itemPath = `${currentPath}${FILE_SYSTEM_SEPARATOR}${item}`;
                        const stats = fs.statSync(itemPath);

                        if (stats.isDirectory()) {
                            // If it's a directory, explore recursively
                            exploreDirectory(itemPath);
                        } else if (stats.isFile() && this.fileExtensionSupportedForAnalysis(itemPath)) {
                            // If it's a file, perform the analysis
                            const fileContent = fs.readFileSync(itemPath, 'utf8');
                            const fileConcepts = this.extractConceptsFromFile(item, fileContent);
                            const location = `${itemPath}#L0C0-L0C0`;

                            const fileExtension = this.getFileExtension(itemPath);
                            const fileNumberOfLinesOfCode = this.getFileNumberOfLinesOfCode(fileContent, fileExtension);

                            analysisResults.push({
                                type: null,
                                repository: repositoryName,
                                file: itemPath,
                                location: location,
                                operation: null,
                                method: null,
                                sample: null,
                                tokens: fileConcepts,
                                fileNumberOfLinesOfCode: fileNumberOfLinesOfCode
                            });
                        }
                    });
                };

                // Start exploration from the root folder
                exploreDirectory(repositoryFolder);

                // Sort and filter by TF-IDF
                const sortedResults = this.sortAndFilterByTfIdfScores(analysisResults);

                console.dir(this.getTopConcepts(sortedResults), {'maxArrayLength': null});

                resolve(sortedResults);

            } catch (error) {
                console.log(error);
                reject(new AnalysisFail(error.message));
            }
        });
    }

    /**
     * Extracts and processes concepts from a given file content.
     * The function filters, normalizes, and refines the concepts before returning them.
     *
     * @param fileName {String} The name of the file from which concepts are extracted.
     * @param fileContent {String} The content of the file.
     * @returns {Array} An array of processed concepts after filtering and normalization.
     */
    extractConceptsFromFile(fileName, fileContent) {
        // Filtering
        let concepts = this.extractRawConcepts(fileContent);
        concepts = this.filterNoisyConcepts(concepts);
        concepts = this.removeReservedKeywords(fileName, concepts);
        concepts = this.removeDuplicates(concepts);

        // Normalizing
        concepts = this.separateMultipleWordsConcepts(concepts);
        concepts = this.lemmatizeConcepts(concepts);

        // Filtering
        concepts = this.filterByDictionaryType(concepts);

        return concepts;
    }

    /**
     * Extracts raw concepts from the given text using a regular expression.
     * The function identifies alphanumeric words, including those starting with underscores.
     *
     * @param text {String} The input text from which raw concepts are extracted.
     * @returns {Array} An array of raw concepts found in the text.
     */
    extractRawConcepts(text) {
        const RAW_CONCEPTS_REGEX = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;
        return text.match(RAW_CONCEPTS_REGEX) || [];
    }

    /**
     * Filters out noisy concepts that are too short to be meaningful.
     * Concepts with a length greater than 1 are considered valid.
     *
     * @param concepts {Array} The array of concepts to be filtered.
     * @returns {Array} A filtered array containing only meaningful concepts.
     */
    filterNoisyConcepts(concepts) {
        return concepts.filter(concept => concept.length > 1);
    }

    /**
     * Removes reserved keywords from the given concepts based on the file type.
     * Keywords related to the file's language or libraries are filtered out.
     *
     * @param fileName {String} The name of the file being processed.
     * @param concepts {Array} The array of concepts to filter.
     * @returns {Array} A filtered array of concepts without reserved keywords.
     */
    removeReservedKeywords(fileName, concepts) {
        const fileExtension = `.${this.getFileExtension(fileName)}`;
        const fileTypeKeywords = languagesReservedKeywords[fileExtension];

        if (!fileTypeKeywords) {
            console.error(`Cannot filter reserved keywords for filetype: ${fileExtension}`);
            console.error("Skipping removeReservedKeywords()...");
            return concepts;
        }

        // Combine language and library keywords into a Set for faster lookup
        const reservedKeywords = [
            ...fileTypeKeywords.language,
            ...(fileTypeKeywords.libraries
                ? Object.values(fileTypeKeywords.libraries).flat()
                : [])
        ];

        // Function to check if a concept matches or is included in any reserved keyword
        const isReservedKeyword = (concept) => {
            return reservedKeywords.some(keyword =>
                concept.toLowerCase().includes(keyword.toLowerCase())
            );
        };

        // Filter out reserved keywords
        return concepts.filter(concept => !isReservedKeyword(concept));
    }


    /**
     * Removes duplicate concepts from the array, ensuring uniqueness.
     *
     * @param concepts {Array} The array of concepts to remove duplicates from.
     * @returns {Array} A new array with unique concepts.
     */
    removeDuplicates(concepts) {
        return [...new Set(concepts)];
    }

    /**
     * Separates concepts that contain multiple words, normalizing them into isolated words.
     * The function handles various formats like kebab-case, snake_case, CamelCase, and PascalCase.
     *
     * @param concepts {Array} The array of concepts to normalize.
     * @returns {Array} An array of individual, lowercase words derived from the concepts.
     */
    separateMultipleWordsConcepts(concepts) {
        return concepts.flatMap(concept => {
            // Convert kebab-case and snake_case to CamelCase
            const normalizedConcept = concept
                .split(/[-_]/)  // Handle both '-' and '_'
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join('');

            // Convert CamelCase and PascalCase to isolated lowercase words
            return normalizedConcept
                .replace(/([a-z])([A-Z])/g, '$1 $2')  // camelCase to isolated words
                .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')  // PascalCase to isolated words
                .toLowerCase();
                // .split(" ");
        });
    }

    /**
     * Lemmatizes the concepts by reducing them to their base form.
     * Each concept is split into individual words, and each word is lemmatized using the noun lemmatizer.
     *
     * @param concepts {Array} The array of concepts to lemmatize.
     * @returns {Array} An array of lemmatized concepts.
     */
    lemmatizeConcepts(concepts) {
        return concepts.map(concept =>
            concept
                .split(' ')
                .map(winkNLPLemmatizer.noun)
                .join(' ')
        );
    }

    /**
     * Filters the concepts by checking if each word in the concept is a valid dictionary word.
     * Only concepts composed of at least one common dictionary words are retained.
     *
     * @param concepts {Array} The array of concepts to filter.
     * @returns {Array} A filtered array containing only valid concepts.
     */
    filterByDictionaryType(concepts) {
        // Check if some parts of a concept are common words
        return concepts.filter(concept =>
            // The dictionary check is based on the default english dictionary of the Typo.js libray
            // See https://github.com/cfinke/Typo.js/tree/master/typo/dictionaries/en_US
            concept.split(" ").some(word => dictionary.check(word)) //
        );
    }

    /**
     * Sorts and filters the analysis results based on their TF-IDF scores.
     * Concepts with a TF-IDF score above a certain threshold are retained and sorted in descending order.
     *
     * @param analysisResults {Array} The array of analysis results containing tokens to be processed.
     * @returns {Array} The updated analysis results with filtered and sorted concepts.
     */
    sortAndFilterByTfIdfScores(analysisResults) {
        const IMPORTANT_CONCEPT_THRESHOLD = 1; // Threshold to filter significant concepts

        // Add files as documents in TF-IDF
        analysisResults.forEach(({tokens}) => tfidf.addDocument(tokens.join(" ")));

        // Filter and update significant concepts for each file
        analysisResults.forEach((analysisResult, index) => {
            const importantConcepts = tfidf.listTerms(index)
                .filter(({tfidf}) => tfidf > IMPORTANT_CONCEPT_THRESHOLD)
                .map(({term, tfidf}) => ({
                    concept: term,
                    score: parseFloat(tfidf.toFixed(2))
                }))
                .sort((a, b) => b.score - a.score);  // Sort by descending score

            // Update tokens with filtered concepts
            analysisResult.tokens = importantConcepts;
        });

        return analysisResults;
    }


    /**
     * Sums and ranks concepts by their cumulative TF-IDF scores across files.
     *
     * @param analysisResults {Array} List of files with tokens containing 'concept' and 'score'.
     * @returns {Array} Sorted concepts with their total scores.
     */
    getTopConcepts(analysisResults) {
        const conceptScores = {};

        // Iterate through all files to sum up the scores of concepts
        analysisResults.forEach(file => {
            file.tokens.forEach(({ concept, score }) => {
                if (conceptScores[concept]) {
                    conceptScores[concept] += score;
                } else {
                    conceptScores[concept] = score;
                }
            });
        });

        // Convert the object to an array, sort by descending score, and return the formatted results
        return Object.entries(conceptScores)
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
            .map(([concept, score]) => ({ concept, totalTfIdfScore: score.toFixed(2) }));
    }

    /**
     * Checks if the file extension is supported for analysis.
     *
     * @param {string} filePath - The full path of the file to be analyzed.
     *                            It should include the file name and extension.
     * @returns {boolean} - Returns `true` if the file extension is supported (currently 'js' or 'java'),
     *                      otherwise returns `false`.
     */
    fileExtensionSupportedForAnalysis(filePath) {
        return FILE_EXTENSIONS_SUPPORTED_FOR_NLP_ANALYSIS.includes(this.getFileExtension(filePath));
    }

    /**
     * Extracts the file extension from the given file path.
     * The extension is determined by the substring following the last dot in the file path.
     *
     * @param filePath {String} The file path from which the extension is extracted.
     * @returns {String} The file extension (e.g., "txt", "js", "html").
     */
    getFileExtension(filePath) {
        return filePath.substring(filePath.lastIndexOf(".") + 1);
    }

    /**
     * Retrieves the number of lines of code for a given file content and file extension.
     * This function uses the `sloc` library to calculate the lines of code based on the content and the file type.
     * If an error occurs during the calculation (e.g., unsupported file type), it returns 0.
     *
     * @param fileContent {String} The content of the file for which the lines of code are calculated.
     * @param fileExtension {String} The file extension (e.g., 'js', 'java', 'py') to determine the type of file.
     * @returns {Number} The number of lines of code in the file, or 0 if an error occurs.
     */
    getFileNumberOfLinesOfCode(fileContent, fileExtension) {
        try {
            const {source: fileNumberOfLinesOfCode} = sloc(fileContent, fileExtension);
            return fileNumberOfLinesOfCode;
        }
        catch (error) {
            return 0;
        }
    }

    /**
     * Returns the repository folder path corresponding to the given repository name.
     * @param repository The given repository name.
     * @return {String} The corresponding folder path.
     */
    getRepositoryFolder(repository) {
        if (repository !== undefined && repository !== null && repository !== '') {
            return process.cwd() + FILE_SYSTEM_SEPARATOR + TEMP_FOLDER_NAME + FILE_SYSTEM_SEPARATOR + repository;
        } else {
            throw new BadFormat(INPUT_INCORRECTLY_FORMATTED);
        }
    }

    /**
     * Retrieves the repository name from a 'denim' file if it exists,
     * otherwise returns the original element name.
     *
     * @param {string} element - The repository identifier, typically the folder name.
     * @returns {string} - The repository URL if the 'denim' file exists and contains a URL,
     *                     otherwise returns the original element.
     */
    getRepositoryName(element) {
        let denimFilePath = this.getRepositoryFolder(element) + FILE_SYSTEM_SEPARATOR + 'denim';
        if (fs.existsSync(denimFilePath)) {
            const url = fs.readFileSync(denimFilePath, 'utf8').split('\n')[0].trim();
            return url;
        }
        return element;
    }
}

module.exports = StaticAnalyzerNLP;