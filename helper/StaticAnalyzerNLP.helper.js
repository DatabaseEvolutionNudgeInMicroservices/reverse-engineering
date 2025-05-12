// Constants

const {
    FILE_SYSTEM_SEPARATOR,
    TEMP_FOLDER_NAME,
    LANGUAGES_RESERVED_KEYWORDS,
    FILE_EXTENSIONS_SUPPORTED_FOR_NLP_ANALYSIS
} = require('./Constant.helper.js');

// Error

const NotImplemented = require('../error/NotImplemented.error');
const BadFormat = require('../error/BadFormat.error.js');
const AnalysisFail = require('../error/AnalysisFail.error.js');
const {INPUT_INCORRECTLY_FORMATTED} = require('../error/Constant.error.js');

// Helpers

const StaticAnalyzer = require('./StaticAnalyzer.helper.js');

// Evaluation

const {evaluateFilesTags} = require("../evaluation/nlp");

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

// Configuration : Wink

const nlp = winkNLP(model);
const patterns = [{name: 'concept', patterns: ['NOUN', 'PROPN']}]; // Concepts are usually represented as nouns or proper nouns.
nlp.learnCustomEntities(patterns);


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
     * @param dbDetails {Object} An object mapping repository names to arrays of database-related information.
     * @returns {Promise} A promise for the extraction.
     */
    extractByList(list, language, dbDetails) {
        return new Promise((resolveAll, rejectAll) => {
            if (list !== undefined && list !== null && list.length !== 0) {
                let promises = [];
                list.forEach(element => {
                    promises.push(new Promise((resolve, reject) => {
                        this.extractByElement(element, language, dbDetails ? dbDetails[element] : undefined).then(result => {
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
     * @param dbDetails {Object} - List of database-related concepts and optionnally anchor points concepts.
     * @returns {Promise} A promise for the extraction.
     */
    extractByElement(element, language, dbDetails) {
        return new Promise((resolve, reject) => {
            if (!(element && element.length > 0 && language && language !== '')) {
                return reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED));
            }

            try {
                // Perform NLP-based repository analysis and obtain files with their pertinent concepts and occurrences
                let filesAndTheirConcepts = this.analyzeRepositoryWithNLP(element, !dbDetails);

                // Identify the exact lines in each file where the concepts appear
                filesAndTheirConcepts = this.findLinesForEachConcepts(filesAndTheirConcepts);

                // Check if a list of database-related concepts has been provided for the element
                if (dbDetails) {
                    // Normalize and tokenize the DB concepts using the same method as for concepts in source files
                    dbDetails["data_concepts"] = this.extractConcepts(dbDetails["data_concepts"].join(" ")).flatMap(concept => concept.split(" "));
                    // Tag each file based on the presence of DB-related concepts using heuristics
                    filesAndTheirConcepts = this.tagFilesSemiAutomated(element, filesAndTheirConcepts, dbDetails);
                }

                // Convert the analyzed data into a hierarchical directory tree structure,
                resolve(this.buildDirectoryTreeWithFilesAndCodeFragments(filesAndTheirConcepts));

            } catch (error) {
                console.log(error);
                reject(new AnalysisFail(error.message));
            }
        });
    }

    /**
     * Analyzes a repository using NLP techniques to extract business-related concepts from its files.
     * This function recursively scans all files in the repository, extracts concepts, filters the most relevant ones
     *
     * @param element {String}  - The repository element containing metadata needed for analysis.
     * @param automaticTaggingEnabled {boolean} - Whether the file should be automatically tagged as DB-related using heuristics
     * @returns {Array} An array of objects where each file is tagged with its extracted concepts and clustering information.
     */
    analyzeRepositoryWithNLP(element, automaticTaggingEnabled) {
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
                    let fileConceptsDetails;
                    if (this.fileIsSupportedForNLPAnalysis(itemPath)) {
                        const fileConcepts = this.extractConcepts(fileContent, item);
                        fileConceptsDetails = this.getConceptsDetails(fileConcepts);
                    }

                    // Push results
                    analysisResults.push({
                        repository: repositoryName,
                        file: itemPath,
                        tokens: fileConceptsDetails ?? {},
                        fileNumberOfLinesOfCode: fileNumberOfLinesOfCode
                    });
                }
            });
        };

        // Start exploration from the root folder
        exploreDirectory(repositoryFolder);

        // Refine results by filtering most pertinent concepts and optionally tag files as DB-related
        return this.refineResults(element, analysisResults, automaticTaggingEnabled);
    }

    /**
     * Extracts and processes concepts from a given file content or string of tokens.
     * The function filters, normalizes, and refines the concepts before returning them.
     *
     * @param content {String} The content of the file.
     * @param fileName {String} The name of the file from which concepts are extracted.
     * @returns {Array} An array of processed concepts after filtering and normalization.
     */
    extractConcepts(content, fileName="") {
        // Filtering
        let concepts = this.extractRawConcepts(content);
        concepts = this.filterNoisyConcepts(concepts);
        concepts = this.removeReservedKeywords(concepts, fileName);

        // Normalizing
        concepts = this.separateMultipleWordsConcepts(concepts);
        concepts = this.lemmatizeConcepts(concepts);

        // Filtering
        concepts = this.removeStopWords(concepts);

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
        }).filter(Boolean) // Deletes empty string;
    }

    /**
     * Removes reserved keywords from the given concepts based on the file type.
     * Keywords related to the file's language or libraries are filtered out.
     *
     * @param concepts {Array} The array of concepts to filter.
     * @param fileName {String} The name of the file being processed.
     * @returns {Array} A filtered array of concepts without reserved keywords.
     */
    removeReservedKeywords(concepts, fileName) {
        const fileExtension = `.${this.getFileExtension(fileName)}`;
        const fileTypeKeywords = LANGUAGES_RESERVED_KEYWORDS[fileExtension];

        if (!fileTypeKeywords) {
            return concepts;
        }

        // Extends other file type
        if ("_extends_" in fileTypeKeywords) {
            const newExtension = fileTypeKeywords["_extends_"];
            concepts = this.removeReservedKeywords(concepts, fileName.split(".")[0] + newExtension);
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
                // Reduces plural nouns and derived forms to their base form (lemma).
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
     * Counts the occurrences of each concept present in the given list of concepts.
     * Each concept may contain multiple words, which are split and counted separately.
     *
     * @param concepts {Array} The array of concepts to analyze.
     * @returns {Object} An object mapping each unique word to its number of occurrences.
     */
    getConceptsDetails(concepts) {
        const counter = {};

        concepts.forEach(concept => {
            const words = concept.split(/\s+/).filter(Boolean); // Handles multiple spaces
            words.forEach(word => {
                if (!counter[word]) {
                    counter[word] = { numberOfOccurence: 0 };
                }
                counter[word].numberOfOccurence += 1;
            });
        });

        return counter;
    }

    /**
     * Refines the results by keeping only the most pertinent concepts.
     * The function filters and sorts concepts based on relevance and then updates the results.
     * It also tags each file automatically as DB-related using heuristics,
     *
     * @param element {String}  - The repository element containing metadata needed for analysis.
     * @param sortedResults {Array} - The list of results containing extracted concepts and their occurrences.
     * @param automaticTaggingEnabled {boolean} - Whether the file should be automatically tagged as DB-related using heuristics
     * @returns {Array} A new array with the refined concepts, keeping only the most pertinent ones.
     */
    refineResults(element, sortedResults, automaticTaggingEnabled) {
        // Filter and sort
        const bestConceptsSorted = this.filterAndSortBestConcepts(sortedResults);

        // Keep only name of concepts
        const bestConceptsSortedNameOnly = bestConceptsSorted.map(conceptObject => conceptObject.concept)

        // Make the results refined with only the best concepts
        let refinedResults = sortedResults.map(item => {
            return {
                ...item,
                tokens: Object.fromEntries(
                    Object.entries(item.tokens).filter(([key, value]) => bestConceptsSortedNameOnly.includes(key))
                )
            };
        });

        // If automatic tagging is enabled, tag files as DB-related using heuristics
        if (automaticTaggingEnabled) {
            refinedResults = this.tagFilesFullyAutomated(element, refinedResults, bestConceptsSorted);
        }

        return refinedResults;
    }

    /**
     * Filters and sorts the most relevant concepts based on various metrics.
     * The function calculates metrics such as TF-IDF, coefficient of variation, and dominance,
     * then normalizes them and computes a final score to determine the most important concepts.
     * The most important concepts are once again filtered based on the value of the centrality metric
     *
     * @param sortedResults {Array} - The list of results containing extracted concepts and their occurrences.
     * @returns {Array} A list of concepts with computed scores, sorted by relevance.
     */
    filterAndSortBestConcepts(sortedResults) {
        // Weight distribution of each metric in the final score calculation
        const weights = {
            tfidf: 0.3, // Measures global rarity of a concept across all files (higher = rarer and more significant).
            coefficientVariation: 0.6, // Captures how concentrated a concept is within a single file (higher = more unevenly distributed).
            dominance: 0.1, // Measures how much a concept dominates in a file relative to others (higher = more dominant).
        };

        // Step 1: Compute initial metrics for each concept (without centrality)
        let conceptsAndMetrics = [];
        Object.entries(this.getConceptsWithFilesAndOccurences(sortedResults))
            .forEach(([concept, occurrences]) => {
                const numFiles = occurrences.length;
                const occurenceList = occurrences.map(o => o.nbOccurence);
                const sumOccurence = occurenceList.reduce((acc, val) => acc + val, 0);
                const maxOccurrence = Math.max(...occurenceList);

                // Coefficient of Variation (CoV)
                const meanOccurrence = sumOccurence / numFiles;
                const stdDev = Math.sqrt(
                    occurenceList.reduce((acc, val) => acc + Math.pow(val - meanOccurrence, 2), 0) / numFiles
                );
                const coefficientVariation = stdDev / meanOccurrence;

                // TF-IDF
                const totalFiles = sortedResults.length;
                const idf = Math.log(totalFiles / numFiles);
                const tfidfScores = occurrences.map(o => o.nbOccurence * idf);
                const avgTfidf = tfidfScores.reduce((acc, val) => acc + val, 0) / numFiles;

                // Dominance
                const dominance = maxOccurrence / sumOccurence;

                // Store concept with calculated metrics
                conceptsAndMetrics.push({concept, coefficientVariation, avgTfidf, dominance});
            });

        // Step 2: Normalize the initial metrics
        function normalize(arr, key) {
            const values = arr.map(o => o[key]).filter(v => !isNaN(v));
            const min = Math.min(...values);
            const max = Math.max(...values);
            return arr.map(o => ({...o, [`${key}Norm`]: (o[key] - min) / (max - min || 1)}));
        }
        conceptsAndMetrics = normalize(conceptsAndMetrics, "coefficientVariation");
        conceptsAndMetrics = normalize(conceptsAndMetrics, "avgTfidf");
        conceptsAndMetrics = normalize(conceptsAndMetrics, "dominance");

        // Step 3: Compute final scores
        conceptsAndMetrics.forEach(c => {
            c.finalScore =
                weights.tfidf * c.avgTfidfNorm +
                weights.coefficientVariation * c.coefficientVariationNorm +
                weights.dominance * c.dominanceNorm;
        });

        // Step 4: First filtering pass based on the preliminary final score
        const scores = conceptsAndMetrics.map(c => c.finalScore).filter(score => typeof score === "number" && !isNaN(score));
        const minimumRequiredFinalScoreMetric = scores.reduce((acc, val) => acc + val, 0) / scores.length; // Mean
        conceptsAndMetrics = conceptsAndMetrics.filter(c => c.finalScore > minimumRequiredFinalScoreMetric);

        // Step 5: Sort concepts by descending final score
        conceptsAndMetrics.sort((a, b) => b.finalScore - a.finalScore);

        // Step 6: Returns concepts and their metrics
        return conceptsAndMetrics;
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
        const result = Object.create(null);

        sortedResults.forEach(item => {
            const sourceFile = item.file

            Object.keys(item.tokens).forEach(token => {
                const nbOccurence = item.tokens[token].numberOfOccurence;
                (result[token] ||= []).push({sourceFile, nbOccurence});
            });
        });

        return result;
    }

    /**
     * Enhances analysis results by identifying the exact lines where each concept appears in its corresponding file.
     *
     * @param analysisResults {Array} - An array of analysis result objects, where each object contains the file path
     *                                  and a `tokens` map associating concepts to their metadata.
     * @returns {Array} The updated analysisResults array, where each concept includes the list of line numbers it appears on.
     */
    findLinesForEachConcepts(analysisResults) {
        analysisResults.forEach(result => {
            const lines = fs.readFileSync(result.file, 'utf-8').split('\n');
            const tokens = Object.keys(result.tokens);

            // Iterate over each line in the file
            lines.forEach((line, index) => {

                // Get all concepts of the current line
                const lineConcepts = this.extractConcepts(line, result.file)
                    .flatMap(entry => entry.split(/\s+/))
                    .filter(Boolean);

                // Check whether any token is on that line
                tokens.forEach(token => {
                    if (lineConcepts.includes(token)) {
                        const tokenData = result.tokens[token] ?? result.tokens[Object.keys(result.tokens).find(k => k.toLowerCase() === token)];
                        if (!tokenData.lines) {
                            tokenData.lines = [];
                        }
                        tokenData.lines.push(index + 1);
                    }
                });
            });
        });

        return analysisResults;
    }

    /**
     * Tags each file in the analysis results as DB-related using heuristics,
     * writes the clustering results to a file, and evaluates the tagging accuracy.
     *
     * @param {string} element - The repository name, used for evaluation.
     * @param {Array} refinedResults - Array of files with token metadata.
     * @param bestConcepts {Array} - A list of concepts with computed scores
     * @returns {Array} The tagged analysis results with cluster values.
     */
    tagFilesFullyAutomated(element, refinedResults, bestConcepts) {
        return this.tagFiles(element, refinedResults, {data_concepts: bestConcepts.map(x => x.concept).slice(0, 30)}, "fully_automated");
    }

    /**
     * Tags each file in the analysis results as DB-related using heuristics,
     * writes the clustering results to a file, and evaluates the tagging accuracy.
     *
     * @param {string} element - The repository name, used for evaluation.
     * @param {Array} refinedResults - Array of files with token metadata.
     * @param {Object} dbDetails - List of database-related concepts and optionnally anchor points concepts.
     * @returns {Array} The tagged analysis results with cluster values.
     */
    tagFilesSemiAutomated(element, refinedResults, dbDetails) {
        return this.tagFiles(element, refinedResults, dbDetails, `semi_automated_with${"anchor_points" in dbDetails ? "" : "out"}_anchors`);
    }

    /**
     * Tags each file in the analysis results as DB-related using heuristics,
     * writes the clustering results to a file, and evaluates the tagging accuracy.
     *
     * @param {string} element - The repository name, used for evaluation.
     * @param {Array} refinedResults - Array of files with token metadata.
     * @param {Object} dataConcepts - List of database-related concepts and optionnally anchor points concepts.
     * @param {string} taggingMode - Fully automated or semi-automated with(out) anchors tag files mode
     * @returns {Array} The tagged analysis results with cluster values.
     */
    tagFiles(element, refinedResults, dataConcepts, taggingMode) {
        // Tag the files using clustering heuristics based on database concepts and save results
        const refinedAnalysisResultsWithTags = this.tagFilesByClusteringWithHeuristics(refinedResults, dataConcepts);

        // Evaluate the tagging results
        evaluateFilesTags(element, refinedAnalysisResultsWithTags, taggingMode);

        return refinedAnalysisResultsWithTags;
    }

    /**
     * Tags files as database-related or not using density heuristic.
     *
     * A file is considered DB-related (cluster = 1) if
     * the density of DB-related concepts (occurrences / lines of code) is >= THRESHOLD_DENSITY.
     *
     * @param refinedResults {Array} - List of files with token data and metadata.
     * @param dbDetails {Object}  - List of database-related concepts and optionnally anchor points concepts.
     * @returns {Array} Files with a `cluster` field: 1 (DB-related), 0 (not DB-related).
     */
    tagFilesByClusteringWithHeuristics(refinedResults, dbDetails) {
        // Separate files with and without token information
        const filesWithTokens = refinedResults.filter(file =>
            Object.keys(file.tokens).length > 0 && file.fileNumberOfLinesOfCode > 0
        );
        const filesWithoutTokens = refinedResults.filter(file =>
            Object.keys(file.tokens).length === 0 || file.fileNumberOfLinesOfCode === 0
        );

        // Heuristic threshold
        const THRESHOLD_DENSITY = 0.2;

        // Apply heuristic on files with tokens
        const clusteredFilesWithTokens = filesWithTokens.map(file => {

            // Count how many DB-related concept occurrences are in this file
            const dbConceptOccurrences = Object.entries(file.tokens)
                .filter(([token]) => dbDetails["data_concepts"].includes(token))
                .reduce((sum, [, data]) => sum + data.numberOfOccurence, 0);

            // Calculate concept density relative to lines of code
            const dbConceptDensity = dbConceptOccurrences / file.fileNumberOfLinesOfCode;

            // Tag file as DB-related (1) or not (0) based on heuristics
            return {
                ...file,
                cluster: dbDetails["anchor_points"]
                    ? (Object.keys(file.tokens).some(item => dbDetails["anchor_points"].includes(item.toLowerCase())) && dbConceptDensity >= THRESHOLD_DENSITY) ? 1 : 0
                    : dbConceptDensity >= THRESHOLD_DENSITY ? 1 : 0
            };
        });

        // Tag files without tokens or code as unusable
        const clusteredFilesWithoutTokens = filesWithoutTokens.map(file => ({
            ...file,
            cluster: 0
        }));

        // Return all tagged files
        return [...clusteredFilesWithTokens, ...clusteredFilesWithoutTokens];
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
        const root = {location: `${extractionResults[0].repository}/`, directories: []};

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
                    dir = {location: currentPath, directories: [], files: []};
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
            // If file has no concept
            if (Object.keys(entry.tokens).length === 0) {
                return [{
                    location: `${relativePath}#L0C0-L0C0`,
                    technology: { id: "javascript-any-any-file" },
                    operation: {name: "OTHER"},
                    method: {name: " "},
                    sample: {content: " "},
                    concepts: [],
                    heuristics: "unknown",
                    score: "unknown"
                }];
            }

            // If file has at least one concept
            const lineMap = new Map();
            Object.keys(entry.tokens).forEach(token => {
                entry.tokens[token].lines.forEach(line => {
                    const key = `${relativePath}#L${line}`;
                    if (!lineMap.has(key)) {
                        lineMap.set(key, {
                            location: key,
                            technology: { id: "unknown" },
                            operation: { name: "OTHER" },
                            method: { name: " " },
                            sample: { content: " " },
                            concepts: [],
                            heuristics: "unknown",
                            score: "unknown"
                        });
                    }
                    lineMap.get(key).concepts.push({ name: token });
                });
            });

            return Array.from(lineMap.values());
        }

        extractionResults.forEach(entry => {
            // Normalize to UNIX format
            const relativePath = entry.file.split(`${FILE_SYSTEM_SEPARATOR}TEMP${FILE_SYSTEM_SEPARATOR}`)[1].replace(/\\/g, "/");
            const dirPath = relativePath.substring(0, relativePath.lastIndexOf("/"));

            // Build directory hierarchy
            const parentDir = getOrCreateDirectory(dirPath, root);

            // Add file to the correct directory
            parentDir.files.push({
                location: relativePath,
                linesOfCode: entry.fileNumberOfLinesOfCode,
                codeFragments: createCodeFragments(relativePath, entry),
                cluster: entry?.cluster
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
        if (!filePath.includes(".")) { // If file has no extension
            return "";
        }
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