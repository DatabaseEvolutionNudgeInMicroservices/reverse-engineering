// Imports

const fs = require('fs');

// Constants

//const EXPECTED_FILE = './evaluation/nlptr/identification/cinema-microservice/ground_truth.csv'; // TODO
//const ACTUAL_FILE = './evaluation/nlptr/identification/cinema-microservice/actual.json'; // TODO
//const EXPECTED_FILE = './evaluation/nlptr/identification/cloudboost/ground_truth.csv'; // TODO
//const ACTUAL_FILE = './evaluation/nlptr/identification/cloudboost/actual.json'; // TODO
//const EXPECTED_FILE = './evaluation/nlptr/identification/comments-api/ground_truth.csv'; // TODO
//const ACTUAL_FILE = './evaluation/nlptr/identification/comments-api/actual.json'; // TODO
const EXPECTED_FILE = './evaluation/nlptr/identification/overleaf/ground_truth.csv'; // TODO
const ACTUAL_FILE = './evaluation/nlptr/identification/overleaf/actual.json'; // TODO
//const EXPECTED_FILE = './evaluation/nlptr/identification/robot-shop/ground_truth.csv'; // TODO
//const ACTUAL_FILE = './evaluation/nlptr/identification/robot-shop/actual.json'; // TODO

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

function isOverlapped(x1, x2, y1, y2) {
    return Number.parseInt(x1) <= Number.parseInt(y2) && Number.parseInt(y1) <= Number.parseInt(x2);
}

// Evaluation

function precision_recall_f1() {

    try {

        let metadata = ACTUAL_FILE.match(
            new RegExp(/\.\/evaluation\/nlptr\/identification\/(\S+)\/actual.json/)
        );
        let system = metadata[1];
        const groundTruthResult = readCSV(EXPECTED_FILE);
        const actualResult =
            [...
                readJSON(ACTUAL_FILE)
                    .match(/"location":"([^"#]+)#L([0-9]+)L([0-9]+)"/g)
            ].map(i => JSON.parse("{" + i + "}"))
        let recallMatrix = {};
        let precisionMatrix = {};
        groundTruthResult.forEach(cf => recallMatrix[cf[0] + '#L' + cf[1] + 'L' + cf[3]] = 0);
        actualResult.forEach(cf => {
            let potentialCodeFragmentLL = cf.location.match(/([^"#]+)#L([0-9]+)L([0-9]+)/);
            precisionMatrix[potentialCodeFragmentLL[1] + '#L' + potentialCodeFragmentLL[2] + 'L' + potentialCodeFragmentLL[3]] = 0
        });
        let actualResultTruePositiveCount = 0;
        let actualResultFalseNegativeCount = 0;

        actualResult.forEach(potentialCodeFragment => {
            let potentialCodeFragmentLL = potentialCodeFragment.location.match(/([^"#]+)#L([0-9]+)L([0-9]+)/);
            let potentialCodeFragmentIdentifier = potentialCodeFragmentLL[1] + '#L' + potentialCodeFragmentLL[2] + 'L' + potentialCodeFragmentLL[3];
            let codeFragments = groundTruthResult.filter(codeFragment => {
                return codeFragment[0] === potentialCodeFragmentLL[1] && isOverlapped(codeFragment[1], codeFragment[3], potentialCodeFragmentLL[2], potentialCodeFragmentLL[3]);
            });
            if (codeFragments.length !== 0) {
                // True positive
                codeFragments.forEach(cf => {
                    let codeFragmentIdentifier = cf[0] + '#L' + cf[1] + 'L' + cf[3];
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

        console.log('Results in ' + system);
        console.log('Precision: ' + precision_normalized + '%');
        console.log('Recall: ' + recall_normalized + '%');
        console.log('F1: ' + f1_normalized + '%');
    } catch (err) {
        console.error('Error:', err);
    }
}

precision_recall_f1();
