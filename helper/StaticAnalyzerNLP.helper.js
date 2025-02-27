// Constants

const {
    FILE_SYSTEM_SEPARATOR,
    TEMP_FOLDER_NAME,
    LANGUAGES_RESERVED_KEYWORDS
} = require('./Constant.helper.js');

const FILE_EXTENSIONS_SUPPORTED_FOR_NLP_ANALYSIS = ["js", "mjs", "cjs"];

// Error

const NotImplemented = require('../error/NotImplemented.error');
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
const stopwords = natural.stopwords;

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
            rejectAll(new NotImplemented("Method initializesByList not implemented"));
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
            rejectAll(new NotImplemented("Method initializesByElement not implemented"));
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
            rejectAll(new NotImplemented("Method identifyByList not implemented"));
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
            rejectAll(new NotImplemented("Method identifyByElement not implemented"));
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
            rejectAll(new NotImplemented("Method initializesByList not implemented"));
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
                        } else if (stats.isFile()) {
                            // If it's a file, perform the analysis
                            const fileContent = fs.readFileSync(itemPath, 'utf8');
                            const fileExtension = this.getFileExtension(itemPath);
                            const fileNumberOfLinesOfCode = this.getFileNumberOfLinesOfCode(fileContent, fileExtension);

                            // Extract the concepts only for files that are supported
                            let fileConceptsOccurences;
                            if (this.fileIsSupportedForNLPAnalysis(itemPath)) {
                                const fileConcepts = this.extractConceptsFromFile(item, fileContent);
                                fileConceptsOccurences = this.getConceptsOccurences(fileConcepts);
                            }

                            // Push results
                            analysisResults.push({
                                repository: repositoryName,
                                file: itemPath,
                                tokens: fileConceptsOccurences ?? [],
                                fileNumberOfLinesOfCode: fileNumberOfLinesOfCode
                            });
                        }
                    });
                };

                // Start exploration from the root folder
                exploreDirectory(repositoryFolder);

                // Filter most pertinent concepts
                const refinedAnalysisResults = this.refineResultsByKeepingMostPertinentConceptsOnly(analysisResults);

                // Return the refined results in a directory tree with associated files and code fragments
                resolve(this.buildDirectoryTreeWithFilesAndCodeFragments(refinedAnalysisResults));

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

        // Normalizing
        concepts = this.separateMultipleWordsConcepts(concepts);
        concepts = this.lemmatizeConcepts(concepts);

        // Filtering
        concepts = this.removeStopWords(concepts);
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
     * @param concepts {Array} The array of concepts to filter.
     * @returns {Array} A filtered array containing only meaningful concepts.
     */
    filterNoisyConcepts(concepts) {
        return concepts.filter(concept => concept.length > 1);
    }

    /**
     * Removes stop words from the given concepts.
     * @param concepts {Array} The array of concepts to filter.
     * @returns {Array} A filtered array of concepts without stop words.
     */
    removeStopWords(concepts) {
        return concepts.map(concept => {
            return concept.split(" ")
                   .filter(conceptSplitted => !stopwords.includes(conceptSplitted.toLowerCase()))
                   .join(" ")
        });
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
        const fileTypeKeywords = LANGUAGES_RESERVED_KEYWORDS[fileExtension];

        if (!fileTypeKeywords) {
            console.error(`Cannot filter reserved keywords for filetype: ${fileExtension}`);
            console.error("Skipping removeReservedKeywords()...");
            return concepts;
        }

        // Extends other file type
        if ("_extends_" in fileTypeKeywords) {
            const newExtension = fileTypeKeywords["_extends_"];
            concepts = this.removeReservedKeywords(fileName.split(".")[0] + newExtension, concepts);
            if (Object.keys(fileTypeKeywords).length === 1) {
                return concepts;
            }
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
                concept.toLowerCase() === keyword.toLowerCase()
            );
        };

        // Filter out reserved keywords
        return concepts.filter(concept => !isReservedKeyword(concept));
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
                // Reduces plural nouns and derived forms to their base form (lemma), same for the verbs.
                // If the word is not a recognized noun or verb, it returns the original word.
                // Examples: cars -> car,
                //           libraries -> library
                //           winning -> win
                //           ...
                .map(winkNLPLemmatizer.noun)
                // .map(winkNLPLemmatizer.verb)
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
     * Counts the occurrences of each concept present in the given list of concepts.
     * Each concept may contain multiple words, which are split and counted separately.
     *
     * @param concepts {Array} The array of concepts to analyze.
     * @returns {Object} An object mapping each unique word to its number of occurrences.
     */
    getConceptsOccurences(concepts) {
        const compteur = {};
        // Iterate over each concept and split it into words
        concepts.forEach(concept => {
            concept.split(" ").forEach(conceptSplit => {
                compteur[conceptSplit] = (compteur[conceptSplit] || 0) + 1; // This implicitly remove duplicates of concepts
            })

        });
        return compteur;
    }

    /**
     * Refines the results by keeping only the most pertinent concepts.
     * The function filters and sorts concepts based on relevance and then updates the results.
     *
     * @param sortedResults {Array} - The list of results containing extracted concepts and their occurrences.
     * @returns {Array} A new array with the refined concepts, keeping only the most pertinent ones.
     */
    refineResultsByKeepingMostPertinentConceptsOnly(sortedResults) {
        // Filter and sort
        const bestConceptsSorted = this.filterAndSortBestConcepts(sortedResults);
        console.log(bestConceptsSorted);

        // Keep only name of concepts
        const bestConceptsSortedNameOnly = bestConceptsSorted.map(conceptObject => conceptObject.concept)

        // Return the results refined with only the best concepts
        return sortedResults.map(item => {
            return {
                ...item,
                tokens: Object.fromEntries(
                    Object.entries(item.tokens).filter(([key, value]) => bestConceptsSortedNameOnly.includes(key))
                )
            };
        });
    }

    /**
     * Filters and sorts the most relevant concepts based on various metrics.
     * The function calculates metrics such as TF-IDF, coefficient of variation, and dominance,
     * then normalizes them and computes a final score to determine the most important concepts.
     *
     * @param sortedResults {Array} - The list of results containing extracted concepts and their occurrences.
     * @returns {Array} A list of concepts with computed scores, sorted by relevance.
     */
    filterAndSortBestConcepts(sortedResults) {
        // Minimum final score required for a concept to be considered relevant
        const MINIMUM_REQUIRED_FINAL_SCORE_METRIC = 0.25;

        // Weight distribution of each metric in the final score calculation
        const weights = {
            tfidf: 0.2,               // Importance of global rarity
            coefficientVariation: 0.6, // Importance of concentration within a file
            maxOccurrence: 0.0,       // Importance of local density
            dominance: 0.2
        };

        // Step 1: Compute metrics for each concept
        let conceptsAndMetrics = [];
        Object.entries(this.getConceptsWithFilesAndOccurences(sortedResults))
            .forEach(([concept, occurrences]) => {
                const numFiles = occurrences.length;
                const occurenceList = occurrences.map(o => o.nbOccurence);
                const sumOccurence = occurenceList.reduce((acc, val) => acc + val, 0);

                // Max occurence
                const maxOccurrence = Math.max(...occurenceList);

                // Coefficient of Variation (CoV)
                const meanOccurrence = sumOccurence / numFiles;
                const stdDev = Math.sqrt(
                    occurenceList.reduce((acc, val) => acc + Math.pow(val - meanOccurrence, 2), 0) / numFiles
                );
                const coefficientVariation = stdDev / meanOccurrence; // Dispersion relative

                // TF-IDF
                const totalFiles = sortedResults.length;
                const idf = Math.log(totalFiles / numFiles);
                const tfidfScores = occurrences.map(o => o.nbOccurence * idf);
                const avgTfidf = tfidfScores.reduce((acc, val) => acc + val, 0) / numFiles;

                // Dominance
                const dominance = maxOccurrence / sumOccurence;

                // Store concept with calculated metrics
                conceptsAndMetrics.push({concept, maxOccurrence, coefficientVariation, avgTfidf,  dominance});
            });

        // Step 2: Normalize the metrics
        function normalize(arr, key) {
            const values = arr.map(o => o[key]);
            const min = Math.min(...values);
            const max = Math.max(...values);
            return arr.map(o => ({...o, [`${key}Norm`]: (o[key] - min) / (max - min || 1)})); // Évite division par 0
        }
        conceptsAndMetrics = normalize(conceptsAndMetrics, "maxOccurrence");
        conceptsAndMetrics = normalize(conceptsAndMetrics, "coefficientVariation");
        conceptsAndMetrics = normalize(conceptsAndMetrics, "avgTfidf");
        conceptsAndMetrics = normalize(conceptsAndMetrics, "dominance");

        // Step 3: Compute final score
        conceptsAndMetrics.forEach(c => {
            c.finalScore =
                weights.tfidf * c.avgTfidfNorm +
                weights.maxOccurrence * c.maxOccurrenceNorm +
                weights.coefficientVariation * c.coefficientVariationNorm +
                weights.dominance * c.dominanceNorm
        });

        // Step 4: Sort concepts by descending final score
        conceptsAndMetrics.sort((a, b) => b.finalScore - a.finalScore);

        // Step 5: Keep only concepts with a final score above the minimum threshold
        return conceptsAndMetrics.filter(concept => concept.finalScore > MINIMUM_REQUIRED_FINAL_SCORE_METRIC);
    }


    /**
     * Retrieves all concepts along with the files they appear in and their occurrences.
     * This function organizes concepts in a structure that associates them with source files
     * and the number of times they appear in each file.
     *
     * @param sortedResults {Array} - The list of results containing extracted concepts and their occurrences.
     * @returns {Object} An object mapping concepts to an array of occurrences in different source files.
     */
    getConceptsWithFilesAndOccurences(sortedResults) {
        const result = {};

        sortedResults.forEach(item => {
            const sourceFile = item.file

            Object.keys(item.tokens).forEach(token => {
                const nbOccurence = item.tokens[token];
                (result[token] ||= []).push({ sourceFile, nbOccurence });
            });
        });

        return result;
    }

    /**
     * Constructs a hierarchical directory tree with associated files and code fragments.
     * This function processes extracted results, organizes them into a nested directory structure,
     * and attaches relevant code fragments to each file.
     *
     * @param extractionResults {Array} - The extracted results containing file metadata and token information.
     * @returns {Object} A structured representation of directories and files with code fragments.
     */
    buildDirectoryTreeWithFilesAndCodeFragments(extractionResults) {
        const root = { location: `${extractionResults[0].repository}/`, directories: [] };

        /**
         * Retrieves or creates a directory node in the hierarchical structure.
         *
         * @param {string} fullPath - The full directory path.
         * @param {Object} currentNode - The current directory node.
         * @returns {Object} The directory node.
         */
        function getOrCreateDirectory(fullPath, currentNode) {
            return fullPath.split("/").reduce((currentDir, part, index, parts) => {
                const currentPath = parts.slice(0, index + 1).join("/") + "/";
                let dir = currentDir.directories.find(d => d.location === currentPath);

                if (!dir) {
                    dir = { location: currentPath, directories: [], files: [] };
                    currentDir.directories.push(dir);
                }
                return dir;
            }, currentNode);
        }

        /**
         * Creates a code fragment for a given file entry.
         *
         * @param {string} relativePath - The relative file path.
         * @param {Object} entry - The file entry containing token information.
         * @returns {Array} An array containing the code fragment object.
         */
        function createCodeFragments(relativePath, entry) {
            return [{
                location: `${relativePath}#L0C0-L0C0`,
                technology: { id: Object.keys(entry.tokens).length === 0 ? "javascript-any-any-file" : "unknown" },
                operation: { name: "OTHER" },
                method: { name: " " },
                sample: { content: " " },
                concepts: Object.keys(entry.tokens).map(token => ({ name: token })),
                heuristics: "unknown",
                score: "unknown"
            }];
        }

        extractionResults.forEach(entry => {
            const relativePath = entry.file.split("\\TEMP\\")[1].replace(/\\/g, "/"); // Normalize to UNIX format
            const dirPath = relativePath.substring(0, relativePath.lastIndexOf("/"));

            // Build directory hierarchy
            const parentDir = getOrCreateDirectory(dirPath, root);

            // Add file to the correct directory
            parentDir.files.push({
                location: relativePath,
                linesOfCode: entry.fileNumberOfLinesOfCode,
                codeFragments: createCodeFragments(relativePath, entry)
            });
        });

        return root;
    }

    /**
     * Checks if the file is supported for NLP analysis.
     *
     * @param {string} filePath - The full path of the file to be analyzed.
     *                            It should include the file name and extension.
     * @returns {boolean} - Returns `true` if the file extension is supported (currently 'js' or 'java'),
     *                      otherwise returns `false`.
     */
    fileIsSupportedForNLPAnalysis(filePath) {
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
        } catch (error) {
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