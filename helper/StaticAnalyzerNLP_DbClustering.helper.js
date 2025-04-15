const fs = require('fs');
const kmeans = require("ml-kmeans");

const projectsGroundTruthForEvaluation = {
    "cinema-microservice-master": {
        "expected_db_files": [
            'booking-service/src/repository/repository.js',
            'cinema-catalog-service/src/repository/repository.js',
            'movies-service/src/repository/repository.js',
            'payment-service/src/repository/repository.js'
        ],
        "expected_api_files": [
            'booking-service/src/api/booking.js',
            'booking-service/src/services/payment.service.js',
            'booking-service/src/services/notification.service.js',
            'cinema-catalog-service/src/api/cinema-catalog.js',
            'movies-service/src/api/movies.js',
            'notification-service/src/api/notification.js',
            'payment-service/src/api/payment.js',
        ]
    },
    "robot-shop-master": {
        "expected_db_files": [
            'catalogue/server.js',
            'mongo/catalogue.js',
            'mongo/users.js',
            'user/server.js',
            'cart/server.js'
        ],
        "expected_api_files": [
            'catalogue/server.js',
            'cart/server.js',
            'user/server.js'
        ]
    },
    "comments-api-master": {
        "expected_db_files": [
            "db/index.js",
            "src/data-access/comments-db.js"
        ],
        "expected_api_files": [
            "src/index.js"
        ]
    },
    "overleaf-main": {
        "expected_db_files": [
            "services/docstore/app/js/HealthChecker.js",
            "services/docstore/app/js/MongoManager.js",
            "services/docstore/app/js/mongodb.js",
            "services/document-updater/app/js/SnapshotManager.js",
            "services/document-updater/app/js/mongodb.js",
            "services/chat/app/js/Features/Messages/MessageManager.js",
            "services/chat/app/js/Features/Threads/ThreadManager.js",
            "services/chat/app/js/mongodb.js",
            "services/contacts/app/js/ContactManager.js",
            "services/contacts/app/js/mongodb.js",
            "services/notifications/app/js/HealthCheckController.js",
            "services/notifications/app/js/Notifications.js",
            "services/notifications/app/js/mongodb.js",
            "services/web/app/src/Features/Spelling/LearnedWordsManager.js",
            "services/web/app/src/infrastructure/mongodb.js",
            "services/document-updater/app/js/DispatchManager.js",
            "services/document-updater/app/js/ProjectHistoryRedisManager.js",
            "services/document-updater/app/js/LockManager.js",
            "services/document-updater/app/js/ProjectFlusher.js",
            "services/document-updater/app/js/ProjectHistoryRedisManager.js",
            "services/document-updater/app/js/RealTimeRedisManager.js",
            "services/document-updater/app/js/RedisManager.js",
            "services/real-time/app.js",
            "services/real-time/app/js/ConnectedUserManager.js",
            "services/real-time/app/js/DocumentUpdaterManager.js",
            "services/real-time/app/js/DocumentUpdaterController.js",
            "services/real-time/app/js/ChannelManager.js",
            "services/real-time/app/js/WebsocketLoadBalancer.js",
            "services/project-history/app/js/LockManager.js",
            "services/project-history/app/js/RedisManager.js",
            "services/project-history/app/js/mongodb.js"
        ],
        "expected_api_files": [
            "services/docstore/app.js",
            "services/document-updater/app.js",
            "serivces/chat/app.js",
            "services/clsi/app.js",
            "services/contacts/app.js",
            "services/filestore/app.js",
            "services/notifications/app.js",
            "services/real-time/app/js/Router.js",
            "services/real-time/app.js",
            "services/history-v1/app.js",
            "services/project-history/app.js",
        ]
    }
}







/*
 *
 *
 * CLUSTERING WITH KMEANS
 *
 *
 */

function tagWithKMeans(element, refinedResults, bestConceptsSorted) {
    const refinedAnalysisResultsWithTags = tagFilesByClusteringWithKMeans(refinedResults, bestConceptsSorted);
    fs.writeFileSync('clustering_results.json', JSON.stringify(refinedAnalysisResultsWithTags, null, 2), 'utf8');
    evaluateFilesTags(element, refinedAnalysisResultsWithTags)

    return refinedAnalysisResultsWithTags;
}


/**
 * Tags files by applying a clustering technique based on their business-related concepts.
 * This function normalizes the extracted features and groups files into clusters using the K-Means algorithm.
 *
 * @param refinedResults {Array} - The list of files, each containing token occurrences and metadata.
 * @param bestConcepts {Array} - A list of concepts with computed scores
 * @returns {Array} The input data with an additional `cluster` attribute assigned to each file.
 */
function tagFilesByClusteringWithKMeans(refinedResults, bestConcepts) {
    // 🔹 Separate files with and without tokens
    const filesWithTokens = refinedResults.filter(file => Object.keys(file.tokens).length > 0 && file.fileNumberOfLinesOfCode > 0);
    const filesWithoutTokens = refinedResults.filter(file => Object.keys(file.tokens).length === 0 || file.fileNumberOfLinesOfCode === 0);

    // 🔹 Extract features only for files that contain tokens
    let filesConcepts = filesWithTokens.map(file => ({
        significantCentrality: Object.keys(file.tokens)
            .map(token => ({token, centrality: bestConcepts.find(x => x.concept === token)?.centralityNorm}))
            .filter(({token, centrality}) => centrality >= 0.5)
            .map(({token, centrality}) => centrality)
            .reduce((acc, val) => acc + val, 0) / file.fileNumberOfLinesOfCode,
    }));

    // 🔹 Build the feature matrix
    const featureMatrix = filesConcepts.map(file => [file.significantCentrality]);

    // 🔹 Apply K-Means only to files with tokens
    const numClusters = 2;
    const result = kmeans.kmeans(featureMatrix, numClusters, {initialization: 'kmeans++', seed: 42});

    // 🔹 Merge results with empty files (assigning cluster `-1`)
    const clusteredFilesWithTokens = filesWithTokens.map((file, i) => ({...file, cluster: result.clusters[i]}));
    const clusteredFilesWithoutTokens = filesWithoutTokens.map(file => ({...file, cluster: -1}));

    return [...clusteredFilesWithTokens, ...clusteredFilesWithoutTokens];
}


/**
 * Evaluates the correctness of file clustering tags by comparing them to the ground truth.
 * This function verifies if files classified as "DB" or "API" are correctly tagged
 * and calculates error percentages for overall files, JavaScript files, and ground truth files.
 *
 * @param {string} project - The project name, used to retrieve the ground truth classification.
 * @param {Array} clusteredData - The array containing files with their assigned cluster (-1 = No Tokens, 0 = Other, 1 = DB/API).
 */
function evaluateFilesTags(project, clusteredData) {
    if (!projectsGroundTruthForEvaluation[project]) {
        throw new Error(`Project '${project}' is not supported for file tags evaluation`);
    }

    // Retrieve expected DB and API files from the ground truth
    const dbAndApiFiles = new Set([
        ...projectsGroundTruthForEvaluation[project]["expected_db_files"],
        ...projectsGroundTruthForEvaluation[project]["expected_api_files"]
    ]);

    /**
     * Normalizes file paths to ensure consistency.
     * Converts Windows-style paths to Unix-style and removes the project prefix.
     *
     * @param {string} filePath - The original file path.
     * @returns {string} - The normalized file path.
     */
    function normalizeFilePath(filePath) {
        return filePath.replace(/\\/g, '/').replace(new RegExp(`^.*${project}/`), '');
    }

    /**
     * Checks whether a file is correctly classified based on its expected category.
     *
     * @param {string} filePath - The file path.
     * @param {number} cluster - The assigned cluster (-1 = No Tokens, 0 = Other, 1 = DB/API).
     * @returns {Object} - An object with classification details.
     */
    function checkFileClassification(filePath, cluster) {
        const isNoTokens = -1;
        const isOther = 0;
        const isDBorAPI = 1;
        const normalizedPath = normalizeFilePath(filePath);

        if (dbAndApiFiles.has(normalizedPath)) {
            return cluster !== isDBorAPI
                ? { file: normalizedPath, expected: isDBorAPI, found: cluster, status: '❌ Incorrect (false negative)' }
                : { file: normalizedPath, expected: cluster, found: cluster, status: '✅ Correct' };
        } else {
            if (cluster === isNoTokens) {
                return { file: normalizedPath, expected: isOther, found: cluster, status: '✅ Correct (No Tokens)' };
            }
            return cluster !== isOther
                ? { file: normalizedPath, expected: isOther, found: cluster, status: '❌ Incorrect (false positive)' }
                : { file: normalizedPath, expected: cluster, found: cluster, status: '✅ Correct' };
        }
    }

    // Evaluate classification for all files
    const classificationResults = clusteredData.map(({ file, cluster }) => checkFileClassification(file, cluster));

    // Identify incorrectly classified files
    const incorrectFiles = classificationResults.filter(result => result.status.includes('Incorrect'));

    // Display classification results
    console.log('🔍 Classification errors summary:');
    console.table(incorrectFiles.length ? incorrectFiles : [{ status: '✅ All files are correctly classified!' }]);

    // Calculate error percentages
    const totalFiles = clusteredData.length;
    const totalJsFiles = clusteredData.filter(x => getFileExtension(x.file) === "js").length;
    const totalGroundTruthFiles = dbAndApiFiles.size;

    function calculateErrorPercentage(errorCount, total) {
        return total > 0 ? ((errorCount / total) * 100).toFixed(2) + "%" : "N/A";
    }

    console.log("Error percentage (all files):", calculateErrorPercentage(incorrectFiles.length, totalFiles));
    console.log("Error percentage (JS files only):", calculateErrorPercentage(
        incorrectFiles.filter(x => getFileExtension(x.file) === "js").length, totalJsFiles
    ));
    console.log("Error percentage (ground truth files only):", calculateErrorPercentage(
        incorrectFiles.filter(x => dbAndApiFiles.has(x.file)).length, totalGroundTruthFiles
    ));

    // Save detailed results
    fs.writeFileSync('classification_check.json', JSON.stringify(classificationResults, null, 2), 'utf8');
    console.log('📄 Detailed results saved in classification_check.json');
}

/**
 * Extracts the file extension from a given file path.
 *
 * @param {string} filePath - The file path.
 * @returns {string} - The file extension (e.g., "js"), or an empty string if none.
 */
function getFileExtension(filePath) {
    return filePath.includes(".") ? filePath.split('.').pop() : "";
}










/*
 *
 *
 * CLUSTERING WITH HDBSCAN (uses a python script)
 *
 *
 */

function clusterWithPythonHDBScan(refinedResults, bestConceptsSorted) {
    exportFeatureMatrix(refinedResults, bestConceptsSorted);
    // Call python script // TODO implement python script call inside javascript if this technique is kept
    const finalResults = assignClustersToFiles(refinedResults);

    generateMarkdown(finalResults);
    return finalResults;
}

/**
 * Exports files as a feature matrix for HDBSCAN.
 *
 * @param {Array} refinedResults - List of files with their associated concepts.
 * @param {Array} bestConcepts - List of relevant concepts with their scores.
 */
function exportFeatureMatrix(refinedResults, bestConcepts) {
    // 🔹 Extract the list of concepts
    const conceptsList = bestConcepts.map(c => c.concept);
    // const conceptsList = bestConcepts.map(c => c.concept).filter(c => ["cinema", "movie", "payment", "ticket", "booking"].includes(c));

    // 🔹 Build the feature matrix
    const featureMatrix = refinedResults
        .filter(file => Object.keys(file.tokens).length > 0 && file.fileNumberOfLinesOfCode > 0) // Keep only files with tokens
        // .map(file => conceptsList.map(concept => concept in file.tokens ? 1 : 0));
        .map(file => conceptsList.map(concept => (file.tokens[concept].numberOfOccurence / file.fileNumberOfLinesOfCode) || 0));

    // 🔹 Save the matrix as a JSON file
    fs.writeFileSync('features.json', JSON.stringify(featureMatrix, null, 2), 'utf8');

    console.log("✅ Features exported to features.json");
}


/**
 * Loads the clusters found by HDBSCAN and associates them with the files.
 *
 * @param {Array} refinedResults - List of analyzed files.
 * @returns {Array} List of files with their assigned clusters.
 */
function assignClustersToFiles(refinedResults) {
    const clusters = JSON.parse(fs.readFileSync('clusters.json', 'utf8'));

    // 🔹 Associate each file with its cluster
    return refinedResults
        .filter(file => Object.keys(file.tokens).length > 0 && file.fileNumberOfLinesOfCode > 0) // Keep only files with tokens
        .map((file, i) => ({
            ...file,
            cluster: clusters.find(x => x.file === i).cluster // Assign the cluster found by HDBSCAN
        }));
}


function generateMarkdown(clusteredData) {
    // 🔹 Group files by cluster
    const clustersMap = new Map();

    clusteredData.forEach(({ file, cluster }) => {
        if (!clustersMap.has(cluster)) {
            clustersMap.set(cluster, []);
        }
        clustersMap.get(cluster).push(file);
    });

    // 🔹 Build the Markdown content
    let markdownContent = "# File Clustering\n\n";
    clustersMap.forEach((files, cluster) => {
        markdownContent += `## Cluster ${cluster}\n\n`;
        files.forEach(file => {
            markdownContent += `- \`${file}\`\n`;
        });
        markdownContent += "\n"; // Blank line for spacing
    });

    // 🔹 Save to a `clusters.md` file
    fs.writeFileSync('clusters.md', markdownContent, 'utf8');

    console.log("✅ File clusters.md successfully generated!");
}

module.exports = {tagWithKMeans, clusterWithPythonHDBScan};