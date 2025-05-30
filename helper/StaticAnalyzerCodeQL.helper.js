// Constants

const {
  FILE_SYSTEM_SEPARATOR,
  TEMP_FOLDER_NAME,
  CODEQL_FOLDER_NAME_SUFFIX,
  QUERY_FOLDER_NAME,
  RESULT_FOLDER_NAME,
  RESULT_FILE_NAME,
  LANGUAGES_SUPPORTED
} = require('./Constant.helper.js')

// Error

const BadFormat = require('../error/BadFormat.error.js')
const AnalysisFail = require('../error/AnalysisFail.error.js')
const { INPUT_INCORRECTLY_FORMATTED } = require('../error/Constant.error.js')

// Model

const CodeFragment = require('../model/CodeFragment.model')
const Repository = require('../model/Repository.model')
const Directory = require('../model/Directory.model')
const File = require('../model/File.model')
const Technology = require('../model/Technology.model')
const Operation = require('../model/Operation.model')
const Method = require('../model/Method.model')
const Sample = require('../model/Sample.model')
const Concept = require('../model/Concept.model')

// Helpers

const StaticAnalyzer = require('./StaticAnalyzer.helper.js')

// Libraries : Child Process

const { exec } = require('node:child_process')

// Libraries : File System

const fs = require('fs')
const readline = require('readline')

// Libraries : sloc

const sloc = require('sloc')

// Libraries : Wink

const winkNLP = require('wink-nlp')
const model = require('wink-eng-lite-web-model')
const winkNLPLemmatizer = require('wink-lemmatizer')

// Libraries : Natural

const natural = require('natural')

// Configuration : Wink

const nlp = winkNLP(model)
const its = nlp.its
const as = nlp.as
const patterns = [{ name: 'concept', patterns: ['NOUN', 'PROPN'] }] // Concepts are usually represented as nouns or proper nouns.
nlp.learnCustomEntities(patterns)

// Configuration : Natural

let TfIdf = natural.TfIdf

/**
 * @overview This class represents the CodeQL static analyzer.
 */
class StaticAnalyzerCodeQL extends StaticAnalyzer {
  /**
   * Instantiates a CodeQL static analyzer.
   */
  constructor() {
    super()
  }

  /**
   * Initializes an analysis by list.
   * @param list {[String]} The given list.
   * @param language {String} The targeted language by the analysis.
   * @param destination {String} The destination.
   * @returns {Promise} A promise for the preparation.
   */
  initializesByList(list, language, destination) {
    return new Promise((resolveAll, rejectAll) => {
      if (
        list !== undefined &&
        list !== null &&
        list.length !== 0 &&
        language !== undefined &&
        language !== null &&
        language !== '' &&
        LANGUAGES_SUPPORTED.includes(language)
      ) {
        let promises = []
        list.forEach((element) => {
          promises.push(
            new Promise((resolve, reject) => {
              this.initializesByElement(element, language, destination)
                .then((result) => {
                  resolve(result)
                })
                .catch((error) => {
                  reject(new AnalysisFail(error.message))
                })
            })
          )
        })
        Promise.all(promises)
          .then((resultsAll) => {
            resolveAll(resultsAll)
          })
          .catch((errorAll) => {
            rejectAll(errorAll)
          })
      } else {
        rejectAll(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
      }
    })
  }

  /**
   * Initializes an analysis by element.
   * @param element {String} The given element.
   * @param language {String} The targeted language by the analysis.
   * @param destination {String} The destination.
   * @returns {Promise} A promise for the preparation.
   */
  initializesByElement(element, language, destination) {
    return new Promise((resolve, reject) => {
      if (
        element !== undefined &&
        element !== null &&
        element.length !== 0 &&
        language !== undefined &&
        language !== null &&
        language !== '' &&
        LANGUAGES_SUPPORTED.includes(language)
      ) {
        let repositoryFolder = this.getRepositoryFolder(element, destination)
        let codeQLRepositoryFolder = this.getCodeQLRepositoryFolder(element, destination)

        // 2. Initialization

        try {
          // CodeQL Database
          exec(
            '.' +
              FILE_SYSTEM_SEPARATOR +
              'lib' +
              FILE_SYSTEM_SEPARATOR +
              'codeql-cli' +
              FILE_SYSTEM_SEPARATOR +
              'codeql database create --language=' +
              language +
              ' --source-root' +
              ' ' +
              repositoryFolder +
              ' ' +
              codeQLRepositoryFolder,
            { maxBuffer: 1024 * 1000 * 500 },
            (error, stdout, stderr) => {
              if (error) {
                reject(new AnalysisFail(error.message))
              } else {
                fs.mkdirSync(this.getResultCodeQLRepositoryFolder(element, destination))
                resolve(element)
              }
            }
          )
        } catch (error) {
          reject(new AnalysisFail(error.message))
        }
      } else {
        reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
      }
    })
  }

  /**
   * Performs an identification analysis by list.
   * @param list {[String]} The given list.
   * @param language {String} The targeted language by the analysis.
   * @param destination {String} The destination.
   * @returns {Promise} A promise for the analysis.
   */
  identifyByList(list, language, destination) {
    return new Promise((resolveAll, rejectAll) => {
      if (
        list !== undefined &&
        list !== null &&
        list.length !== 0 &&
        language !== undefined &&
        language !== null &&
        language !== '' &&
        LANGUAGES_SUPPORTED.includes(language)
      ) {
        let promises = []
        list.forEach((element) => {
          promises.push(
            new Promise((resolve, reject) => {
              this.identifyByElement(element, language, destination)
                .then((result) => {
                  resolve(result)
                })
                .catch((error) => {
                  reject(new AnalysisFail(error.message))
                })
            })
          )
        })
        Promise.all(promises)
          .then((resultsAll) => {
            resolveAll(resultsAll)
          })
          .catch((errorAll) => {
            rejectAll(errorAll)
          })
      } else {
        rejectAll(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
      }
    })
  }

  /**
   * Performs an identification analysis by element.
   * @param element {String} The given element.
   * @param language {String} The targeted language by the analysis.
   * @param destination {String} The destination.
   * @returns {Promise} A promise for the analysis.
   */
  identifyByElement(element, language, destination) {
    return new Promise((resolve, reject) => {
      if (
        element !== undefined &&
        element !== null &&
        element.length !== 0 &&
        language !== undefined &&
        language !== null &&
        language !== '' &&
        LANGUAGES_SUPPORTED.includes(language)
      ) {
        let codeQLRepositoryFolder = this.getCodeQLRepositoryFolder(element, destination)
        let codeQLQueryFolder = this.getQueryFolder() + FILE_SYSTEM_SEPARATOR + language
        let codeQLRepositoryResultFile = this.getResultCodeQLRepositoryFile(element, destination)
        try {
          // 3. Identification

          exec(
            '.' +
              FILE_SYSTEM_SEPARATOR +
              'lib' +
              FILE_SYSTEM_SEPARATOR +
              'codeql-cli' +
              FILE_SYSTEM_SEPARATOR +
              'codeql database analyze ' +
              codeQLRepositoryFolder +
              ' ' +
              codeQLQueryFolder +
              ' --format=csv --rerun --output=' +
              codeQLRepositoryResultFile,
            [],
            (error, stdout, stderr) => {
              if (error) {
                reject(new AnalysisFail(error.message))
              } else {
                resolve(element)
              }
            }
          )
        } catch (error) {
          reject(new AnalysisFail(error.message))
        }
      } else {
        reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
      }
    })
  }

  /**
   * Extracts an analysis by list.
   * @param list {[String]} The given list.
   * @param language {String} The targeted language by the analysis.
   * @param destination {String} The destination.
   * @returns {Promise} A promise for the extraction.
   */
  extractByList(list, language, destination) {
    return new Promise((resolveAll, rejectAll) => {
      if (list !== undefined && list !== null && list.length !== 0) {
        let promises = []
        list.forEach((element) => {
          promises.push(
            new Promise((resolve, reject) => {
              this.extractByElement(element, language, destination)
                .then((result) => {
                  resolve(result)
                })
                .catch((error) => {
                  reject(error)
                })
            })
          )
        })
        Promise.all(promises)
          .then((resultsAll) => {
            resolveAll(resultsAll)
          })
          .catch((errorAll) => {
            rejectAll(errorAll)
          })
      } else {
        rejectAll(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
      }
    })
  }

  /**
   * Extracts an analysis by element.
   * @param element {String} The given element.
   * @param language {String} The targeted language by the analysis.
   * @param destination {String} The destination.
   * @returns {Promise} A promise for the extraction.
   */
  extractByElement(element, language, destination) {
    return new Promise((resolve, reject) => {
      if (
        element !== undefined &&
        element !== null &&
        element.length !== 0 &&
        language !== undefined &&
        language !== null &&
        language !== '' &&
        LANGUAGES_SUPPORTED.includes(language)
      ) {
        let result = []

        try {
          let folderPath = this.getRepositoryFolder(element, destination)

          // Reading denim file.

          let denimFilePath =
            this.getRepositoryFolder(element, destination) + FILE_SYSTEM_SEPARATOR + 'denim'
          let url = null
          if (fs.existsSync(denimFilePath)) {
            const data = fs.readFileSync(denimFilePath, 'utf8')
            url = data.split('\n')[0].trim()
          }

          // Reading result file.

          let codeQLRepositoryResultFile = this.getResultCodeQLRepositoryFile(element, destination)
          let csv = []
          const stream = fs.createReadStream(codeQLRepositoryResultFile)
          const reader = readline.createInterface({ input: stream })
          reader.on('line', (row) => {
            csv.push(row)
          })
          reader.on('close', () => {
            csv.forEach((line) => {
              // 4. Extraction

              let codeFragment = line.slice(1, -1)
              codeFragment = codeFragment.split('",')
              let codeFragmentSplit = codeFragment[3].replaceAll('"', '').split(';;')

              let type = codeFragment[0].replaceAll('"', '')
              let repository = url ? url : element
              let fileName = codeFragment[4].replaceAll('"', '')
              let filePath = folderPath + FILE_SYSTEM_SEPARATOR + fileName.substring(1)
              let file = repository + fileName
              let L1 = codeFragment[5].replaceAll('"', '')
              let C1 = codeFragment[6].replaceAll('"', '')
              let L2 = codeFragment[7].replaceAll('"', '')
              let C2 = codeFragment[8].replaceAll('"', '')
              let location = file + '#L' + L1 + 'C' + C1 + '-L' + L2 + 'C' + C2
              let operation = codeFragmentSplit[3]
              let method = codeFragmentSplit[0]
              let sample = codeFragmentSplit[1]
              let tokens = codeFragmentSplit[2]
              let score = codeFragmentSplit[4]
              let heuristics = codeFragmentSplit[5]
              let fileNumberOfLinesOfCode = 0
              try {
                const fileContent = fs.readFileSync(filePath, 'utf8')
                const stats = sloc(fileContent, filePath.substring(filePath.lastIndexOf('.') + 1))
                let resultSloc = stats.source
                fileNumberOfLinesOfCode = resultSloc
              } catch (error) {
                fileNumberOfLinesOfCode = 0
              }

              let resultObject = {
                type: type, // Detection type.
                repository: repository, // Repository URI
                file: file, // File URI
                location: location, // Location URI under the #Lx1Cy1-Lx2Cy2 format.
                operation: operation, // Operation.
                method: method, // Method.
                sample: sample, // Sample.
                tokens: tokens, // Tokens.
                score: score, // Effective score.
                heuristics: heuristics, // Heuristic tracing.
                fileNumberOfLinesOfCode: fileNumberOfLinesOfCode // Parent file number of lines of code.
              }

              result.push(resultObject)
            })
            resolve(result)
          })
          reader.on('error', (error) => {
            reject(new AnalysisFail(error.message))
          })
        } catch (error) {
          reject(new AnalysisFail(error.message))
        }
      } else {
        reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
      }
    })
  }

  /**
   * Interprets an analysis by list.
   * @param list {[String]} The given list.
   * @param language {String} The targeted language by the analysis.
   * @param destination {String} The destination.
   * @returns {Promise} A promise for the interpretation.
   */
  interpretByList(list, language, destination) {
    return new Promise(async (resolve, reject) => {
      if (
        list !== undefined &&
        list !== null &&
        list.length !== 0 &&
        language !== undefined &&
        language !== null &&
        language !== '' &&
        LANGUAGES_SUPPORTED.includes(language)
      ) {
        // 5. Interpretation

        // For all repositories (architecture-centered)

        let repositories = []

        for (let i = 0; i < list.length; i++) {
          let tdIdfRepositoryReferenceDocument = this.getConceptsByNLP(
            list[i].map((fragment) => [fragment.tokens]).join(' ')
          )

          // For all code fragment (microservice-centered)

          for (let j = 0; j < list[i].length; j++) {
            let fragment = list[i][j]

            // NLP analysis

            let concepts = this.getConceptsByNLP(fragment.tokens)
            concepts = [...new Set(concepts)] // Delete duplicates.

            // TF-IDF-based sorting

            concepts = this.sortByTdIdf(concepts, tdIdfRepositoryReferenceDocument)
            concepts = concepts.map((concept) => concept.name)

            // 5.1. Association, 5.2. Comparison, 5.3. Unification
            repositories = this.setCodeFragment(fragment, concepts, repositories, language) // Filling the model
          }
        }
        resolve(repositories)
      } else {
        reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
      }
    })
  }

  /**
   * Returns the concepts extracted (tokenization, special char cleaning, noise cleaning, lemmatization) by NLP
   * related to the given data.
   * @param data The given data.
   * @return The related concepts extracted by NLP.
   */
  getConceptsByNLP(data) {
    if (data !== undefined && data !== null && data !== '') {
      // Tokens association formatting.

      let tokens = data.split(' ')
      //console.log(tokens);

      tokens = tokens.map((token) => {
        let splitToken = token.split('-')
        //console.log(splitToken);
        splitToken = splitToken.map((token) => {
          return token.charAt(0).toUpperCase() + token.substring(1)
        })
        //console.log(splitToken);
        return splitToken.join('')
      }) // kebab-case to camelCase.

      tokens = tokens.map((token) => {
        let splitToken = token.split('_')
        //console.log(splitToken);
        splitToken = splitToken.map((token) => {
          return token.charAt(0).toUpperCase() + token.substring(1)
        })
        //console.log(splitToken);
        return splitToken.join('')
      }) // snake_case to camelCase.

      let associatedTokens = tokens.join(' ')
      //console.log(associatedTokens);

      // Tokens special chars removing.

      let specialCharsFreeTokens = associatedTokens.replaceAll(/[^a-zA-Z0-9]/g, ' ')
      //console.log(specialCharsFreeTokens);

      // Tokens disassociation formatting.

      let disassociatedTokens = specialCharsFreeTokens.split(' ').map((concept) => {
        concept = concept.replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase to isolated words.
        concept = concept.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // PascaleCase to isolated words.
        return concept.toLowerCase()
      })
      //console.log(disassociatedTokens);

      // Concepts extracting.

      let concepts = disassociatedTokens.map((token) => {
        let result = nlp.readDoc(token)
        //return result.customEntities().out().join(' '); // Only nouns and proper nouns are retained.
        return result.tokens().out().join(' ') // All tokens are retained.
      })
      //console.log(concepts);

      // Concepts noise removing.

      let noiseFreeConcepts = concepts.filter((concept) => concept.length > 1)
      //console.log(noiseFreeConcepts);

      // Concepts lemmatizing.

      let lemmatizedConcepts = noiseFreeConcepts.map((concept) => {
        let conceptSplit = concept.split(' ')
        let conceptSplitLemmatized = conceptSplit.map((conceptPart) =>
          winkNLPLemmatizer.noun(conceptPart)
        )
        return conceptSplitLemmatized.join(' ')
      })
      //console.log(lemmatizedConcepts);

      return lemmatizedConcepts
    } else {
      return []
    }
  }

  /**
   * Sorts the given data according to the TD-IDF measured based on a given reference document.
   * @param data The given data.
   * @param referenceDocument The given reference document.
   * @return The related TD-IDF.
   */
  sortByTdIdf(data, referenceDocument) {
    if (data !== undefined && data !== null && data.length > 0) {
      if (
        referenceDocument !== undefined &&
        referenceDocument !== null &&
        referenceDocument !== ''
      ) {
        let unsortedData = []
        let tfidf = new TfIdf()
        tfidf.addDocument(referenceDocument)
        data.forEach((element) => {
          tfidf.tfidfs(element, function (i, measure) {
            unsortedData.push({ name: element, relevancy: measure })
          })
        })
        return unsortedData.sort((a, b) => b.relevancy - a.relevancy)
      } else {
        return data
      }
    } else {
      return []
    }
  }

  /**
   * Inserts a code fragment in the current state of the model.
   * @param fragment The current code fragment.
   * @param concepts The current concepts attached to the code fragment.
   * @param repositories The current state of the model.
   * @returns The updated state of the model
   */
  setCodeFragment(fragment, concepts, repositories) {
    if (
      fragment !== undefined &&
      fragment !== null &&
      concepts !== undefined &&
      concepts !== null &&
      repositories !== undefined &&
      repositories !== null
    ) {
      // Repository

      let repositoryPath = fragment.repository + '/'
      let repository = repositories.find(
        (repository) => repository.getLocation() === repositoryPath
      )
      if (repository === undefined) {
        repository = new Repository(repositoryPath, [])
        repositories.push(repository)
      }

      // Directories

      let locationPath = fragment.location
      let directories = locationPath.substring(repositoryPath.length - 1).split('/')
      directories.pop() // Delete the last element (the location which is not a directory but which will be integrated later)
      let previousDirectory = null
      let currentDirectoryPath =
        repositoryPath +
        (directories[0] !== undefined && directories[0].length !== 0 ? directories[0] + '/' : '')
      let currentDirectory = repository
        .getDirectories()
        .find((directory) => directory.getLocation() === currentDirectoryPath)
      if (currentDirectory === undefined) {
        currentDirectory = new Directory(currentDirectoryPath, [], [])
        repository.getDirectories().push(currentDirectory)
      }

      previousDirectory = currentDirectory
      for (let k = 1; k < directories.length; k++) {
        currentDirectoryPath = currentDirectoryPath + directories[k] + '/'
        currentDirectory = currentDirectory
          .getDirectories()
          .find((directory) => directory.getLocation() === currentDirectoryPath)
        if (currentDirectory === undefined) {
          currentDirectory = new Directory(currentDirectoryPath, [], [])
          previousDirectory.getDirectories().push(currentDirectory)
        }
        previousDirectory = currentDirectory
      }

      // File

      let filePath = fragment.file
      let fileLinesOfCode = fragment.fileNumberOfLinesOfCode
      let file = previousDirectory.getFiles().find((file) => file.getLocation() === filePath)
      if (file === undefined) {
        file = new File(filePath, fileLinesOfCode, [])
        previousDirectory.getFiles().push(file)
      }

      // Code fragment

      concepts = concepts.map((concept) => new Concept(concept))
      let codeFragment = new CodeFragment(
        fragment.location,
        new Technology(fragment.type),
        new Operation(fragment.operation),
        new Method(fragment.method),
        new Sample(fragment.sample),
        concepts,
        fragment.heuristics,
        fragment.score
      )
      file.getCodeFragments().push(codeFragment)
    }
    return repositories
  }

  /**
   * Returns the repository folder path corresponding to the given repository name.
   * @param repository The given repository name.
   * @param destination {String} The destination.
   * @return {String} The corresponding folder path.
   */
  getRepositoryFolder(repository, destination) {
    if (repository !== undefined && repository !== null && repository !== '') {
      return (
        process.cwd() +
        FILE_SYSTEM_SEPARATOR +
        TEMP_FOLDER_NAME +
        FILE_SYSTEM_SEPARATOR +
        destination +
        FILE_SYSTEM_SEPARATOR +
        repository
      )
    } else {
      throw new BadFormat(INPUT_INCORRECTLY_FORMATTED)
    }
  }

  /**
   * Returns the CodeQL repository folder path corresponding to the given repository name.
   * @param repository The given repository name.
   * @param destination {String} The destination.
   * @return {String} The corresponding CodeQL folder path.
   */
  getCodeQLRepositoryFolder(repository, destination) {
    return this.getRepositoryFolder(repository, destination) + CODEQL_FOLDER_NAME_SUFFIX
  }

  /**
   * Returns the CodeQL query repository.
   * @return {String} The CodeQL query repository.
   */
  getQueryFolder() {
    return process.cwd() + FILE_SYSTEM_SEPARATOR + QUERY_FOLDER_NAME
  }

  /**
   * Returns the CodeQL result repository folder path corresponding to the given repository name.
   * @param repository The given repository name.
   * @param destination {String} The destination.
   * @return {String} The corresponding folder path.
   */
  getResultCodeQLRepositoryFolder(repository, destination) {
    return (
      this.getCodeQLRepositoryFolder(repository, destination) +
      FILE_SYSTEM_SEPARATOR +
      RESULT_FOLDER_NAME
    )
  }

  /**
   * Returns the CodeQL result repository file path corresponding to the given repository name.
   * @param repository The given repository name.
   * @param destination {String} The destination.
   * @return {String} The corresponding file path.
   */
  getResultCodeQLRepositoryFile(repository, destination) {
    return (
      this.getCodeQLRepositoryFolder(repository, destination) +
      FILE_SYSTEM_SEPARATOR +
      RESULT_FOLDER_NAME +
      FILE_SYSTEM_SEPARATOR +
      RESULT_FILE_NAME
    )
  }
}

module.exports = StaticAnalyzerCodeQL
