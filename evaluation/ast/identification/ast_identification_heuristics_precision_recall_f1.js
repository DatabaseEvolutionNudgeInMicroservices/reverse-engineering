// Imports

const fs = require('fs');
const readline = require('readline');

// Constants

//const EXPECTED_FILE = './evaluation/ast/identification/cinema-microservice/ground_truth.csv'; // TODO
//const ACTUAL_FILE = './evaluation/ast/identification/cinema-microservice/actual.csv'; // TODO
//const EXPECTED_FILE = './evaluation/ast/identification/cloudboost/ground_truth.csv'; // TODO
//const ACTUAL_FILE = './evaluation/ast/identification/cloudboost/actual.csv'; // TODO
//const EXPECTED_FILE = './evaluation/ast/identification/comments-api/ground_truth.csv'; // TODO
//const ACTUAL_FILE = './evaluation/ast/identification/comments-api/actual.csv'; // TODO
const EXPECTED_FILE = './evaluation/ast/identification/overleaf/ground_truth.csv'; // TODO
const ACTUAL_FILE = './evaluation/ast/identification/overleaf/actual.csv'; // TODO
//const EXPECTED_FILE = './evaluation/ast/identification/robot-shop/ground_truth.csv'; // TODO
//const ACTUAL_FILE = './evaluation/ast/identification/robot-shop/actual.csv'; // TODO
let SCORE_MIN = 1; // TODO

// Utils

function readCSV(file) {
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

// Evaluation

function precision_recall_f1() {

    let filters = ['javascript-api-express-call', 'javascript-db-mongo-call', 'javascript-db-redis-call'];
    let groundTruthResult = [];
    let groundTruthResultFiltered = [];
    let actualResult = [];
    let actualResultFiltered = [];
    let actualResultTruePositive = [];
    let actualResultFalsePositive = [];

    readCSV(EXPECTED_FILE).then(result => {

        groundTruthResult = result;

        readCSV(ACTUAL_FILE).then(result => {

            actualResult = result;
            let metadata = ACTUAL_FILE.match(
                new RegExp(/\.\/evaluation\/ast\/identification\/(\S+)\/actual.csv/)
            );
            let system = metadata[1];

            filters.forEach(filter => {
                actualResultFiltered = actualResult.filter(test => test[0] === filter && Number.parseInt(test[1].split(';;')[4]) >= SCORE_MIN);
                groundTruthResultFiltered = groundTruthResult.filter(truth => truth[0] === filter);
                actualResultFiltered.forEach(test => {
                    if (groundTruthResultFiltered.find(truth => truth.toString() === test.toString())) {
                        // True positive
                        actualResultTruePositive.push(test);
                    } else {
                        // False positive
                        actualResultFalsePositive.push(test);
                    }
                });

                let precision = actualResultTruePositive.length / (actualResultTruePositive.length + actualResultFalsePositive.length);
                let precision_normalized = (precision * 100).toFixed(2);
                let recall = actualResultTruePositive.length / groundTruthResultFiltered.length;
                let recall_normalized = (recall * 100).toFixed(2);
                let f1 = 2 * ((precision * recall) / (precision + recall));
                let f1_normalized = (f1 * 100).toFixed(2);

                console.log('Results for ' + filter + ' in ' + system + ' with minimum score of ' + SCORE_MIN);
                console.log('Precision: ' + precision_normalized + '%');
                console.log('Recall: ' + recall_normalized + '%');
                console.log('F1: ' + f1_normalized + '%');

                actualResultTruePositive = [];
                actualResultFalsePositive = [];
            });
        });
    });
}

precision_recall_f1();