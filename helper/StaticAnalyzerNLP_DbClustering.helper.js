const fs = require('fs');
const path = require('path');
const kmeans = require("ml-kmeans");


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
    },
    "wise-old-man-master": {
        "expected_db_files": [
            'server/__tests__/suites/integration/achievements.test.ts',
            'server/__tests__/suites/integration/competitions.test.ts',
            'server/__tests__/suites/integration/deltas.test.ts',
            'server/__tests__/suites/integration/efficiency.test.ts',
            'server/__tests__/suites/integration/general.test.ts',
            'server/__tests__/suites/integration/groups.test.ts',
            'server/__tests__/suites/integration/names.test.ts',
            'server/__tests__/suites/integration/patrons.test.ts',
            'server/__tests__/suites/integration/players.test.ts',
            'server/__tests__/suites/integration/records.test.ts',
            'server/src/api/modules/achievements/services/FindGroupAchievementsService.ts',
            'server/src/api/modules/achievements/services/FindPlayerAchievementProgressService.ts',
            'server/src/api/modules/achievements/services/FindPlayerAchievementsService.ts',
            'server/src/api/modules/achievements/services/ReevaluatePlayerAchievementsService.ts',
            'server/src/api/modules/competitions/competition.events.ts',
            'server/src/api/modules/competitions/services/AddParticipantsService.ts',
            'server/src/api/modules/competitions/services/AddTeamsService.ts',
            'server/src/api/modules/competitions/services/AddToGroupCompetitionsService.ts',
            'server/src/api/modules/competitions/services/CreateCompetitionService.ts',
            'server/src/api/modules/competitions/services/DeleteCompetitionService.ts',
            'server/src/api/modules/competitions/services/EditCompetitionService.ts',
            'server/src/api/modules/competitions/services/FetchCompetitionDetailsService.ts',
            'server/src/api/modules/competitions/services/FetchTop5ProgressService.ts',
            'server/src/api/modules/competitions/services/FindGroupCompetitionsService.ts',
            'server/src/api/modules/competitions/services/FindPlayerParticipationsService.ts',
            'server/src/api/modules/competitions/services/FindPlayerParticipationsStandings2Service.ts',
            'server/src/api/modules/competitions/services/RemoveFromGroupCompetitionsService.ts',
            'server/src/api/modules/competitions/services/RemoveParticipantsService.ts',
            'server/src/api/modules/competitions/services/RemoveTeamsService.ts',
            'server/src/api/modules/competitions/services/ResetCompetitionCodeService.ts',
            'server/src/api/modules/competitions/services/SearchCompetitionsService.ts',
            'server/src/api/modules/competitions/services/UpdateAllParticipantsService.ts',
            'server/src/api/modules/deltas/services/FindDeltaLeaderboardsService.ts',
            'server/src/api/modules/deltas/services/FindGroupDeltasService.ts',
            'server/src/api/modules/deltas/services/FindPlayerDeltasService.ts',
            'server/src/api/modules/efficiency/services/ComputeEfficiencyRankService.ts',
            'server/src/api/modules/efficiency/services/FindEfficiencyLeaderboardsService.ts',
            'server/src/api/modules/general/services/AllowUserActionsService.ts',
            'server/src/api/modules/general/services/BlockUserActionsService.ts',
            'server/src/api/modules/general/services/CreateAPIKeyService.ts',
            'server/src/api/modules/general/services/FetchTableCountsService.ts',
            'server/src/api/modules/groups/group.events.ts',
            'server/src/api/modules/groups/services/AddMembersService.ts',
            'server/src/api/modules/groups/services/ChangeMemberRoleService.ts',
            'server/src/api/modules/groups/services/CreateGroupService.ts',
            'server/src/api/modules/groups/services/DeleteGroupService.ts',
            'server/src/api/modules/groups/services/EditGroupService.ts',
            'server/src/api/modules/groups/services/FetchGroupActivityService.ts',
            'server/src/api/modules/groups/services/FetchGroupDetailsService.ts',
            'server/src/api/modules/groups/services/FetchGroupHiscoresService.ts',
            'server/src/api/modules/groups/services/FetchGroupStatisticsService.ts',
            'server/src/api/modules/groups/services/FetchMembersCSVService.ts',
            'server/src/api/modules/groups/services/FindPlayerMembershipsService.ts',
            'server/src/api/modules/groups/services/RemoveMembersService.ts',
            'server/src/api/modules/groups/services/ResetGroupCodeService.ts',
            'server/src/api/modules/groups/services/SearchGroupsService.ts',
            'server/src/api/modules/groups/services/UpdateAllMembersService.ts',
            'server/src/api/modules/groups/services/VerifyGroupService.ts',
            'server/src/api/modules/name-changes/services/ApproveNameChangeService.ts',
            'server/src/api/modules/name-changes/services/ClearNameChangeHistoryService.ts',
            'server/src/api/modules/name-changes/services/DenyNameChangeService.ts',
            'server/src/api/modules/name-changes/services/FetchNameChangeDetailsService.ts',
            'server/src/api/modules/name-changes/services/FindGroupNameChangesService.ts',
            'server/src/api/modules/name-changes/services/FindPlayerNameChangesService.ts',
            'server/src/api/modules/name-changes/services/SearchNameChangesService.ts',
            'server/src/api/modules/name-changes/services/SubmitNameChangeService.ts',
            'server/src/api/modules/patrons/services/ClaimPatreonBenefitsService.ts',
            'server/src/api/modules/players/player.router.ts',
            'server/src/api/modules/players/player.utils.ts',
            'server/src/api/modules/players/services/ArchivePlayerService.ts',
            'server/src/api/modules/players/services/AssertPlayerTypeService.ts',
            'server/src/api/modules/players/services/ChangePlayerCountryService.ts',
            'server/src/api/modules/players/services/CreateAnnotationService.ts',
            'server/src/api/modules/players/services/DeleteAnnotationService.ts',
            'server/src/api/modules/players/services/DeletePlayerService.ts',
            'server/src/api/modules/players/services/FetchPlayerDetailsService.ts',
            'server/src/api/modules/players/services/FindOrCreatePlayersService.ts',
            'server/src/api/modules/players/services/FindPlayerArchivesService.ts',
            'server/src/api/modules/players/services/ImportPlayerHistoryService.ts',
            'server/src/api/modules/players/services/SearchPlayersService.ts',
            'server/src/api/modules/players/services/UpdatePlayerService.ts',
            'server/src/api/modules/records/services/FindGroupRecordsService.ts',
            'server/src/api/modules/records/services/FindPlayerRecordsService.ts',
            'server/src/api/modules/records/services/FindRecordLeaderboardsService.ts',
            'server/src/api/modules/snapshots/services/FindGroupSnapshotsService.ts',
            'server/src/api/modules/snapshots/services/FindPlayerSnapshotsService.ts',
            'server/src/api/modules/snapshots/services/FindPlayerSnapshotTimelineService.ts',
            'server/src/api/modules/snapshots/services/RollbackCollectionLogService.ts',
            'server/src/api/modules/snapshots/services/RollbackSnapshotsService.ts',
            'server/src/api/services/external/discord.service.ts',
            'server/src/api/util/middlewares.ts',
            'server/src/jobs-new/handlers/assert-player-type.job.ts',
            'server/src/jobs-new/handlers/calculate-computed-rank-tables.job.ts',
            'server/src/jobs-new/handlers/check-creation-spam.job.ts',
            'server/src/jobs-new/handlers/check-inappropriate-content.job.ts',
            'server/src/jobs-new/handlers/check-player-banned.job.ts',
            'server/src/jobs-new/handlers/check-player-ranked.job.ts',
            'server/src/jobs-new/handlers/invalidate-deltas.job.ts',
            'server/src/jobs-new/handlers/review-name-change.job.ts',
            'server/src/jobs-new/handlers/schedule-banned-player-checks.job.ts',
            'server/src/jobs-new/handlers/schedule-competition-events.job.ts',
            'server/src/jobs-new/handlers/schedule-competition-score-updates.job.ts',
            'server/src/jobs-new/handlers/schedule-flagged-player-review.job.ts',
            'server/src/jobs-new/handlers/schedule-group-score-updates.job.ts',
            'server/src/jobs-new/handlers/schedule-name-change-reviews.job.ts',
            'server/src/jobs-new/handlers/schedule-patron-group-updates.job.ts',
            'server/src/jobs-new/handlers/schedule-patron-player-updates.job.ts',
            'server/src/jobs-new/handlers/sync-api-keys.job.ts',
            'server/src/jobs-new/handlers/sync-patrons.job.ts',
            'server/src/jobs-new/handlers/sync-player-achievements.job.ts',
            'server/src/jobs-new/handlers/sync-player-competition-participations.job.ts',
            'server/src/jobs-new/handlers/sync-player-deltas.job.ts',
            'server/src/jobs-new/handlers/sync-player-records.job.ts',
            'server/src/jobs-new/handlers/update-competition-score.job.ts',
            'server/src/jobs-new/handlers/update-group-score.job.ts',
            'server/src/jobs-new/handlers/update-player.job.ts',
            'server/src/prisma/index.ts'
        ],
        "expected_api_files": [
            "server/src/api/routing.ts",
            "server/src/api/modules/competitions/competition.router.ts",
            "server/src/api/modules/deltas/delta.router.ts",
            "server/src/api/modules/efficiency/efficiency.router.ts",
            "server/src/api/modules/general/general.router.ts",
            "server/src/api/modules/groups/group.router.ts",
            "server/src/api/modules/name-changes/name-change.router.ts",
            "server/src/api/modules/patrons/patron.router.ts",
            "server/src/api/modules/players/player.router.ts",
            "server/src/api/modules/records/record.router.ts"
        ]
    },
    "postiz-app-main": {
        "expected_db_files": [
            "libraries/nestjs-libraries/src/database/prisma/agencies/agencies.repository.ts",
            "libraries/nestjs-libraries/src/database/prisma/autopost/autopost.repository.ts",
            "libraries/nestjs-libraries/src/database/prisma/integrations/integration.repository.ts",
            "libraries/nestjs-libraries/src/database/prisma/marketplace/item.user.repository.ts",
            "libraries/nestjs-libraries/src/database/prisma/marketplace/messages.repository.ts",
            "libraries/nestjs-libraries/src/database/prisma/media/media.repository.ts",
            "libraries/nestjs-libraries/src/database/prisma/notifications/notifications.repository.ts",
            "libraries/nestjs-libraries/src/database/prisma/organizations/organization.repository.ts",
            "libraries/nestjs-libraries/src/database/prisma/posts/posts.repository.ts",
            "libraries/nestjs-libraries/src/database/prisma/signatures/signature.repository.ts",
            "libraries/nestjs-libraries/src/database/prisma/stars/stars.repository.ts",
            "libraries/nestjs-libraries/src/database/prisma/subscriptions/subscription.repository.ts",
            "libraries/nestjs-libraries/src/database/prisma/users/users.repository.ts",
            "libraries/nestjs-libraries/src/database/prisma/webhooks/webhooks.repository.ts"
        ],
        "expected_api_files": [
            "apps/backend/src/api/routes/agencies.controller.ts",
            "apps/backend/src/api/routes/analytics.controller.ts",
            "apps/backend/src/api/routes/auth.controller.ts",
            "apps/backend/src/api/routes/autopost.controller.ts",
            "apps/backend/src/api/routes/billing.controller.ts",
            "apps/backend/src/api/routes/copilot.controller.ts",
            "apps/backend/src/api/routes/integrations.controller.ts",
            "apps/backend/src/api/routes/marketplace.controller.ts",
            "apps/backend/src/api/routes/mcp.controller.ts",
            "apps/backend/src/api/routes/media.controller.ts",
            "apps/backend/src/api/routes/messages.controller.ts",
            "apps/backend/src/api/routes/notifications.controller.ts",
            "apps/backend/src/api/routes/posts.controller.ts",
            "apps/backend/src/api/routes/public.controller.ts",
            "apps/backend/src/api/routes/root.controller.ts",
            "apps/backend/src/api/routes/settings.controller.ts",
            "apps/backend/src/api/routes/signature.controller.ts",
            "apps/backend/src/api/routes/stripe.controller.ts",
            "apps/backend/src/api/routes/users.controller.ts",
            "apps/backend/src/api/routes/webhooks.controller.ts",
            "apps/backend/src/public-api/routes/v1/public.integrations.controller.ts",
            "apps/workers/src/app/plugs.controller.ts",
            "apps/workers/src/app/posts.controller.ts",
            "apps/workers/src/app/stars.controller.ts"
        ]
    }
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
function tagFilesFullyAutomated(element, refinedResults, bestConcepts) {
    return tagFiles(element, refinedResults, {data_concepts: bestConcepts.map(x => x.concept).slice(0, 30)}, getEvaluationResultsPath(element, true));
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
function tagFilesSemiAutomated(element, refinedResults, dbDetails) {
    return tagFiles(element, refinedResults, dbDetails, getEvaluationResultsPath(element, false));
}

/**
 * Tags each file in the analysis results as DB-related using heuristics,
 * writes the clustering results to a file, and evaluates the tagging accuracy.
 *
 * @param {string} element - The repository name, used for evaluation.
 * @param {Array} refinedResults - Array of files with token metadata.
 * @param {Object} dataConcepts - List of database-related concepts and optionnally anchor points concepts.
 * @param {string} evaluationResultsPath - The evaluation results directory path
 * @returns {Array} The tagged analysis results with cluster values.
 */
function tagFiles(element, refinedResults, dataConcepts, evaluationResultsPath) {
    // Ensure that the directory for storing evaluation results exists
    if (!fs.existsSync(evaluationResultsPath)) {
        fs.mkdirSync(evaluationResultsPath, {recursive: true});
    }

    // Tag the files using clustering heuristics based on database concepts and save results
    const refinedAnalysisResultsWithTags = tagFilesByClusteringWithHeuristics(refinedResults, dataConcepts);
    fs.writeFileSync(`${evaluationResultsPath}/clustering_results.json`, JSON.stringify(refinedAnalysisResultsWithTags, null, 2), 'utf8');

    // If ground truth data is available for the project, evaluate the tagging results
    if (Object.keys(projectsGroundTruthForEvaluation).includes(element)) {
        evaluateFilesTags(element, refinedAnalysisResultsWithTags, evaluationResultsPath)
    }

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
function tagFilesByClusteringWithHeuristics(refinedResults, dbDetails) {
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
 *
 *
 * EVALUATION
 *
 *
 *
 */


/**
 * Evaluates the correctness of file clustering tags by comparing them to the ground truth.
 * This function verifies if files classified as "DB" or "API" are correctly tagged
 * and calculates error percentages for overall files, JavaScript files, and ground truth files.
 *
 * @param {string} project - The project name, used to retrieve the ground truth classification.
 * @param {Array} clusteredData - The array containing files with their assigned cluster (-1 = No Tokens, 0 = Other, 1 = DB/API).
 * @param {string} evaluationResultsPath - The path where the evaluation results should be saved.
 */
function evaluateFilesTags(project, clusteredData, evaluationResultsPath) {
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
                ? {file: normalizedPath, expected: isDBorAPI, found: cluster, status: '❌ Incorrect (false negative)'}
                : {file: normalizedPath, expected: cluster, found: cluster, status: '✅ Correct'};
        } else {
            return cluster !== isOther
                ? {file: normalizedPath, expected: isOther, found: cluster, status: '❌ Incorrect (false positive)'}
                : {file: normalizedPath, expected: cluster, found: cluster, status: '✅ Correct'};
        }
    }

    // Evaluate classification for all files
    const classificationResults = clusteredData.map(({file, cluster}) => checkFileClassification(file, cluster));

    // Compute evaluation metrics
    const evaluationMetrics = computeEvaluationMetrics(classificationResults);

    // Save detailed results
    fs.writeFileSync(`${evaluationResultsPath}/classification_metrics.json`, JSON.stringify(evaluationMetrics, null, 2), 'utf8');
    fs.writeFileSync(`${evaluationResultsPath}/classification_check.json`, JSON.stringify(classificationResults, null, 2), 'utf8');
    console.log(`Detailed results saved in folder : ${evaluationResultsPath}`);
}

/**
 * Computes evaluation metrics
 * based on classification results comparing predicted and expected labels.
 *
 * @param {Array<Object>} classificationResults - List of classification results, each containing:
 *   - expected {number} Expected label (0 or 1)
 *   - found {number} Predicted label (0 or 1)
 *
 * @returns {Object} An object containing:
 *   - accuracy {string} Proportion of correctly classified samples among all samples (as a percentage).
 *   - precision {string} Proportion of true positives among all predicted positives (as a percentage).
 *   - recall {string} Proportion of true positives among all actual positives (as a percentage).
 *   - f1Score {string} Harmonic mean of precision and recall, balancing both (as a percentage).
 *   - rawCounts {Object} Raw counts of:
 *     - TP {number} True Positives
 *     - TN {number} True Negatives
 *     - FP {number} False Positives
 *     - FN {number} False Negatives
 */
function computeEvaluationMetrics(classificationResults) {
    let TP = 0, TN = 0, FP = 0, FN = 0;

    classificationResults.forEach(({expected, found}) => {
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
        rawCounts: {TP, TN, FP, FN}
    };
}


/**
 * Returns the path to the evaluation results folder for a given project.
 *
 * @param {string} project - Project name.
 * @param {boolean} fullyAutomated - Evaluation is for fully automated tag files mode
 * @returns {string} - Absolute path to the project's evaluation results.
 */
function getEvaluationResultsPath(project, fullyAutomated) {
    return path.join(__dirname, 'StaticAnalyzerNLP_DbClustering_EvalResults', fullyAutomated ? 'FullyAutomated' : 'SemiAutomated', project);
}

module.exports = {tagFilesSemiAutomated, tagFilesFullyAutomated};