const fs = require('fs');
const path = require('path');


/**
 * Ground truth data for evaluating file classifications across different projects.
 * This object contains the expected DB and API files for various projects.
 * Each project has two arrays:
 * 1. `expected_db_files` - List of files that are expected to be DB files.
 * 2. `expected_api_files` - List of files that are expected to be API files.
 */
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
    },
    "cloudboost-master": {
        "expected_db_files": [
            "data-service/cron/expire.js",
            "data-service/database-connect/keyService.js",
            "data-service/databases/mongo.js",
            "data-service/helpers/mongo.js",
            "data-service/services/app.js",
            "data-service/services/cloudObject.js",
            "data-service/services/table.js",
            "data-service/database-connect/apiTracker.js",
            "data-service/helpers/session.js",
            "data-service/helpers/socketQuery.js",
            "data-service/helpers/socketSession.js",
        ],
        "expected_api_files": [
            "data-service/api/app/Admin.js",
            "data-service/api/app/App.js",
            "data-service/api/app/AppFiles.js",
            "data-service/api/app/AppSettings.js",
            "data-service/api/db/mongo.js",
            "data-service/api/email/CloudEmail.js",
            "data-service/api/file/CloudFiles.js",
            "data-service/api/pages/Page.js",
            "data-service/api/server/Server.js",
            "data-service/api/tables/CloudObject.js",
            "data-service/api/tables/CloudUser.js",
            "data-service/helpers/github.js",
            "data-service/routes.js",
        ]
    }
}


/**
 * Tags each file in the analysis results as DB-related using heuristics,
 * writes the clustering results to a file, and evaluates the tagging accuracy.
 *
 * @param {string} element - The repository name, used for evaluation.
 * @param {Array} refinedResults - Array of files with token metadata.
 * @param {Array} dbConcepts - List of database-related concepts.
 * @returns {Array} The tagged analysis results with cluster values.
 */
function tagFilesWithHeuristics(element, refinedResults, dbConcepts) {
    // Ensure that the directory for storing evaluation results exists
    if (!fs.existsSync(getEvaluationResultsPath(element))) {
        fs.mkdirSync(getEvaluationResultsPath(element),  { recursive: true });
    }

    // Tag the files using clustering heuristics based on database concepts and save results
    const refinedAnalysisResultsWithTags = tagFilesByClusteringWithHeuristics(refinedResults, dbConcepts);
    fs.writeFileSync(`${getEvaluationResultsPath(element)}/clustering_results.json`, JSON.stringify(refinedAnalysisResultsWithTags, null, 2), 'utf8');

    // If ground truth data is available for the project, evaluate the tagging results
    if (Object.keys(projectsGroundTruthForEvaluation).includes(element)) {
        evaluateFilesTags(element, refinedAnalysisResultsWithTags)
    }

    return refinedAnalysisResultsWithTags;
}


/**
 * Tags files as database-related or not using heuristics.
 *
 * A file is considered DB-related (cluster = 1) if:
 * - It contains at least THRESHOLD_OCCURRENCE database-related concepts, OR
 * - The density of DB-related concepts (occurrences / lines of code) is >= THRESHOLD_DENSITY.
 *
 * @param refinedResults {Array} - List of files with token data and metadata.
 * @param dbConcepts {Array} - List of database-related concepts.
 * @returns {Array} Files with a `cluster` field: 1 (DB-related), 0 (not DB-related).
 */
function tagFilesByClusteringWithHeuristics(refinedResults, dbConcepts) {
    // Separate files with and without token information
    const filesWithTokens = refinedResults.filter(file =>
        Object.keys(file.tokens).length > 0 && file.fileNumberOfLinesOfCode > 0
    );
    const filesWithoutTokens = refinedResults.filter(file =>
        Object.keys(file.tokens).length === 0 || file.fileNumberOfLinesOfCode === 0
    );

    // Heuristic thresholds
    const THRESHOLD_OCCURRENCE = 3;    // Minimum total occurrences of DB concepts
    const THRESHOLD_DENSITY = 0.05;   // Minimum concept density

    // Apply heuristic on files with tokens
    const clusteredFilesWithTokens = filesWithTokens.map(file => {
        const fileTokens = file.tokens;

        // Count how many DB-related concept occurrences are in this file
        const dbConceptOccurrences = Object.entries(fileTokens)
            .filter(([token]) => dbConcepts.includes(token))
            .reduce((sum, [, data]) => sum + data.numberOfOccurence, 0);

        // Calculate concept density relative to lines of code
        const dbConceptDensity = dbConceptOccurrences / file.fileNumberOfLinesOfCode;

        // Tag file as DB-related (1) or not (0) based on heuristics
        return {
            ...file,
            cluster: dbConceptOccurrences >= THRESHOLD_OCCURRENCE || dbConceptDensity >= THRESHOLD_DENSITY ? 1 : 0
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
     * @param {number} cluster - The assigned cluster (0 = Other, 1 = DB/API).
     * @returns {Object} - An object with classification details.
     */
    function checkFileClassification(filePath, cluster) {
        const isOther = 0;
        const isDBorAPI = 1;
        const normalizedPath = normalizeFilePath(filePath);

        if (dbAndApiFiles.has(normalizedPath)) {
            return cluster !== isDBorAPI
                ? { file: normalizedPath, expected: isDBorAPI, found: cluster, status: '❌ Incorrect (false negative)' }
                : { file: normalizedPath, expected: cluster, found: cluster, status: '✅ Correct' };
        } else {
            return cluster !== isOther
                ? { file: normalizedPath, expected: isOther, found: cluster, status: '❌ Incorrect (false positive)' }
                : { file: normalizedPath, expected: cluster, found: cluster, status: '✅ Correct' };
        }
    }

    // Evaluate classification for all files
    const classificationResults = clusteredData.map(({ file, cluster }) => checkFileClassification(file, cluster));

    // Compute evaluation metrics
    const evaluationMetrics = computeEvaluationMetrics(classificationResults);

    // Save detailed results
    fs.writeFileSync(`${getEvaluationResultsPath(project)}/classification_metrics.json`, JSON.stringify(evaluationMetrics, null, 2), 'utf8');
    fs.writeFileSync(`${getEvaluationResultsPath(project)}/classification_check.json`, JSON.stringify(classificationResults, null, 2), 'utf8');
    console.log(`Detailed results saved in folder : ${getEvaluationResultsPath(project)}`);
}

function computeEvaluationMetrics(classificationResults) {
    let TP = 0, TN = 0, FP = 0, FN = 0;

    classificationResults.forEach(({ expected, found }) => {
        if (expected === 1 && found === 1) TP++;
        else if (expected === 0 && found === 0) TN++;
        else if (expected === 0 && found === 1) FP++;
        else if (expected === 1 && found === 0) FN++;
    });

    const total = TP + TN + FP + FN;

    const accuracy = (TP + TN) / total;
    const precision = TP + FP > 0 ? TP / (TP + FP) : 0;
    const recall = TP + FN > 0 ? TP / (TP + FN) : 0;
    const f1 = (precision + recall) > 0 ? 2 * (precision * recall) / (precision + recall) : 0;

    return {
        accuracy: (accuracy * 100).toFixed(2) + '%',
        precision: (precision * 100).toFixed(2) + '%',
        recall: (recall * 100).toFixed(2) + '%',
        f1Score: (f1 * 100).toFixed(2) + '%',
        rawCounts: { TP, TN, FP, FN }
    };
}


/**
 * Returns the path to the evaluation results folder for a given project.
 *
 * @param {string} project - Project name.
 * @returns {string} - Absolute path to the project's evaluation results.
 */
function getEvaluationResultsPath(project) {
    return path.join(__dirname, 'StaticAnalyzerNLP_DbClustering_EvalResults', project);
}

module.exports = {tagFilesWithHeuristics};