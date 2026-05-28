// Constants

const {
  TEMP_FOLDER_NAME,
  CODEQL_FOLDER_NAME_SUFFIX,
  CODEQL_QUERY_FOLDER_NAME,
  CODEQL_RESULT_FOLDER_NAME,
  CODEQL_RESULT_FILE_NAME,
  LANGUAGES
} = require('./Constant.helper.js')

// Error

const BadFormat = require('../error/BadFormat.error.js')
const AnalysisFail = require('../error/AnalysisFail.error.js')
const { INPUT_INCORRECTLY_FORMATTED, ANALYSIS_FAIL } = require('../error/Constant.error.js')

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
const NLP = require('./NLP.helper.js')

// Libraries : Child Process

const { exec } = require('node:child_process')

// Libraries : File System

const fs = require('fs')
const readline = require('readline')
const path = require('path')

// Libraries : sloc

const sloc = require('sloc')

/**
 * @overview This class represents the AST static analyzer.
 */
class StaticAnalyzerAST extends StaticAnalyzer {
  /**
   * Instantiates a AST static analyzer.
   */
  constructor() {
    super()
    this.NLP = new NLP()
  }

  /**
   * Initializes an analysis for a list of repositories.
   * @param repositories {[Repository]} The given list of repositories.
   * @param destinationDirectoryRelativePath {String} The destination directory relative path.
   * @param options {Object} The options of the analysis.
   * @returns {Promise} A promise for the preparation.
   */
  initializesByRepositories(repositories, destinationDirectoryRelativePath, options) {
    return new Promise((resolveAll, rejectAll) => {
      if (
        repositories !== undefined &&
        repositories !== null &&
        repositories.length !== 0 &&
        destinationDirectoryRelativePath !== undefined &&
        destinationDirectoryRelativePath !== null &&
        destinationDirectoryRelativePath !== '' &&
        options !== undefined &&
        options !== null &&
        options instanceof Object &&
        options.language &&
        LANGUAGES.includes(options.language)
      ) {
        let promises = []
        repositories.forEach((repository) => {
          promises.push(
            new Promise((resolve, reject) => {
              this.initializesByRepository(repository, destinationDirectoryRelativePath, options)
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
   * Initializes an analysis by repository.
   * @param repository {Repository} The given repository.
   * @param destinationDirectoryRelativePath {String} The destination directory relative path.
   * @param options {Object} The options of the analysis.
   * @returns {Promise} A promise for the preparation.
   */
  initializesByRepository(repository, destinationDirectoryRelativePath, options) {
    return new Promise((resolve, reject) => {
      if (
        repository !== undefined &&
        repository !== null &&
        repository instanceof Repository &&
        destinationDirectoryRelativePath !== undefined &&
        destinationDirectoryRelativePath !== null &&
        destinationDirectoryRelativePath !== '' &&
        options !== undefined &&
        options !== null &&
        options instanceof Object &&
        options.language &&
        LANGUAGES.includes(options.language)
      ) {
        let repositoryFolderAbsolutePath = this.getRepositoryFolder(
          repository.getLocation(),
          destinationDirectoryRelativePath
        )
        let codeQLRepositoryFolderAbsolutePath = this.getCodeQLRepositoryFolder(
          repository.getLocation(),
          destinationDirectoryRelativePath
        )

        // 2. Initialization

        try {
          // CodeQL Database
          exec(
            '.' +
              path.sep +
              path.join('lib', 'codeql-cli', 'codeql') +
              ' ' +
              'database create --language=' +
              options.language +
              ' --source-root' +
              ' ' +
              repositoryFolderAbsolutePath +
              ' ' +
              codeQLRepositoryFolderAbsolutePath,
            { maxBuffer: 1024 * 1000 * 500 },
            (error, stdout, stderr) => {
              if (error) {
                reject(new AnalysisFail(error.message))
              } else {
                fs.mkdirSync(
                  this.getResultCodeQLRepositoryFolder(
                    repository.getLocation(),
                    destinationDirectoryRelativePath
                  )
                )
                resolve(repository)
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
   * Performs an identification analysis for a list of repositories.
   * @param repositories {[Repository]} The given list of repositories.
   * @param destinationDirectoryRelativePath {String} The destination directory relative path.
   * @param options {Object} The options of the analysis.
   * @returns {Promise} A promise for the analysis.
   */
  identifyByRepositories(repositories, destinationDirectoryRelativePath, options) {
    return new Promise((resolveAll, rejectAll) => {
      if (
        repositories !== undefined &&
        repositories !== null &&
        repositories.length !== 0 &&
        destinationDirectoryRelativePath !== undefined &&
        destinationDirectoryRelativePath !== null &&
        destinationDirectoryRelativePath !== '' &&
        options !== undefined &&
        options !== null &&
        options instanceof Object &&
        options.language &&
        LANGUAGES.includes(options.language)
      ) {
        let promises = []
        repositories.forEach((repository) => {
          promises.push(
            new Promise((resolve, reject) => {
              this.identifyByRepository(repository, destinationDirectoryRelativePath, options)
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
   * Performs an identification analysis by repository.
   * @param repository {Repository} The given repository.
   * @param destinationDirectoryRelativePath {String} The destination directory relative path.
   * @param options {Object} The options of the analysis.
   * @returns {Promise} A promise for the analysis.
   */
  identifyByRepository(repository, destinationDirectoryRelativePath, options) {
    return new Promise((resolve, reject) => {
      if (
        repository !== undefined &&
        repository !== null &&
        repository instanceof Repository &&
        destinationDirectoryRelativePath !== undefined &&
        destinationDirectoryRelativePath !== null &&
        destinationDirectoryRelativePath !== '' &&
        options !== undefined &&
        options !== null &&
        options instanceof Object &&
        options.language &&
        LANGUAGES.includes(options.language)
      ) {
        let codeQLRepositoryFolderAbsolutePath = this.getCodeQLRepositoryFolder(
          repository.getLocation(),
          destinationDirectoryRelativePath
        )
        let codeQLQueryFolderAbsolutePath = path.join(this.getQueryFolder(), options.language)
        let codeQLRepositoryResultFileAbsolutePath = this.getResultCodeQLRepositoryFile(
          repository.getLocation(),
          destinationDirectoryRelativePath
        )

        try {
          // 3. Identification

          exec(
            '.' +
              path.sep +
              path.join('lib', 'codeql-cli', 'codeql') +
              ' ' +
              'database analyze ' +
              codeQLRepositoryFolderAbsolutePath +
              ' ' +
              codeQLQueryFolderAbsolutePath +
              ' --format=csv --rerun --output=' +
              codeQLRepositoryResultFileAbsolutePath,
            [],
            (error, stdout, stderr) => {
              if (error) {
                reject(new AnalysisFail(error.message))
              } else {
                resolve(repository)
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
   * Extracts an analysis by a list of repositories.
   * @param repositories {[Repository]} The given list of repositories.
   * @param destinationDirectoryRelativePath {String} The destination directory relative path.
   * @param options {Object} The options of the analysis.
   * @returns {Promise} A promise for the extraction.
   */
  extractByRepositories(repositories, destinationDirectoryRelativePath, options) {
    return new Promise((resolveAll, rejectAll) => {
      if (
        repositories !== undefined &&
        repositories !== null &&
        repositories.length !== 0 &&
        destinationDirectoryRelativePath !== undefined &&
        destinationDirectoryRelativePath !== null &&
        destinationDirectoryRelativePath !== '' &&
        options !== undefined &&
        options !== null &&
        options instanceof Object &&
        options.language &&
        LANGUAGES.includes(options.language)
      ) {
        let promises = []
        repositories.forEach((repository) => {
          promises.push(
            new Promise((resolve, reject) => {
              this.extractByRepository(repository, destinationDirectoryRelativePath, options)
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
   * Extracts an analysis by repository.
   * @param repository {Repository} The given repository.
   * @param destinationDirectoryRelativePath {String} The destination directory relative path.
   * @param options {Object} The options of the analysis.
   * @returns {Promise} A promise for the extraction.
   */
  extractByRepository(repository, destinationDirectoryRelativePath, options) {
    return new Promise((resolve, reject) => {
      if (
        repository !== undefined &&
        repository !== null &&
        repository instanceof Repository &&
        destinationDirectoryRelativePath !== undefined &&
        destinationDirectoryRelativePath !== null &&
        destinationDirectoryRelativePath !== '' &&
        options !== undefined &&
        options !== null &&
        options instanceof Object &&
        options.language &&
        LANGUAGES.includes(options.language)
      ) {
        try {
          let repositoryFolderRelativePath = repository.getLocation()
          let repositoryFolderAbsolutePath = this.getRepositoryFolder(
            repositoryFolderRelativePath,
            destinationDirectoryRelativePath
          )

          if (fs.existsSync(repositoryFolderAbsolutePath)) {
            // Reading DENIM file.

            let denimFileAbsolutePath = path.join(
              this.getRepositoryFolder(repository.getLocation(), destinationDirectoryRelativePath),
              'denim'
            )
            let repositoryURLRelativePath = null
            if (fs.existsSync(denimFileAbsolutePath)) {
              const data = fs.readFileSync(denimFileAbsolutePath, 'utf8')
              repositoryURLRelativePath = data.split('\n')[0].trim()
            }

            // Reading analysis result file.

            let codeQLRepositoryResultAbsoluteFile = this.getResultCodeQLRepositoryFile(
              repository.getLocation(),
              destinationDirectoryRelativePath
            )
            let csv = []
            const stream = fs.createReadStream(codeQLRepositoryResultAbsoluteFile)
            const reader = readline.createInterface({ input: stream })
            reader.on('line', (row) => {
              csv.push(row)
            })
            reader.on('close', () => {
              csv.forEach((line) => {
                // 4. Extraction

                // Data

                let data = line.slice(1, -1)
                data = data.split('",')
                let dataSplit = data[3].replaceAll('"', '').split(';;')
                let type = data[0].replaceAll('"', '')
                let repositoryLocation = repositoryURLRelativePath
                  ? repositoryURLRelativePath
                  : repositoryFolderRelativePath // relative URL if some; relative folder otherwise.
                let fileName = data[4].replaceAll('"', '')
                let fileAbsolutePath = path.join(
                  repositoryFolderAbsolutePath,
                  fileName.substring(1)
                )
                let fileLocation = repositoryLocation + fileName
                let L1 = data[5].replaceAll('"', '')
                let C1 = data[6].replaceAll('"', '')
                let L2 = data[7].replaceAll('"', '')
                let C2 = data[8].replaceAll('"', '')
                let codeFragmentLocation =
                  fileLocation + '#L' + L1 + 'C' + C1 + '-L' + L2 + 'C' + C2
                let operation = dataSplit[3]
                let method = dataSplit[0]
                let sample = dataSplit[1]
                let tokens = dataSplit[2]
                let score = dataSplit[4]
                let heuristics = dataSplit[5]
                let fileNumberOfLinesOfCode = 0
                try {
                  const fileContent = fs.readFileSync(fileAbsolutePath, 'utf8')
                  const stats = sloc(
                    fileContent,
                    fileAbsolutePath.substring(fileAbsolutePath.lastIndexOf('.') + 1)
                  )
                  fileNumberOfLinesOfCode = stats.source
                } catch (error) {
                  fileNumberOfLinesOfCode = 0
                }

                // Result.

                repository = this.setRepository(
                  repository,
                  repositoryLocation,
                  fileLocation,
                  fileNumberOfLinesOfCode,
                  codeFragmentLocation,
                  type,
                  operation,
                  method,
                  sample,
                  tokens,
                  heuristics,
                  score
                )
              })
              resolve(repository)
            })
            reader.on('error', (error) => {
              reject(new AnalysisFail(error.message))
            })
          } else {
            reject(new AnalysisFail(ANALYSIS_FAIL))
          }
        } catch (error) {
          reject(new AnalysisFail(error.message))
        }
      } else {
        reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
      }
    })
  }

  /**
   * Interprets an analysis by a list of repositories.
   * @param repositories {[Repository]} The given list of repositories.
   * @param destinationDirectoryRelativePath {String} The destination directory relative path.
   * @param options {Object} The options of the analysis.
   * @returns {Promise} A promise for the interpretation.
   */
  interpretByRepositories(repositories, destinationDirectoryRelativePath, options) {
    return new Promise(async (resolveAll, rejectAll) => {
      if (
        repositories !== undefined &&
        repositories !== null &&
        repositories.length !== 0 &&
        destinationDirectoryRelativePath !== undefined &&
        destinationDirectoryRelativePath !== null &&
        destinationDirectoryRelativePath !== '' &&
        options !== undefined &&
        options !== null &&
        options instanceof Object &&
        options.language &&
        LANGUAGES.includes(options.language)
      ) {
        // 5. Interpretation

        let outKeywordHints = options?.hints?.out !== undefined ? options.hints.out : []
        outKeywordHints = this.NLP.extractConcepts(outKeywordHints)
        let inKeywordHints = options?.hints?.in !== undefined ? options.hints.in : []
        inKeywordHints = this.NLP.extractConcepts(inKeywordHints)

        // For all repositories (architecture-centered)

        let promises = []
        for (let i = 0; i < repositories.length; i++) {
          promises.push(
            new Promise((resolve, reject) =>
              this.interpretByRepository(repositories[i], (child) => {
                // 5.1. Extracts all concepts.
                let conceptsInFiles = []
                if (child instanceof File) {
                  let conceptsInFile = this.NLP.extractConcepts(
                    child
                      .getCodeFragments()
                      .map((cf) => cf.getConcepts().map((c) => c.getName()))
                      .flat(),
                    '',
                    inKeywordHints
                  )
                  conceptsInFiles.push(conceptsInFile)
                }
                return conceptsInFiles
              })
                .then((result) => resolve(result))
                .catch((error) => reject(error))
            )
          )
        } // Constructs an index of concepts for the entire architecture.

        // For all concepts (conceptual-centered)

        Promise.all(promises)
          .then((result) => {
            // 5.2. Sorts concepts.
            let conceptsInFiles = result.flat()
            let concepts = this.NLP.scoreConcepts(conceptsInFiles, inKeywordHints)
            concepts = concepts.map((c) => c.name)
            // 5.3. Classify concepts.
            this.NLP.classifyConcept(concepts, inKeywordHints, outKeywordHints).then((result) => {
              let shortListedConcepts = result
              // For all files (microservice-centered)
              let promises = []
              for (let i = 0; i < repositories.length; i++) {
                promises.push(
                  new Promise((resolve, reject) =>
                    this.interpretByRepository(repositories[i], (child) => {
                      let concepts = []
                      if (child instanceof CodeFragment) {
                        concepts = this.NLP.extractConcepts(
                          child.getConcepts().map((c) => (c ? c.getName() : '')),
                          '',
                          inKeywordHints
                        ).filter((c) => shortListedConcepts.includes(c))
                        concepts = [...new Set(concepts)] // Delete duplicates.
                        concepts = concepts.map((c) => new Concept(c))
                        child.setConcepts(concepts)
                        if (concepts.length !== 0) {
                          let heuristics = child.getHeuristics()
                          let score = parseInt(child.getScore())
                          let technologyPrefix = heuristics.match(/^\D*/)[0]
                          let newHeuristics = technologyPrefix + '0' + heuristics
                          let newScore = (score + 1).toString()
                          child.setHeuristics(newHeuristics)
                          child.setScore(newScore)
                        }
                      }
                      return true
                    })
                      .then((result) => resolve(result))
                      .catch((error) => reject(error))
                  )
                )
              } // Sorts and classifies the concepts in each code fragment of each microservice.

              Promise.all(promises)
                .then((result) => {
                  resolveAll(repositories)
                })
                .catch((error) => {
                  rejectAll(error)
                })
            })
          }) // Sorts the concepts, thanks to the score, in each code fragment of each microservice.
          .catch((errorAll) => {
            rejectAll(errorAll)
          })
      } else {
        rejectAll(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
      }
    })
  }

  interpretByRepository(repository, apply) {
    return new Promise((resolveAll, rejectAll) => {
      let promises = []
      repository.getDirectories().forEach((directory) => {
        promises.push(
          new Promise((resolve, reject) => {
            this.interpretByRepositoryDirectory(directory, apply)
              .then((result) => resolve(result))
              .catch((error) => reject(error))
          })
        )
      })

      Promise.all(promises)
        .then((resultsAll) => {
          resolveAll(resultsAll.flat().concat(apply(repository)))
        })
        .catch((errorAll) => {
          rejectAll(errorAll)
        })
    })
  }

  interpretByRepositoryDirectory(directory, apply) {
    return new Promise((resolveAll, rejectAll) => {
      let promises = []
      directory.getDirectories().forEach((directory) => {
        promises.push(
          new Promise((resolve, reject) => {
            this.interpretByRepositoryDirectory(directory, apply)
              .then((result) => resolve(result))
              .catch((error) => reject(error))
          })
        )
      })

      directory.getFiles().forEach((file) => {
        promises.push(
          new Promise((resolve, reject) => {
            this.interpretByRepositoryFile(file, apply)
              .then((result) => resolve(result))
              .catch((error) => reject(error))
          })
        )
      })

      Promise.all(promises)
        .then((resultsAll) => {
          resolveAll(resultsAll.flat().concat(apply(directory)))
        })
        .catch((errorAll) => {
          rejectAll(errorAll)
        })
    })
  }

  interpretByRepositoryFile(file, apply) {
    return new Promise((resolveAll, rejectAll) => {
      let promises = []
      file.getCodeFragments().forEach((codeFragment) => {
        promises.push(
          new Promise((resolve, reject) => {
            this.interpretByRepositoryCodeFragment(codeFragment, apply)
              .then((result) => resolve(result))
              .catch((error) => reject(error))
          })
        )
      })

      Promise.all(promises)
        .then((resultsAll) => {
          resolveAll(resultsAll.flat().concat(apply(file)))
        })
        .catch((errorAll) => {
          rejectAll(errorAll)
        })
    })
  }

  interpretByRepositoryCodeFragment(codeFragment, apply) {
    return new Promise((resolve, reject) => resolve(apply(codeFragment)))
  }

  /**
   * Inserts a code fragment in the given repository with all the related hierarchical parents.
   * @param repository {Repository} The given repository.
   * @param repositoryLocation {String} The given repository location.
   * @param fileLocation {String} The code fragment's file location.
   * @param fileNumberOfLinesOfCode {Number} The code fragment's file number of line of code.
   * @param codeFragmentLocation {String} The code fragment's location.
   * @param type {String} The code fragment's technology type.
   * @param operation {String} The code fragment's operation type.
   * @param method {String} The code fragment's method.
   * @param sample {String} The code fragment's sample.
   * @param tokens {String} The code fragment's tokens.
   * @param heuristics {String} The code fragment's heuristics log used for the identification.
   * @param score {String} The code fragment's score according to the identification heuristics.
   * @returns The updated repository.
   */
  setRepository(
    repository,
    repositoryLocation,
    fileLocation,
    fileNumberOfLinesOfCode,
    codeFragmentLocation,
    type,
    operation,
    method,
    sample,
    tokens,
    heuristics,
    score
  ) {
    if (
      repository !== undefined &&
      repository !== null &&
      repositoryLocation !== undefined &&
      repositoryLocation !== null &&
      repositoryLocation.length > 0 &&
      fileLocation !== undefined &&
      fileLocation !== null &&
      fileLocation.length > 0 &&
      fileNumberOfLinesOfCode !== undefined &&
      fileNumberOfLinesOfCode !== null &&
      codeFragmentLocation !== undefined &&
      codeFragmentLocation !== null &&
      codeFragmentLocation.length > 0 &&
      type !== undefined &&
      type !== null &&
      type.length > 0 &&
      operation !== undefined &&
      operation !== null &&
      operation.length > 0 &&
      method !== undefined &&
      method !== null &&
      method.length > 0 &&
      heuristics !== undefined &&
      heuristics !== null &&
      score !== undefined &&
      score !== null
    ) {
      // Repository

      repository.setLocation(repositoryLocation + '/')

      // Directories

      let directories = codeFragmentLocation.substring(repositoryLocation.length).split('/')
      directories.pop() // Delete the code fragment element that will be added later.
      let previousDirectory = null
      let currentDirectoryRelativePath =
        repositoryLocation +
        (directories[0] !== undefined && directories[0].length !== 0 ? directories[0] + '/' : '/')
      let currentDirectory = repository
        .getDirectories()
        .find((directory) => directory.getLocation() === currentDirectoryRelativePath)
      if (currentDirectory === undefined) {
        currentDirectory = new Directory(currentDirectoryRelativePath, [], [])
        repository.getDirectories().push(currentDirectory)
      }

      previousDirectory = currentDirectory
      for (let i = 1; i < directories.length; i++) {
        currentDirectoryRelativePath = currentDirectoryRelativePath + directories[i] + '/'
        currentDirectory = currentDirectory
          .getDirectories()
          .find((directory) => directory.getLocation() === currentDirectoryRelativePath)
        if (currentDirectory === undefined) {
          currentDirectory = new Directory(currentDirectoryRelativePath, [], [])
          previousDirectory.getDirectories().push(currentDirectory)
        }
        previousDirectory = currentDirectory
      }

      // File

      let file = previousDirectory.getFiles().find((file) => file.getLocation() === fileLocation)
      if (file === undefined) {
        file = new File(fileLocation, fileNumberOfLinesOfCode, [])
        previousDirectory.getFiles().push(file)
      }

      // Code fragment

      let codeFragment = new CodeFragment(
        codeFragmentLocation,
        new Technology(type),
        new Operation(operation),
        new Method(method),
        new Sample(sample),
        tokens && tokens !== ''
          ? tokens
              .split(' ')
              .filter((t) => t && t !== '')
              .map((t) => new Concept(t))
          : [],
        heuristics,
        score
      )
      file.getCodeFragments().push(codeFragment)
      return repository
    } else {
      throw new BadFormat(INPUT_INCORRECTLY_FORMATTED)
    }
  }

  /**
   * Returns the repository folder absolute path corresponding to the given repository name.
   * @param repository {String} The given repository name.
   * @param destinationDirectoryRelativePath {String} The destination directory relative path.
   * @return {String} The corresponding folder absolute path.
   */
  getRepositoryFolder(repository, destinationDirectoryRelativePath) {
    if (repository !== undefined && repository !== null && repository !== '') {
      return path.join(
        process.cwd(),
        TEMP_FOLDER_NAME,
        destinationDirectoryRelativePath,
        repository
      )
    } else {
      throw new BadFormat(INPUT_INCORRECTLY_FORMATTED)
    }
  }

  /**
   * Returns the CodeQL repository folder absolute path corresponding to the given repository name.
   * @param repository {String} The given repository name.
   * @param destinationDirectoryRelativePath {String} The destination directory relative path.
   * @return {String} The corresponding CodeQL folder absolute path.
   */
  getCodeQLRepositoryFolder(repository, destinationDirectoryRelativePath) {
    return (
      this.getRepositoryFolder(repository, destinationDirectoryRelativePath) +
      CODEQL_FOLDER_NAME_SUFFIX
    )
  }

  /**
   * Returns the CodeQL query repository absolute path.
   * @return {String} The CodeQL query repository absolute path.
   */
  getQueryFolder() {
    return path.join(process.cwd(), CODEQL_QUERY_FOLDER_NAME)
  }

  /**
   * Returns the CodeQL result repository folder absolute path corresponding to the given repository name.
   * @param repository {String} The given repository name.
   * @param destinationDirectoryRelativePath {String} The destination directory relative path.
   * @return {String} The corresponding folder absolute path.
   */
  getResultCodeQLRepositoryFolder(repository, destinationDirectoryRelativePath) {
    return path.join(
      this.getCodeQLRepositoryFolder(repository, destinationDirectoryRelativePath),
      CODEQL_RESULT_FOLDER_NAME
    )
  }

  /**
   * Returns the CodeQL result repository file absolute path corresponding to the given repository name.
   * @param repository {String} The given repository name.
   * @param destinationDirectoryRelativePath {String} The destination directory relative path.
   * @return {String} The corresponding file absolute path.
   */
  getResultCodeQLRepositoryFile(repository, destinationDirectoryRelativePath) {
    return path.join(
      this.getCodeQLRepositoryFolder(repository, destinationDirectoryRelativePath),
      CODEQL_RESULT_FOLDER_NAME,
      CODEQL_RESULT_FILE_NAME
    )
  }
}

module.exports = StaticAnalyzerAST
