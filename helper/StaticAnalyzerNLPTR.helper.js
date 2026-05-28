// Constants

const {
  TEMP_FOLDER_NAME,
  FILE_EXTENSIONS_LANGUAGES,
  TECHNOLOGY_ANY,
  UNDEFINED,
  HEURISTICS_ANY
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

// Libraries : File System

const fs = require('fs')
const path = require('path')

// Libraries : sloc

const sloc = require('sloc')

/**
 * @overview This class represents the static analyzer with NLP (Natural Language Processing) and TR (Text Retrieval).
 */
class StaticAnalyzerNLPTR extends StaticAnalyzer {
  /**
   * Instantiates a NLP-TR static analyzer.
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
        options instanceof Object
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
        options instanceof Object
      ) {
        // 2. Initialization
        let repositoryFolder = this.getRepositoryFolder(
          repository.getLocation(),
          destinationDirectoryRelativePath
        )
        try {
          // Note: Initialization consists solely of verifying the existence of the repository folder to be analyzed.
          if (fs.existsSync(repositoryFolder)) {
            resolve(repository)
          } else {
            reject(new AnalysisFail(error.message))
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
        options instanceof Object
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
   * @param destinationDirectoryRelativePath {String} The destination relative path.
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
        options instanceof Object
      ) {
        try {
          // 3. Identification
          repository = this.setRepository(repository, destinationDirectoryRelativePath, options)
          resolve(repository)
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
        options instanceof Object
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
    return new Promise((resolveAll, rejectAll) => {
      if (
        repository !== undefined &&
        repository !== null &&
        repository instanceof Repository &&
        destinationDirectoryRelativePath !== undefined &&
        destinationDirectoryRelativePath !== null &&
        destinationDirectoryRelativePath !== '' &&
        options !== undefined &&
        options !== null &&
        options instanceof Object
      ) {
        // 4. Extraction
        try {
          let repositoryRelativePath = repository.getLocation()
          let repositoryAbsolutePath = this.getRepositoryFolder(
            repositoryRelativePath,
            destinationDirectoryRelativePath
          )
          if (fs.existsSync(repositoryAbsolutePath)) {
            let denimFileAbsolutePath = path.join(repositoryAbsolutePath, 'denim')
            let repositoryUrlRelativePath = null
            if (fs.existsSync(denimFileAbsolutePath)) {
              const data = fs.readFileSync(denimFileAbsolutePath, 'utf8')
              repositoryUrlRelativePath = data.split('\n')[0].trim() + '/'
            }

            // Relative location update.

            if (repositoryUrlRelativePath) {
              repository.setLocation(repositoryUrlRelativePath)
            }

            let promise = new Promise((resolve, reject) => {
              let directoryRelativePath = repository.getLocation()
              let directoryAbsolutePath = repositoryAbsolutePath
              this.extractByRepositoryDirectory(
                repository.getDirectories()[0],
                directoryRelativePath,
                directoryAbsolutePath,
                options
              )
                .then((result) => {
                  resolve(result)
                })
                .catch((error) => {
                  reject(error)
                })
            })
            promise
              .then((resultsAll) => {
                resolveAll(repository)
              })
              .catch((errorAll) => {
                rejectAll(errorAll)
              })
          } else {
            rejectAll(new AnalysisFail(ANALYSIS_FAIL))
          }
        } catch (error) {
          rejectAll(new AnalysisFail(error.message))
        }
      } else {
        rejectAll(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
      }
    })
  }

  extractByRepositoryDirectory(directory, relativePath, absolutePath, options) {
    return new Promise((resolveAll, rejectAll) => {
      let directoryRelativePath =
        relativePath + directory.getLocation().substring(directory.getLocation().indexOf('/') + 1)
      directory.setLocation(directoryRelativePath)

      // Relative location update.

      let promises = []
      directory.getDirectories().forEach((d) => {
        promises.push(
          new Promise((resolve, reject) =>
            this.extractByRepositoryDirectory(d, relativePath, absolutePath, options)
              .then((result) => {
                resolve(result)
              })
              .catch((error) => {
                reject(error)
              })
          )
        )
      })

      directory.getFiles().forEach((f) =>
        promises.push(
          new Promise((resolve, reject) => {
            this.extractByRepositoryFile(f, relativePath, absolutePath, options)
              .then((result) => {
                resolve(result)
              })
              .catch((error) => {
                reject(error)
              })
          })
        )
      )

      Promise.all(promises)
        .then((resultsAll) => {
          resolveAll(resultsAll)
        })
        .catch((errorAll) => {
          rejectAll(errorAll)
        })
    })
  }

  extractByRepositoryFile(file, relativePath, absolutePath, options) {
    return new Promise((resolveAll, rejectAll) => {
      let fileAbsolutePath =
        absolutePath +
        file
          .getLocation()
          .substring(file.getLocation().indexOf('/') + 1)
          .replace('/', path.sep)

      let fileRelativePath =
        relativePath + file.getLocation().substring(file.getLocation().indexOf('/') + 1)

      // Lines of Code (LoC) update.

      let fileNumberOfLinesOfCode = 0
      try {
        const fileContent = fs.readFileSync(fileAbsolutePath, 'utf8')
        const fileExtension = fileAbsolutePath.substring(fileAbsolutePath.lastIndexOf('.') + 1)
        const stats = sloc(fileContent, fileExtension)
        fileNumberOfLinesOfCode = stats.source
      } catch (error) {
        fileNumberOfLinesOfCode = 0
      }
      file.setLinesOfCode(fileNumberOfLinesOfCode)

      // Relative location update.

      file.setLocation(fileRelativePath)

      let promises = []
      file.getCodeFragments().forEach((cf) =>
        promises.push(
          new Promise((resolve, reject) => {
            this.extractByRepositoryCodeFragment(cf, relativePath, absolutePath, options)
              .then((result) => {
                resolve(result)
              })
              .catch((error) => {
                reject(error)
              })
          })
        )
      )

      Promise.all(promises)
        .then((resultsAll) => {
          resolveAll(resultsAll)
        })
        .catch((errorAll) => {
          rejectAll(errorAll)
        })
    })
  }

  extractByRepositoryCodeFragment(codeFragment, relativePath, absolutePath, options) {
    return new Promise((resolve, reject) => {
      let codeFragmentRelativePath =
        relativePath +
        codeFragment.getLocation().substring(codeFragment.getLocation().indexOf('/') + 1)

      // Relative location update.

      codeFragment.setLocation(codeFragmentRelativePath)
      resolve(true)
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
        options instanceof Object
      ) {
        // 5. Interpretation

        let outKeywordHints = options?.hints?.out !== undefined ? options.hints.out : []
        outKeywordHints = this.NLP.extractConcepts(outKeywordHints)
        let inKeywordsHints = options?.hints?.in !== undefined ? options.hints.in : []
        inKeywordsHints = this.NLP.extractConcepts(inKeywordsHints)

        // For all repositories (architecture-centered)

        let promises = []
        for (let i = 0; i < repositories.length; i++) {
          promises.push(
            new Promise((resolve, reject) =>
              this.interpretByRepository(repositories[i], (child) => {
                // 5.1. Extracts all concepts.
                let conceptsInFiles = []
                if (child instanceof File) {
                  let conceptsInFile = child
                    .getCodeFragments()
                    .map((cf) => cf.getConcepts().map((c) => c.getName()))
                    .flat()
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
            const conceptsInFiles = result.flat()
            let concepts = this.NLP.scoreConcepts(
              conceptsInFiles,
              outKeywordHints.concat(inKeywordsHints)
            )
            concepts = concepts.map((c) => c.name)
            // 5.3. Classify concepts.
            this.NLP.classifyConcept(concepts, inKeywordsHints, outKeywordHints).then((result) => {
              let shortListedConcepts = result
              // For all files (microservice-centered)
              let promises = []
              for (let i = 0; i < repositories.length; i++) {
                promises.push(
                  new Promise((resolve, reject) =>
                    this.interpretByRepository(repositories[i], (child) => {
                      // 5.4. Cleans code fragments and concepts.
                      // For all code fragments (microservice-centered)
                      if (child instanceof File) {
                        let codeFragments = child.getCodeFragments().filter(
                          (cf) =>
                            // The code fragment contains at least an exclusion term ...
                            cf.getConcepts().some((c) => outKeywordHints.includes(c.getName())) &&
                            // ... and the code fragment contains at least a short-listed term.
                            cf.getConcepts().some((c) => shortListedConcepts.includes(c.getName()))
                        ) // Clean code fragments.
                        codeFragments.forEach(
                          (cf) => {
                            cf.setConcepts([
                              ...new Map(
                                cf
                                  .getConcepts()
                                  .filter(
                                    (c) =>
                                      // The code fragment contains only inclusion terms ...
                                      shortListedConcepts.includes(c.getName()) &&
                                      // ... and not the exclusion terms as concepts.
                                      !outKeywordHints.includes(c.getName())
                                  )
                                  .map((c) => [c.getName(), c])
                              ).values()
                            ])
                          } // Clean concepts.
                        )
                        child.setCodeFragments(codeFragments)
                      }
                      return true
                    })
                      .then((result) => resolve(result))
                      .catch((error) => reject(error))
                  )
                )
              } // Removes code fragments and concepts that are not among the highest scored.

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
   * Visits and fills a given repository with the directories and files it contains.
   * @param repository {Repository} The given repository.
   * @param destinationDirectoryRelativePath {String} The destination directory relative path.
   * @param options {Object} The options of the analysis.
   * @return {Repository} The filled repository.
   */
  setRepository(repository, destinationDirectoryRelativePath, options) {
    if (
      repository !== undefined &&
      repository !== null &&
      destinationDirectoryRelativePath !== undefined &&
      destinationDirectoryRelativePath !== null &&
      destinationDirectoryRelativePath.length > 0 &&
      options !== undefined &&
      options !== null &&
      options instanceof Object
    ) {
      try {
        // Browsing.

        let repositoryRelativePath = repository.getLocation()
        let repositoryAbsolutePath = this.getRepositoryFolder(
          repositoryRelativePath,
          destinationDirectoryRelativePath
        )
        let repositoryLocation = repositoryRelativePath + '/'
        repository.setLocation(repositoryLocation)
        let directory = this.setRepositoryDirectory(
          repositoryLocation,
          repositoryAbsolutePath,
          options
        )

        // Result.

        repository.setDirectories([directory])
        return repository
      } catch (error) {
        throw new AnalysisFail(ANALYSIS_FAIL)
      }
    } else {
      throw new BadFormat(INPUT_INCORRECTLY_FORMATTED)
    }
  }

  setRepositoryDirectory(relativePath, absolutePath, options) {
    const entries = fs.readdirSync(absolutePath, { withFileTypes: true })
    const directories = []
    const files = []
    entries.forEach((entry) => {
      const entryIdentifierRelative = entry.name + (entry.isDirectory() ? '/' : '')
      const entryIdentifierAbsolute = entry.name + (entry.isDirectory() ? path.sep : '')
      const entryRelativePath = relativePath + entryIdentifierRelative
      const entryAbsolutePath = path.join(absolutePath, entryIdentifierAbsolute)
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        directories.push(this.setRepositoryDirectory(entryRelativePath, entryAbsolutePath, options))
      } else {
        let languageHint = this.getFileExtension(entryRelativePath)
        let language = FILE_EXTENSIONS_LANGUAGES[languageHint]
        if (!entry.name.startsWith('.') && entry.name.includes('.') && language)
          files.push(this.setRepositoryFile(entryRelativePath, entryAbsolutePath, options))
      }
    })
    return new Directory(relativePath, directories, files)
  }

  setRepositoryFile(relativePath, absolutePath, options) {
    let codeFragments = []
    let languageHint = this.getFileExtension(relativePath)
    let language = FILE_EXTENSIONS_LANGUAGES[languageHint]
    let outKeywordHints = options?.hints?.out !== undefined ? options.hints.out : []
    let inKeywordsHints = options?.hints?.in !== undefined ? options.hints.in : []

    if (language) {
      // Retrieves concepts.

      let fileContent = fs
        .readFileSync(absolutePath, 'utf8')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
      fileContent = this.NLP.removeComments(fileContent, language)
      const concepts = [
        ...new Set(
          this.NLP.extractConcepts(
            fileContent,
            languageHint,
            outKeywordHints.concat(inKeywordsHints)
          )
        )
      ]

      // Scans the file to identify data access-related lines of code.

      if (concepts !== []) {
        const lines = fileContent.split('\n')
        if (lines.length > 1 && lines[lines.length - 1] === '') {
          lines.pop()
        }
        let rangeStart = -1
        let conceptsMerging = []
        let linesMerging = []
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          const lineConcepts = [
            //...new Set(this.NLP.extractConcepts(line, languageHint, outKeywordHints.concat(inKeywordsHints)))
            ...this.NLP.extractConcepts(line, languageHint, outKeywordHints.concat(inKeywordsHints)) // Duplicates kept for TF-IDF.
          ]
          if (
            // Starts a code fragment with the first line and the first concepts.
            rangeStart === -1 &&
            lineConcepts.length !== 0 &&
            lineConcepts.some((c) => concepts.includes(c))
          ) {
            rangeStart = i
          }

          if (
            // Fills a code fragment with new lines and new concepts.
            rangeStart !== -1 &&
            lineConcepts.length !== 0 &&
            lineConcepts.some((c) => concepts.includes(c))
          ) {
            conceptsMerging.push(...lineConcepts)
            linesMerging += '\n' + line
          }

          if (rangeStart !== -1 && lineConcepts.length === 0) {
            // Ends a code fragment with the previous line and previously collected concepts.
            let codeFragment = new CodeFragment(
              `${relativePath}#L${rangeStart + 1}L${i}`,
              new Technology(language + '-' + TECHNOLOGY_ANY),
              new Operation(UNDEFINED),
              new Method(UNDEFINED),
              new Sample(linesMerging),
              conceptsMerging.map((c) => new Concept(c)),
              HEURISTICS_ANY,
              1
            )
            codeFragments.push(codeFragment)
            rangeStart = -1
            conceptsMerging = []
            linesMerging = []
          }
        }
      } // Ignores scanning for files without concepts.
    } // Ignores scanning for files without known extension.
    return new File(relativePath, 0, codeFragments)
  }

  /**
   * Returns the repository folder path corresponding to the given repository name.
   * @param repository {String} The given repository name.
   * @param destinationDirectoryRelativePath {String} The destination directory relative path.
   * @return {String} The corresponding folder path.
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
   * Returns the file extension from the given file path, determined by the substring following the last dot in the file path.
   * @param filePath {String} The file path from which the extension is extracted.
   * @returns {String} The file extension (e.g., "txt", "js", "html").
   */
  getFileExtension(filePath = '') {
    if (filePath !== null) {
      if (!filePath.includes('.')) {
        return '' // File without extension.
      }
      return filePath.substring(filePath.lastIndexOf('.') + 1)
    } else {
      throw new BadFormat(INPUT_INCORRECTLY_FORMATTED)
    }
  }
}

module.exports = StaticAnalyzerNLPTR
