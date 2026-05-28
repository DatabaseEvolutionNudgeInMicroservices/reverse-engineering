// Imports

const fs = require('fs');
const readline = require('readline');

// Constants

const FILES_ACTUAL = [
    './evaluation/ast/identification/cinema-microservice/actual.csv',
    './evaluation/ast/identification/cloudboost/actual.csv',
    './evaluation/ast/identification/comments-api/actual.csv',
    './evaluation/ast/identification/overleaf/actual.csv',
    './evaluation/ast/identification/robot-shop/actual.csv'
]

const FILES_EXPECTED = [
    './evaluation/ast/identification/cinema-microservice/ground_truth.csv',
    './evaluation/ast/identification/cloudboost/ground_truth.csv',
    './evaluation/ast/identification/comments-api/ground_truth.csv',
    './evaluation/ast/identification/overleaf/ground_truth.csv',
    './evaluation/ast/identification/robot-shop/ground_truth.csv'
]

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

function frequency() {
    let frequencies = {};
    let promises = []
    FILES_ACTUAL.forEach((file, i) => {
        promises.push(new Promise((resolve, reject) => {
            try {
                readCSV(FILES_EXPECTED[i]).then(expectedContent => {
                    readCSV(file).then(actualContent => {
                        actualContent.forEach(line => {
                            if (JSON.stringify(expectedContent).includes(JSON.stringify(line))) {
                                let type = line[0];
                                let heuristics = line[1].split(';;')[5].match(/(E|M|R)\d/g);
                                if (!frequencies[type]) {
                                    frequencies[type] = {heuristics: {}, count: 1}
                                }
                                frequencies[type]['count'] = frequencies[type]['count'] + 1
                                heuristics.forEach(heuristic => {
                                    if (frequencies[type]['heuristics'][heuristic]) {
                                        frequencies[type]['heuristics'][heuristic] = frequencies[type]['heuristics'][heuristic] + 1
                                    } else {
                                        frequencies[type]['heuristics'][heuristic] = 1
                                    }
                                })
                            }
                        })
                        resolve(true)
                    });
                })
            } catch (error) {
                reject(error.message)
            }
        }))
    });

    Promise.all(promises).then(resolveAll => {
            Object.keys(frequencies).forEach(key => {
                Object.keys((frequencies[key]['heuristics'])).forEach(subkey => {
                    frequencies[key]['heuristics'][subkey] = ((frequencies[key]['heuristics'][subkey] / frequencies[key]['count']) * 100).toFixed(2);
                })
            })
            console.log('Results across all systems');
            console.log(frequencies);
        }
    ).catch(rejectAll =>
        console.log(rejectAll)
    )
}

frequency();