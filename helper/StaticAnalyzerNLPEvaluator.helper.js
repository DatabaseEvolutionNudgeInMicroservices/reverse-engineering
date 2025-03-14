const fs = require('fs');

const projectsGroundTruth = {
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


/**
 * Evaluates the correctness of file clustering tags by comparing them to the ground truth.
 * This function verifies if files classified are correctly tagged and calculates error percentages
 *
 * @param project {string} - The project name, used to retrieve the ground truth classification.
 * @param clusteredData {Array} - The array containing files with their assigned cluster.
 */
function evaluateFilesTags(project, clusteredData) {
    if (!projectsGroundTruth[project]) {
        throw new Error(`Project '${project}' is not supported for file tags evaluation`);
    }

    // Retrieve expected DB and API files from the ground truth
    const dbAndApiFiles = new Set([
        ...projectsGroundTruth[project]["expected_db_files"],
        ...projectsGroundTruth[project]["expected_api_files"]
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

module.exports = evaluateFilesTags;