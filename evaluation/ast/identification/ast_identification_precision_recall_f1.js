// Imports

const fs = require('fs');

// Constants

//const EXPECTED_FILE = './evaluation/ast/identification/cinema-microservice/ground_truth.csv'; // TODO
//const ACTUAL_FILE = './evaluation/ast/identification/cinema-microservice/actual.json'; // TODO
//const EXPECTED_FILE = './evaluation/ast/identification/cloudboost/ground_truth.csv'; // TODO
//const ACTUAL_FILE = './evaluation/ast/identification/cloudboost/actual.json'; // TODO
//const EXPECTED_FILE = './evaluation/ast/identification/comments-api/ground_truth.csv'; // TODO
//const ACTUAL_FILE = './evaluation/ast/identification/comments-api/actual.json'; // TODO
const EXPECTED_FILE = './evaluation/ast/identification/overleaf/ground_truth.csv'; // TODO
const ACTUAL_FILE = './evaluation/ast/identification/overleaf/actual.json'; // TODO
//const EXPECTED_FILE = './evaluation/ast/identification/robot-shop/ground_truth.csv'; // TODO
//const ACTUAL_FILE = './evaluation/ast/identification/robot-shop/actual.json'; // TODO
let SCORE_MIN = 3; // TODO

// Utils

function readCSV(file) {
    return fs
        .readFileSync(file, 'utf8')
        .split(/\r?\n/)
        .filter(line => line.trim() !== '')
        .map(line => {
            return line
                .slice(1, -1)
                .split('",')
                .map(part => part.replaceAll('"', ''));
        });
}

function readJSON(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

// Evaluation

function precision_recall_f1() {

    try {

        let metadata = ACTUAL_FILE.match(
            new RegExp(/\.\/evaluation\/ast\/identification\/(\S+)\/actual(\+?).json/)
        );
        let system = metadata[1];
        const groundTruthResult = readCSV(EXPECTED_FILE);
        const actualResult =
            [...
                readJSON(ACTUAL_FILE)
                    .match(/\{"location":"([^"#]+)#L([0-9]+)C([0-9]+)-L([0-9]+)C([0-9]+)"(?:(?!"score").)*"score":"([0-9]+)"\}/g)
            ].map(i => JSON.parse(i)).filter(i => Number.parseInt(i.score) >= SCORE_MIN)
        let recallMatrix = {};
        let precisionMatrix = {};
        groundTruthResult.forEach(cf => {
            recallMatrix[cf[2] + '#L' + cf[3] + 'C' + cf[4] + '-L' + cf[5] + 'C' + cf[6]] = 0
        });
        actualResult.forEach(cf => {
            let potentialCodeFragmentLCLC = cf.location.match(/([^"#]+)#L([0-9]+)C([0-9]+)-L([0-9]+)C([0-9]+)/);
            precisionMatrix[potentialCodeFragmentLCLC[1] + '#L' + potentialCodeFragmentLCLC[2] + 'C' + potentialCodeFragmentLCLC[3] + '-L' + potentialCodeFragmentLCLC[4] + 'C' + potentialCodeFragmentLCLC[5]] = 0
        });
        let actualResultTruePositiveCount = 0;
        let actualResultFalseNegativeCount = 0;

        actualResult.forEach(potentialCodeFragment => {
            let potentialCodeFragmentLCLC = potentialCodeFragment.location.match(/([^"#]+)#L([0-9]+)C([0-9]+)-L([0-9]+)C([0-9]+)/);
            let potentialCodeFragmentIdentifier = potentialCodeFragmentLCLC[1] + '#L' + potentialCodeFragmentLCLC[2] + 'C' + potentialCodeFragmentLCLC[3] + '-L' + potentialCodeFragmentLCLC[4] + 'C' + potentialCodeFragmentLCLC[5];
            let codeFragments = groundTruthResult.filter(codeFragment => {
                return codeFragment[0] === potentialCodeFragment.technology.id
                    && codeFragment[2] === potentialCodeFragmentLCLC[1]
                    && codeFragment[3] === potentialCodeFragmentLCLC[2]
                    && codeFragment[4] === potentialCodeFragmentLCLC[3]
                    && codeFragment[5] === potentialCodeFragmentLCLC[4]
                    && codeFragment[6] === potentialCodeFragmentLCLC[5];
            });
            if (codeFragments.length !== 0) {
                // True positive
                codeFragments.forEach(cf => {
                    let codeFragmentIdentifier = cf[2] + '#L' + cf[3] + 'C' + cf[4] + '-L' + cf[5] + 'C' + cf[6];
                    recallMatrix[codeFragmentIdentifier] =
                        recallMatrix[codeFragmentIdentifier] + 1;
                });
                if (Object.keys(precisionMatrix).includes(potentialCodeFragmentIdentifier)) {
                    precisionMatrix[potentialCodeFragmentIdentifier] = 1;
                }
            } else {
                // False positive
                //console.log(potentialCodeFragmentIdentifier);
            }
        })

        Object.keys(precisionMatrix).forEach(codeFragmentPath => {
            // True positive
            if (precisionMatrix[codeFragmentPath] === 1) {
                actualResultTruePositiveCount++;
            }
        });

        Object.keys(recallMatrix).forEach(codeFragmentPath => {
            // False negative
            if (recallMatrix[codeFragmentPath] === 0) {
                actualResultFalseNegativeCount++;
                //console.log(codeFragmentPath);
            }
        });

        let precision = actualResultTruePositiveCount / actualResult.length;
        let precision_normalized = (precision * 100).toFixed(2);
        let recall = actualResultTruePositiveCount / (actualResultTruePositiveCount + actualResultFalseNegativeCount);
        let recall_normalized = (recall * 100).toFixed(2);
        let f1 = 2 * ((precision * recall) / (precision + recall));
        let f1_normalized = (f1 * 100).toFixed(2);

        console.log('Results in ' + system + ' with minimum score of ' + SCORE_MIN);
        console.log('Precision: ' + precision_normalized + '%');
        console.log('Recall: ' + recall_normalized + '%');
        console.log('F1: ' + f1_normalized + '%');
    } catch (err) {
        console.error('Error:', err);
    }
}

precision_recall_f1();