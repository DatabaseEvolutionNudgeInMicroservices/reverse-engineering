// Imports

const fs = require('fs');
const readline = require('readline');

const EXPECTED_FILE = './evaluation/3-expected-overleaf.csv'; // TODO
const ACTUAL_FILE = './evaluation/4-actual-overleaf.csv'; // TODO
//const EXPECTED_FILE = './evaluation/3-expected-comments-api.csv'; // TODO
//const ACTUAL_FILE = './evaluation/4-actual-comments-api.csv'; // TODO
//const EXPECTED_FILE = './evaluation/3-expected-cinema-microservice.csv'; // TODO
//const ACTUAL_FILE = './evaluation/4-actual-cinema-microservice.csv'; // TODO
//const EXPECTED_FILE = './evaluation/3-expected-robot-shop.csv'; // TODO
//const ACTUAL_FILE = './evaluation/4-actual-robot-shop.csv'; // TODO
//const EXPECTED_FILE = './evaluation/3-expected-cloudboost.csv'; // TODO
//const ACTUAL_FILE = './evaluation/4-actual-cloudboost.csv'; // TODO

// Evaluations

precision_recall_heuristics_actual(); // TODO. NOTE: with score > 0.
//precision_recall_min_score_actual(); // TODO

// Utils

function read(file) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(file)) {
            let result = []
            const stream = fs.createReadStream(file);
            const reader = readline.createInterface({input: stream});
            reader.on('line', (line) => {
                let currentLine = line.slice(1, -1);
                currentLine = currentLine.split('",');
                currentLine = currentLine.map(part => part.replaceAll('"', ''));
                result.push(currentLine);
            });
            reader.on('close', () => {
                resolve(result);
            });
        } else {
            reject('File not found');
        }
    });
}

function count(array) {
    return array.reduce((acc, item) => {
        if (acc[item]) {
            acc[item]++;
        } else {
            acc[item] = 1;
        }
        return acc;
    }, {});
}

function getProperty(property, object) {
    if (!object.hasOwnProperty(property)) {
        return 0;
    } else {
        return object[property];
    }
}

// Score precision and recall

function precision_recall_min_score_actual() {

    let filters = ['javascript-api-express', 'javascript-db-mongo', 'javascript-db-redis'];
    let groundTruth = [];
    let groundTruthFiltered = [];
    let evaluationResult = [];
    let evaluationResultFiltered = [];
    let evaluationResultTruePositive = [];
    let evaluationResultFalsePositive = [];

    read(EXPECTED_FILE).then(result => {

        groundTruth = result;

        read(ACTUAL_FILE).then(result => {

            evaluationResult = result;

            filters.forEach(filter => {
                evaluationResultFiltered = evaluationResult.filter(test => test[0] === filter);
                groundTruthFiltered = groundTruth.filter(truth => truth[0] === filter);
                evaluationResultFiltered.forEach(test => {
                    if (groundTruthFiltered.find(truth => truth.toString() === test.toString())) {
                        evaluationResultTruePositive.push(test);
                    } else {
                        evaluationResultFalsePositive.push(test);
                    }
                });
                console.log('Results for ' + filter);
                console.log('# Ground truth: ' + groundTruthFiltered.length);
                console.log('# Evaluation: ' + evaluationResultFiltered.length);
                console.log('# Evaluation TP: ' + evaluationResultTruePositive.length);
                console.log('# Evaluation FP: ' + evaluationResultFalsePositive.length);
                console.log('Precision: ' + (evaluationResultTruePositive.length / (evaluationResultTruePositive.length + evaluationResultFalsePositive.length)));
                console.log('Recall: ' + (evaluationResultTruePositive.length / groundTruthFiltered.length));
                console.log();
                evaluationResultTruePositive = [];
                evaluationResultFalsePositive = [];
            });
        });
    });
}

// Heuristics precision and recall

function precision_recall_heuristics_actual() {

    let filters = ['javascript-api-express', 'javascript-db-mongo', 'javascript-db-redis'];
    let groundTruth = [];
    let groundTruthFiltered = [];
    let groundTruthTruePositive = [];
    let evaluationResult = [];
    let evaluationResultFiltered = [];
    let evaluationResultTruePositive = [];
    let evaluationResultFalsePositive = [];

    read(EXPECTED_FILE).then(result => {

        groundTruth = result;
        groundTruth.forEach(test => {
            let heuristics = test[3].split(';;')[5].match(/(E|M|R)\d/g);
            groundTruthTruePositive = groundTruthTruePositive.concat(heuristics);
        });

        read(ACTUAL_FILE).then(result => {

            evaluationResult = result;

            filters.forEach(filter => {
                evaluationResultFiltered = evaluationResult.filter(test => test[0] === filter);
                groundTruthFiltered = groundTruth.filter(truth => truth[0] === filter);
                evaluationResultFiltered.forEach(test => {
                    let heuristics = test[3].split(';;')[5].match(/(E|M|R)\d/g);
                    if (groundTruthFiltered.find(truth => truth.toString() === test.toString())) {
                        evaluationResultTruePositive = evaluationResultTruePositive.concat(heuristics);
                    } else {
                        evaluationResultFalsePositive = evaluationResultFalsePositive.concat(heuristics);
                    }
                });

                console.log('Results for ' + filter);

                console.log('# Evaluation TP:');
                let countEvaluationTruePositive = count(evaluationResultTruePositive);
                console.log(countEvaluationTruePositive);

                console.log('# Evaluation FP:');
                let countEvaluationFalsePositive = count(evaluationResultFalsePositive);
                console.log(countEvaluationFalsePositive);

                let countGroundTruthTruePositive = count(groundTruthTruePositive);
                for (let h in countGroundTruthTruePositive) {
                    console.log('Precision : ' + h + '= ' + getProperty(h, countEvaluationTruePositive) / (getProperty(h, countEvaluationTruePositive) + getProperty(h, countEvaluationFalsePositive)));
                    console.log('Recall : ' + h + '= ' + getProperty(h, countEvaluationTruePositive) / groundTruthFiltered.length);
                }

                console.log();

                evaluationResultTruePositive = [];
                evaluationResultFalsePositive = [];
            });
        });
    });
}