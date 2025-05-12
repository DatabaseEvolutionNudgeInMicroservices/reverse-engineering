const fs = require('fs');
const path = require('path');
const {projectsGroundTruthForFileTaggingEvaluation, projectsGroundTruthForConceptPipelineExtractionEvaluation} = require("./ground_truth");


/**
 *
 *
 * EVALUATION CONCEPT EXTRACTION PIPELINE
 *
 *
 *
 */

function evaluateConceptExtractionPipeline(project, bestConceptsSortedNameOnly, extractConceptsFunction) {
    const groundTruthRaw = projectsGroundTruthForConceptPipelineExtractionEvaluation[project].join(" ");
    const groundTruthNormalized = extractConceptsFunction(groundTruthRaw)
        .flatMap(concept => concept.split(" "));
    const groundTruthSet = new Set(groundTruthNormalized);

    const intersection = [...new Set(
        bestConceptsSortedNameOnly.filter(concept => groundTruthSet.has(concept))
    )];
    const difference = [...new Set(
        groundTruthNormalized.filter(concept => !bestConceptsSortedNameOnly.includes(concept))
    )];

    console.log("Common concepts:", intersection);
    console.log("Missing concepts:", difference);
    console.log(`Coverage score: ${intersection.length}/${groundTruthSet.size}`);

    const indexedConcepts = Object.fromEntries(
        bestConceptsSortedNameOnly.map((concept, index) => [concept, index + 1])
    );

    const matchedConcepts = bestConceptsSortedNameOnly.filter(concept => intersection.includes(concept));
    const bestRanked = matchedConcepts[0];
    const worstRanked = matchedConcepts.at(-1);

    if (matchedConcepts.length > 0) {
        console.log(`Best ranked concept position: ${indexedConcepts[bestRanked]} out of ${bestConceptsSortedNameOnly.length}`);
        console.log(`Worst ranked concept position: ${indexedConcepts[worstRanked]} out of ${bestConceptsSortedNameOnly.length}`);
    } else {
        console.log("No common concepts found.");
    }
}








/**
 *
 *
 * EVALUATION FILE TAGGING
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
 * @param {string} taggingMode - Fully automated or semi-automated with(out) anchors tag files mode
 */
function evaluateFilesTags(project, clusteredData, taggingMode) {
    if (!projectsGroundTruthForFileTaggingEvaluation[project]) {
        throw new Error(`Project '${project}' is not supported for file tags evaluation`);
    }

    // Ensure that the directory for storing evaluation results exists
    const evaluationResultsPath = getFileTaggingEvaluationResultsPath(project, taggingMode);
    if (!fs.existsSync(evaluationResultsPath)) {
        fs.mkdirSync(evaluationResultsPath, {recursive: true});
    }

    // Retrieve expected DB and API files from the ground truth
    const dbAndApiFiles = new Set([
        ...projectsGroundTruthForFileTaggingEvaluation[project]["expected_db_files"],
        ...projectsGroundTruthForFileTaggingEvaluation[project]["expected_api_files"]
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
    fs.writeFileSync(`${evaluationResultsPath}/clustering_results.json`, JSON.stringify(clusteredData, null, 2), 'utf8');
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
 * @param {string} tagging_mode - Evaluation is for fully automated or semi-automated with(out) anchors tag files mode
 * @returns {string} - Absolute path to the project's evaluation results.
 */
function getFileTaggingEvaluationResultsPath(project, tagging_mode) {
    switch (tagging_mode) {
        case "fully_automated":
            return path.join(__dirname, 'eval_file_tagging_results', 'fully_automated', project);
        case "semi_automated_without_anchors":
            return path.join(__dirname, 'eval_file_tagging_results', 'semi_automated_without_anchors', project);
        case "semi_automated_with_anchors":
            return path.join(__dirname, 'eval_file_tagging_results', 'semi_automated_with_anchors', project);
        default:
            console.error("Tagging mode unknown when evaluating")
    }
}



module.exports = {evaluateConceptExtractionPipeline, evaluateFilesTags};