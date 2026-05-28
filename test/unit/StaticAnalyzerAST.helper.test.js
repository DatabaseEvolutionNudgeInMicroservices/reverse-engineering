// Helpers

const StaticAnalyzerAST = require('../../helper/StaticAnalyzerAST.helper')

// Constants

const { TEMP_FOLDER_NAME } = require('../../helper/Constant.helper')

// Libraries

const fs = require('fs')
const path = require('path')

// Errors

const AnalysisFail = require('../../error/AnalysisFail.error.js')
const BadFormat = require('../../error/BadFormat.error.js')

// Model

const Repository = require('../../model/Repository.model')
const Directory = require('../../model/Directory.model')
const File = require('../../model/File.model')
const CodeFragment = require('../../model/CodeFragment.model')
const Technology = require('../../model/Technology.model')
const Operation = require('../../model/Operation.model')
const Method = require('../../model/Method.model')
const Sample = require('../../model/Sample.model')
const Concept = require('../../model/Concept.model')

// Setup

const repositoryList = [
  new Repository('example', []),
  new Repository('example', []),
  new Repository('example', []),
  new Repository('example', []),
  new Repository('example', []),
  new Repository('example', []),
  new Repository('example', []),
  new Repository('example', []),
  new Repository('example', [])
]
const languages = ['javascript']
const options = { language: languages[0] }
const tempPath = path.join(process.cwd(), TEMP_FOLDER_NAME)

async function prepare(destination, i) {
  /// Preparing.
  fs.mkdirSync(path.join(tempPath, destination))
  fs.mkdirSync(path.join(tempPath, destination, repositoryList[i].getLocation()))
  fs.copyFileSync(
    path.join(process.cwd(), 'test', 'unit', 'asset', 'index.example.js'),
    path.join(tempPath, destination, repositoryList[i].getLocation(), 'index.js')
  )
}

async function clean(destination) {
  // Cleaning.
  for (let i = 0; i < repositoryList.length; i++) {
    if (fs.existsSync(path.join(tempPath, destination))) {
      await fs.rmSync(path.join(tempPath, destination), { recursive: true })
    }
  }
}

// Happy path test suite

describe('AST static analyzer', () => {
  it('initializes a AST static analysis by repository', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    await prepare('StaticAnalyzerAST_aefk', 0)

    // When Then
    await staticAnalyzerAST
      .initializesByRepository(repositoryList[0], 'StaticAnalyzerAST_aefk', options)
      .then(async (result) => {
        const repositoryGenerated1 = fs.existsSync(
          path.join(tempPath, 'StaticAnalyzerAST_aefk', repositoryList[0].getLocation() + '-codeql')
        )
        const repositoryGenerated2 = fs.existsSync(
          path.join(
            tempPath,
            'StaticAnalyzerAST_aefk',
            repositoryList[0].getLocation() + '-codeql',
            'result'
          )
        )
        expect(repositoryGenerated1 && repositoryGenerated2).toBe(true)
        await clean('StaticAnalyzerAST_aefk')
      })
  })

  it('initializes a AST static analysis by repositories', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    await prepare('StaticAnalyzerAST_jdbci', 1)

    // When Then

    await staticAnalyzerAST
      .initializesByRepositories([repositoryList[1]], 'StaticAnalyzerAST_jdbci', options)
      .then(async (result) => {
        const repositoryGenerated1 = fs.existsSync(
          path.join(
            tempPath,
            'StaticAnalyzerAST_jdbci',
            repositoryList[1].getLocation() + '-codeql'
          )
        )
        const repositoryGenerated2 = fs.existsSync(
          path.join(
            tempPath,
            'StaticAnalyzerAST_jdbci',
            repositoryList[1].getLocation() + '-codeql',
            'result'
          )
        )
        expect(repositoryGenerated1 && repositoryGenerated2).toBe(true)
        await clean('StaticAnalyzerAST_jdbci')
      })
  })

  it('identifies a AST static analysis by repository', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    await prepare('StaticAnalyzerAST_mpqjc', 2)

    // When Then
    await staticAnalyzerAST
      .initializesByRepository(repositoryList[2], 'StaticAnalyzerAST_mpqjc', options)
      .then(async (result) => {
        await staticAnalyzerAST
          .identifyByRepository(result, 'StaticAnalyzerAST_mpqjc', options)
          .then(async (result) => {
            const repositoryGenerated1 = fs.existsSync(
              path.join(
                tempPath,
                'StaticAnalyzerAST_mpqjc',
                repositoryList[2].getLocation() + '-codeql',
                'result'
              )
            )
            expect(repositoryGenerated1).toBe(true)
            await clean('StaticAnalyzerAST_mpqjc')
          })
      })
  })

  it('identifies a AST static analysis by repositories', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    await prepare('StaticAnalyzerAST_qqwxc', 3)

    // When Then
    await staticAnalyzerAST
      .initializesByRepositories([repositoryList[3]], 'StaticAnalyzerAST_qqwxc', options)
      .then(async (result) => {
        await staticAnalyzerAST
          .identifyByRepositories([repositoryList[3]], 'StaticAnalyzerAST_qqwxc', options)
          .then(async (result) => {
            const repositoryGenerated1 = fs.existsSync(
              path.join(
                tempPath,
                'StaticAnalyzerAST_qqwxc',
                repositoryList[3].getLocation() + '-codeql',
                'result',
                'result.csv'
              )
            )
            expect(repositoryGenerated1).toBe(true)
            await clean('StaticAnalyzerAST_qqwxc')
          })
      })
  })

  it('extracts a AST static analysis result by repository', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    await prepare('StaticAnalyzerAST_tyexv', 4)

    // When Then
    await staticAnalyzerAST
      .initializesByRepository(repositoryList[4], 'StaticAnalyzerAST_tyexv', options)
      .then(async (result) => {
        await staticAnalyzerAST
          .identifyByRepository(repositoryList[4], 'StaticAnalyzerAST_tyexv', options)
          .then(async (result) => {
            await staticAnalyzerAST
              .extractByRepository(repositoryList[4], 'StaticAnalyzerAST_tyexv', options)
              .then(async (result) => {
                //console.log(JSON.stringify(result, null, 4))
                let expectedRepository =
                  '{"location":"example/","directories":[{"location":"example/","directories":[],"files":[{"location":"example/index.js","linesOfCode":90,"codeFragments":[{"location":"example/index.js#L0C0-L0C0","technology":{"id":"javascript-any-any-file"},"operation":{"name":"OTHER"},"method":{"name":" "},"sample":{"content":" "},"concepts":[],"heuristics":"A1","score":"1"},{"location":"example/index.js#L32C1-L44C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/count\'"},"concepts":[{"name":"count"}],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"example/index.js#L33C3-L34C23","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[],"heuristics":"E1E2E6E7","score":"4"},{"location":"example/index.js#L46C1-L62C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"example/index.js#L64C1-L85C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/:order_id\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"example/index.js#L87C1-L115C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"CREATE"},"method":{"name":"post"},"sample":{"content":"\'/\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"example/index.js#L93C29-L93C58","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[],"heuristics":"E1E2E6E7","score":"4"},{"location":"example/index.js#L50C24-L50C46","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"db.collection"},"sample":{"content":"\'orders\'"},"concepts":[{"name":"orders"}],"heuristics":"M1M2M3M4M5M6","score":"6"},{"location":"example/index.js#L51C28-L51C46","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"collection.find"},"sample":{"content":"{}"},"concepts":[],"heuristics":"M1M2M3M4M5","score":"5"},{"location":"example/index.js#L73C24-L73C46","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"db.collection"},"sample":{"content":"\'orders\'"},"concepts":[{"name":"orders"}],"heuristics":"M1M2M3M4M5M6","score":"6"},{"location":"example/index.js#L74C28-L74C77","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"collection.findOne"},"sample":{"content":"{ _id : ... }"},"concepts":[],"heuristics":"M1M2M3M4M5","score":"5"},{"location":"example/index.js#L103C24-L103C46","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"db.collection"},"sample":{"content":"\'orders\'"},"concepts":[{"name":"orders"}],"heuristics":"M1M2M3M4M5M6","score":"6"},{"location":"example/index.js#L104C28-L104C54","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"CREATE"},"method":{"name":"collection.insertOne"},"sample":{"content":"order"},"concepts":[],"heuristics":"M1M3M4M5","score":"4"},{"location":"example/index.js#L32C1-L44C2","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/count\'"},"concepts":[],"heuristics":"R1R4R5","score":"3"},{"location":"example/index.js#L33C3-L34C23","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[{"name":"order_count"}],"heuristics":"R1R2R3R4R5R6","score":"6"},{"location":"example/index.js#L46C1-L62C2","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/\'"},"concepts":[],"heuristics":"R1R4R5","score":"3"},{"location":"example/index.js#L64C1-L85C2","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/:order_id\'"},"concepts":[],"heuristics":"R1R4R5","score":"3"},{"location":"example/index.js#L93C29-L93C58","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[{"name":"order_count"}],"heuristics":"R1R2R3R4R5R6","score":"6"},{"location":"example/index.js#L95C13-L95C45","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"UPDATE"},"method":{"name":"set"},"sample":{"content":"\'order_count\'"},"concepts":[{"name":"order_count"}],"heuristics":"R1R2R3R4R5R6","score":"6"},{"location":"example/index.js#L97C13-L97C76","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"UPDATE"},"method":{"name":"set"},"sample":{"content":"\'order_count\'"},"concepts":[{"name":"order_count"}],"heuristics":"R1R2R3R4R5R6","score":"6"}]}]}]}'
                expect(JSON.stringify(result)).toEqual(expectedRepository)
                await clean('StaticAnalyzerAST_tyexv')
              })
          })
      })
  })

  it('extracts a AST static analysis result by repository list', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    await prepare('StaticAnalyzerAST_gsski', 5)

    // When Then
    await staticAnalyzerAST
      .initializesByRepositories([repositoryList[5]], 'StaticAnalyzerAST_gsski', options)
      .then(async (result) => {
        await staticAnalyzerAST
          .identifyByRepositories([repositoryList[5]], 'StaticAnalyzerAST_gsski', options)
          .then(async (result) => {
            await staticAnalyzerAST
              .extractByRepositories([repositoryList[5]], 'StaticAnalyzerAST_gsski', options)
              .then(async (result) => {
                //console.log(JSON.stringify(result, null, 4))
                let expectedRepositories =
                  '[{"location":"example/","directories":[{"location":"example/","directories":[],"files":[{"location":"example/index.js","linesOfCode":90,"codeFragments":[{"location":"example/index.js#L0C0-L0C0","technology":{"id":"javascript-any-any-file"},"operation":{"name":"OTHER"},"method":{"name":" "},"sample":{"content":" "},"concepts":[],"heuristics":"A1","score":"1"},{"location":"example/index.js#L32C1-L44C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/count\'"},"concepts":[{"name":"count"}],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"example/index.js#L33C3-L34C23","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[],"heuristics":"E1E2E6E7","score":"4"},{"location":"example/index.js#L46C1-L62C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"example/index.js#L64C1-L85C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/:order_id\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"example/index.js#L87C1-L115C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"CREATE"},"method":{"name":"post"},"sample":{"content":"\'/\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"example/index.js#L93C29-L93C58","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[],"heuristics":"E1E2E6E7","score":"4"},{"location":"example/index.js#L50C24-L50C46","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"db.collection"},"sample":{"content":"\'orders\'"},"concepts":[{"name":"orders"}],"heuristics":"M1M2M3M4M5M6","score":"6"},{"location":"example/index.js#L51C28-L51C46","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"collection.find"},"sample":{"content":"{}"},"concepts":[],"heuristics":"M1M2M3M4M5","score":"5"},{"location":"example/index.js#L73C24-L73C46","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"db.collection"},"sample":{"content":"\'orders\'"},"concepts":[{"name":"orders"}],"heuristics":"M1M2M3M4M5M6","score":"6"},{"location":"example/index.js#L74C28-L74C77","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"collection.findOne"},"sample":{"content":"{ _id : ... }"},"concepts":[],"heuristics":"M1M2M3M4M5","score":"5"},{"location":"example/index.js#L103C24-L103C46","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"db.collection"},"sample":{"content":"\'orders\'"},"concepts":[{"name":"orders"}],"heuristics":"M1M2M3M4M5M6","score":"6"},{"location":"example/index.js#L104C28-L104C54","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"CREATE"},"method":{"name":"collection.insertOne"},"sample":{"content":"order"},"concepts":[],"heuristics":"M1M3M4M5","score":"4"},{"location":"example/index.js#L32C1-L44C2","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/count\'"},"concepts":[],"heuristics":"R1R4R5","score":"3"},{"location":"example/index.js#L33C3-L34C23","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[{"name":"order_count"}],"heuristics":"R1R2R3R4R5R6","score":"6"},{"location":"example/index.js#L46C1-L62C2","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/\'"},"concepts":[],"heuristics":"R1R4R5","score":"3"},{"location":"example/index.js#L64C1-L85C2","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/:order_id\'"},"concepts":[],"heuristics":"R1R4R5","score":"3"},{"location":"example/index.js#L93C29-L93C58","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[{"name":"order_count"}],"heuristics":"R1R2R3R4R5R6","score":"6"},{"location":"example/index.js#L95C13-L95C45","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"UPDATE"},"method":{"name":"set"},"sample":{"content":"\'order_count\'"},"concepts":[{"name":"order_count"}],"heuristics":"R1R2R3R4R5R6","score":"6"},{"location":"example/index.js#L97C13-L97C76","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"UPDATE"},"method":{"name":"set"},"sample":{"content":"\'order_count\'"},"concepts":[{"name":"order_count"}],"heuristics":"R1R2R3R4R5R6","score":"6"}]}]}]}]'
                expect(JSON.stringify(result)).toEqual(expectedRepositories)
                await clean('StaticAnalyzerAST_gsski')
              })
          })
      })
  })

  it('interprets a AST static analysis result without hints', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    await prepare('StaticAnalyzerAST_apoj', 6)
    const NLP = require('../../helper/NLP.helper')
    const mockResult = [] // Obtained by executing manually the application.
    jest.spyOn(NLP.prototype, 'classifyConcept').mockResolvedValue(mockResult)

    // When Then
    await staticAnalyzerAST
      .initializesByRepositories([repositoryList[6]], 'StaticAnalyzerAST_apoj', options)
      .then(async (result) => {
        await staticAnalyzerAST
          .identifyByRepositories([repositoryList[6]], 'StaticAnalyzerAST_apoj', options)
          .then(async (result) => {
            await staticAnalyzerAST
              .extractByRepositories([repositoryList[6]], 'StaticAnalyzerAST_apoj', options)
              .then(async (result) => {
                await staticAnalyzerAST
                  .interpretByRepositories(result, 'StaticAnalyzerAST_apoj', options)
                  .then(async (result) => {
                    //console.log(JSON.stringify(result, null, 4))
                    let expectedRepositories =
                      '[{"location":"example/","directories":[{"location":"example/","directories":[],"files":[{"location":"example/index.js","linesOfCode":90,"codeFragments":[{"location":"example/index.js#L0C0-L0C0","technology":{"id":"javascript-any-any-file"},"operation":{"name":"OTHER"},"method":{"name":" "},"sample":{"content":" "},"concepts":[],"heuristics":"A1","score":"1"},{"location":"example/index.js#L32C1-L44C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/count\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"example/index.js#L33C3-L34C23","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[],"heuristics":"E1E2E6E7","score":"4"},{"location":"example/index.js#L46C1-L62C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"example/index.js#L64C1-L85C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/:order_id\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"example/index.js#L87C1-L115C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"CREATE"},"method":{"name":"post"},"sample":{"content":"\'/\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"example/index.js#L93C29-L93C58","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[],"heuristics":"E1E2E6E7","score":"4"},{"location":"example/index.js#L50C24-L50C46","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"db.collection"},"sample":{"content":"\'orders\'"},"concepts":[],"heuristics":"M1M2M3M4M5M6","score":"6"},{"location":"example/index.js#L51C28-L51C46","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"collection.find"},"sample":{"content":"{}"},"concepts":[],"heuristics":"M1M2M3M4M5","score":"5"},{"location":"example/index.js#L73C24-L73C46","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"db.collection"},"sample":{"content":"\'orders\'"},"concepts":[],"heuristics":"M1M2M3M4M5M6","score":"6"},{"location":"example/index.js#L74C28-L74C77","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"collection.findOne"},"sample":{"content":"{ _id : ... }"},"concepts":[],"heuristics":"M1M2M3M4M5","score":"5"},{"location":"example/index.js#L103C24-L103C46","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"db.collection"},"sample":{"content":"\'orders\'"},"concepts":[],"heuristics":"M1M2M3M4M5M6","score":"6"},{"location":"example/index.js#L104C28-L104C54","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"CREATE"},"method":{"name":"collection.insertOne"},"sample":{"content":"order"},"concepts":[],"heuristics":"M1M3M4M5","score":"4"},{"location":"example/index.js#L32C1-L44C2","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/count\'"},"concepts":[],"heuristics":"R1R4R5","score":"3"},{"location":"example/index.js#L33C3-L34C23","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[],"heuristics":"R1R2R3R4R5R6","score":"6"},{"location":"example/index.js#L46C1-L62C2","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/\'"},"concepts":[],"heuristics":"R1R4R5","score":"3"},{"location":"example/index.js#L64C1-L85C2","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/:order_id\'"},"concepts":[],"heuristics":"R1R4R5","score":"3"},{"location":"example/index.js#L93C29-L93C58","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[],"heuristics":"R1R2R3R4R5R6","score":"6"},{"location":"example/index.js#L95C13-L95C45","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"UPDATE"},"method":{"name":"set"},"sample":{"content":"\'order_count\'"},"concepts":[],"heuristics":"R1R2R3R4R5R6","score":"6"},{"location":"example/index.js#L97C13-L97C76","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"UPDATE"},"method":{"name":"set"},"sample":{"content":"\'order_count\'"},"concepts":[],"heuristics":"R1R2R3R4R5R6","score":"6"}]}]}]}]'
                    expect(JSON.stringify(result)).toEqual(expectedRepositories)
                    await clean('StaticAnalyzerAST_apoj')
                  })
              })
          })
      })
  })

  it('interprets a AST static analysis result with hints', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    await prepare('StaticAnalyzerAST_awpmn', 7)
    const NLP = require('../../helper/NLP.helper')
    const mockResult = ['order', 'count', 'order count'] // Obtained by executing manually the application.
    jest.spyOn(NLP.prototype, 'classifyConcept').mockResolvedValue(mockResult)

    // When Then
    await staticAnalyzerAST
      .initializesByRepositories([repositoryList[7]], 'StaticAnalyzerAST_awpmn', options)
      .then(async (result) => {
        await staticAnalyzerAST
          .identifyByRepositories([repositoryList[7]], 'StaticAnalyzerAST_awpmn', options)
          .then(async (result) => {
            await staticAnalyzerAST
              .extractByRepositories([repositoryList[7]], 'StaticAnalyzerAST_awpmn', options)
              .then(async (result) => {
                await staticAnalyzerAST
                  .interpretByRepositories(result, 'StaticAnalyzerAST_awpmn', options)
                  .then(async (result) => {
                    //console.log(JSON.stringify(result, null, 4))
                    let expectedRepositories =
                      '[{"location":"example/","directories":[{"location":"example/","directories":[],"files":[{"location":"example/index.js","linesOfCode":90,"codeFragments":[{"location":"example/index.js#L0C0-L0C0","technology":{"id":"javascript-any-any-file"},"operation":{"name":"OTHER"},"method":{"name":" "},"sample":{"content":" "},"concepts":[],"heuristics":"A1","score":"1"},{"location":"example/index.js#L32C1-L44C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/count\'"},"concepts":[{"name":"count"}],"heuristics":"E0E1E2E3E4E5E6E7E8","score":"9"},{"location":"example/index.js#L33C3-L34C23","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[],"heuristics":"E1E2E6E7","score":"4"},{"location":"example/index.js#L46C1-L62C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"example/index.js#L64C1-L85C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/:order_id\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"example/index.js#L87C1-L115C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"CREATE"},"method":{"name":"post"},"sample":{"content":"\'/\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"example/index.js#L93C29-L93C58","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[],"heuristics":"E1E2E6E7","score":"4"},{"location":"example/index.js#L50C24-L50C46","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"db.collection"},"sample":{"content":"\'orders\'"},"concepts":[{"name":"order"}],"heuristics":"M0M1M2M3M4M5M6","score":"7"},{"location":"example/index.js#L51C28-L51C46","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"collection.find"},"sample":{"content":"{}"},"concepts":[],"heuristics":"M1M2M3M4M5","score":"5"},{"location":"example/index.js#L73C24-L73C46","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"db.collection"},"sample":{"content":"\'orders\'"},"concepts":[{"name":"order"}],"heuristics":"M0M1M2M3M4M5M6","score":"7"},{"location":"example/index.js#L74C28-L74C77","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"collection.findOne"},"sample":{"content":"{ _id : ... }"},"concepts":[],"heuristics":"M1M2M3M4M5","score":"5"},{"location":"example/index.js#L103C24-L103C46","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"db.collection"},"sample":{"content":"\'orders\'"},"concepts":[{"name":"order"}],"heuristics":"M0M1M2M3M4M5M6","score":"7"},{"location":"example/index.js#L104C28-L104C54","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"CREATE"},"method":{"name":"collection.insertOne"},"sample":{"content":"order"},"concepts":[],"heuristics":"M1M3M4M5","score":"4"},{"location":"example/index.js#L32C1-L44C2","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/count\'"},"concepts":[],"heuristics":"R1R4R5","score":"3"},{"location":"example/index.js#L33C3-L34C23","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[{"name":"order count"}],"heuristics":"R0R1R2R3R4R5R6","score":"7"},{"location":"example/index.js#L46C1-L62C2","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/\'"},"concepts":[],"heuristics":"R1R4R5","score":"3"},{"location":"example/index.js#L64C1-L85C2","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/:order_id\'"},"concepts":[],"heuristics":"R1R4R5","score":"3"},{"location":"example/index.js#L93C29-L93C58","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[{"name":"order count"}],"heuristics":"R0R1R2R3R4R5R6","score":"7"},{"location":"example/index.js#L95C13-L95C45","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"UPDATE"},"method":{"name":"set"},"sample":{"content":"\'order_count\'"},"concepts":[{"name":"order count"}],"heuristics":"R0R1R2R3R4R5R6","score":"7"},{"location":"example/index.js#L97C13-L97C76","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"UPDATE"},"method":{"name":"set"},"sample":{"content":"\'order_count\'"},"concepts":[{"name":"order count"}],"heuristics":"R0R1R2R3R4R5R6","score":"7"}]}]}]}]'
                    expect(JSON.stringify(result)).toEqual(expectedRepositories)
                    await clean('StaticAnalyzerAST_awpmn')
                  })
              })
          })
      })
  })

  it('interprets a AST static analysis result with repository URL', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    await prepare('StaticAnalyzerAST_hhher', 8)
    const NLP = require('../../helper/NLP.helper')
    const mockResult = ['order', 'count', 'order count'] // Obtained by executing manually the application.
    jest.spyOn(NLP.prototype, 'classifyConcept').mockResolvedValue(mockResult)

    // When Then
    await staticAnalyzerAST
      .initializesByRepositories([repositoryList[8]], 'StaticAnalyzerAST_hhher', options)
      .then(async (result) => {
        await staticAnalyzerAST
          .identifyByRepositories([repositoryList[8]], 'StaticAnalyzerAST_hhher', options)
          .then(async (result) => {
            const denimFilePath = path.join(
              tempPath,
              'StaticAnalyzerAST_hhher',
              repositoryList[8].getLocation(),
              'denim'
            )
            let url =
              'https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
            fs.writeFileSync(denimFilePath, url) // Creation of the denim file.

            await staticAnalyzerAST
              .extractByRepositories([repositoryList[8]], 'StaticAnalyzerAST_hhher', options)
              .then(async (result) => {
                await staticAnalyzerAST
                  .interpretByRepositories(result, 'StaticAnalyzerAST_hhher', options)
                  .then(async (result) => {
                    //console.log(JSON.stringify(result, null, 4))
                    let expectedRepositories =
                      '[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/","directories":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/","directories":[],"files":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.js","linesOfCode":90,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.js#L0C0-L0C0","technology":{"id":"javascript-any-any-file"},"operation":{"name":"OTHER"},"method":{"name":" "},"sample":{"content":" "},"concepts":[],"heuristics":"A1","score":"1"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.js#L32C1-L44C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/count\'"},"concepts":[{"name":"count"}],"heuristics":"E0E1E2E3E4E5E6E7E8","score":"9"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.js#L33C3-L34C23","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[],"heuristics":"E1E2E6E7","score":"4"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.js#L46C1-L62C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.js#L64C1-L85C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/:order_id\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.js#L87C1-L115C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"CREATE"},"method":{"name":"post"},"sample":{"content":"\'/\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.js#L93C29-L93C58","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[],"heuristics":"E1E2E6E7","score":"4"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.js#L50C24-L50C46","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"db.collection"},"sample":{"content":"\'orders\'"},"concepts":[{"name":"order"}],"heuristics":"M0M1M2M3M4M5M6","score":"7"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.js#L51C28-L51C46","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"collection.find"},"sample":{"content":"{}"},"concepts":[],"heuristics":"M1M2M3M4M5","score":"5"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.js#L73C24-L73C46","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"db.collection"},"sample":{"content":"\'orders\'"},"concepts":[{"name":"order"}],"heuristics":"M0M1M2M3M4M5M6","score":"7"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.js#L74C28-L74C77","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"collection.findOne"},"sample":{"content":"{ _id : ... }"},"concepts":[],"heuristics":"M1M2M3M4M5","score":"5"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.js#L103C24-L103C46","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"db.collection"},"sample":{"content":"\'orders\'"},"concepts":[{"name":"order"}],"heuristics":"M0M1M2M3M4M5M6","score":"7"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.js#L104C28-L104C54","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"CREATE"},"method":{"name":"collection.insertOne"},"sample":{"content":"order"},"concepts":[],"heuristics":"M1M3M4M5","score":"4"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.js#L32C1-L44C2","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/count\'"},"concepts":[],"heuristics":"R1R4R5","score":"3"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.js#L33C3-L34C23","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[{"name":"order count"}],"heuristics":"R0R1R2R3R4R5R6","score":"7"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.js#L46C1-L62C2","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/\'"},"concepts":[],"heuristics":"R1R4R5","score":"3"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.js#L64C1-L85C2","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/:order_id\'"},"concepts":[],"heuristics":"R1R4R5","score":"3"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.js#L93C29-L93C58","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[{"name":"order count"}],"heuristics":"R0R1R2R3R4R5R6","score":"7"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.js#L95C13-L95C45","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"UPDATE"},"method":{"name":"set"},"sample":{"content":"\'order_count\'"},"concepts":[{"name":"order count"}],"heuristics":"R0R1R2R3R4R5R6","score":"7"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.js#L97C13-L97C76","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"UPDATE"},"method":{"name":"set"},"sample":{"content":"\'order_count\'"},"concepts":[{"name":"order count"}],"heuristics":"R0R1R2R3R4R5R6","score":"7"}]}]}]}]'
                    expect(JSON.stringify(result)).toEqual(expectedRepositories)
                    await clean('StaticAnalyzerAST_hhher')
                  })
              })
          })
      })
  })

  it('sets the repository model', async () => {
    // Given
    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When
    let repository = staticAnalyzerAST.setRepository(
      new Repository('https://www.github.com/user/project/blob/master', []),
      'https://www.github.com/user/project/blob/master',
      'https://www.github.com/user/project/blob/master/src/app/js/app.js',
      10,
      'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
      'javascript-api-express-call',
      'READ',
      'get',
      "'/order/:order'",
      'order',
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    //console.log(JSON.stringify(repository, null, 4))

    // Then
    expect(repository).toEqual(
      new Repository(
        'https://www.github.com/user/project/blob/master/',
        [
          new Directory(
            'https://www.github.com/user/project/blob/master/',
            [
              new Directory(
                'https://www.github.com/user/project/blob/master/src/',
                [
                  new Directory(
                    'https://www.github.com/user/project/blob/master/src/app/',
                    [
                      new Directory(
                        'https://www.github.com/user/project/blob/master/src/app/js/',
                        [],
                        [
                          new File(
                            'https://www.github.com/user/project/blob/master/src/app/js/app.js',
                            10,
                            [
                              new CodeFragment(
                                'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
                                new Technology('javascript-api-express-call'),
                                new Operation('READ'),
                                new Method('get'),
                                new Sample("'/order/:order'"),
                                [new Concept('order')],
                                'E1E2E3E4E5E6E7E8',
                                '8'
                              )
                            ]
                          )
                        ]
                      )
                    ],
                    []
                  )
                ],
                []
              )
            ],
            []
          )
        ],
        []
      )
    )
  })

  it('gets a repository folder from its name', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When

    let repositoryFolder = staticAnalyzerAST.getRepositoryFolder(
      'example',
      'StaticAnalyzerAST_sdzmv'
    )

    // Then

    expect(repositoryFolder).toContain(path.join(tempPath, 'StaticAnalyzerAST_sdzmv', 'example'))
  })

  it('gets a AST repository folder from its name', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When

    let repositoryFolder = staticAnalyzerAST.getCodeQLRepositoryFolder(
      'example',
      'StaticAnalyzerAST_gfpaw'
    )

    // Then

    expect(repositoryFolder).toContain(
      path.join(tempPath, 'StaticAnalyzerAST_gfpaw', 'example-codeql')
    )
  })

  it('gets the query folder', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When

    let repositoryFolder = staticAnalyzerAST.getQueryFolder()

    // Then

    expect(repositoryFolder).toContain('query')
  })

  it('gets a result AST repository folder from its name', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When

    let repositoryFolder = staticAnalyzerAST.getResultCodeQLRepositoryFile(
      'example',
      'StaticAnalyzerAST_bvwxn'
    )

    // Then

    expect(repositoryFolder).toContain(
      path.join(tempPath, 'StaticAnalyzerAST_bvwxn', 'example-codeql', 'result')
    )
  })

  it('gets a result AST repository file from its name', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When

    let repositoryFolder = staticAnalyzerAST.getResultCodeQLRepositoryFile(
      'example',
      'StaticAnalyzerAST_axtns'
    )

    // Then

    expect(repositoryFolder).toContain(
      path.join(tempPath, 'StaticAnalyzerAST_axtns', 'example-codeql', 'result', 'result.csv')
    )
  })
})

// Failure cases test suite

describe('AST static analyzer tries to', () => {
  it('initialize a AST static analysis by not found repository', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = new Repository('unknown', [])

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepository(repository, 'StaticAnalyzerAST_npuwk', options)
    ).rejects.toThrow(AnalysisFail)
  })

  it('initialize a AST static analysis by undefined repository', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = undefined

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepository(repository, 'StaticAnalyzerAST_xqqft', options)
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by null repository', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = null

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepository(repository, 'StaticAnalyzerAST_hghqz', options)
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by wrongly typed repository', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = {}

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepository(repository, 'StaticAnalyzerAST_huggi', options)
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository with undefined language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepository(repository, 'StaticAnalyzerAST_iopio', {
        language: undefined
      })
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository with null language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepository(repository, 'StaticAnalyzerAST_ugyfts', {
        language: null
      })
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository with empty language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepository(repository, 'StaticAnalyzerAST_zedsq', {
        language: ''
      })
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository with unknown language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepository(repository, 'StaticAnalyzerAST_trfgx', {
        language: 'unknownLanguage'
      })
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository with invalid language option', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepository(repository, 'StaticAnalyzerAST_fgxtr', {})
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository with undefined options', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepository(repository, 'StaticAnalyzerAST_dcfff', undefined)
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository with null options', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepository(repository, 'StaticAnalyzerAST_txtxf', null)
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository with undefined destination', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepository(repository, undefined, options)
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository with null destination', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepository(repository, null, options)
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository with empty destination', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepository(repository, '', options)
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository with unknown destination', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepository(repository, 'unknown', options)
    ).rejects.toThrow(AnalysisFail)
  })

  it('initialize a AST static analysis by repository list with not found repositories', async () => {
    // Given

    let repositoryListUnknown = [new Repository('unknown', [])]
    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepositories(
        repositoryListUnknown,
        'StaticAnalyzerAST_wxwxp',
        options
      )
    ).rejects.toThrow(AnalysisFail)
  })

  it('initialize a AST static analysis by undefined repository list', async () => {
    // Given

    let repositoryListUndefined = undefined
    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepositories(
        repositoryListUndefined,
        'StaticAnalyzerAST_emchg',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by null repository list', async () => {
    // Given

    let repositoryListNull = null
    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepositories(
        repositoryListNull,
        'StaticAnalyzerAST_emcga',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository list with undefined repositories', async () => {
    // Given

    let repositoryListUndefined = [undefined]
    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepositories(
        repositoryListUndefined,
        'StaticAnalyzerAST_wwwhi',
        options
      )
    ).rejects.toThrow(AnalysisFail)
  })

  it('initialize a AST static analysis by repository list with null repositories', async () => {
    // Given

    let repositoryListNull = [null]
    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepositories(
        repositoryListNull,
        'StaticAnalyzerAST_dkxam',
        options
      )
    ).rejects.toThrow(AnalysisFail)
  })

  it('initialize a AST static analysis by empty repository list', async () => {
    // Given

    let repositoryListEmpty = []
    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepositories(
        repositoryListEmpty,
        'StaticAnalyzerAST_kxdmr',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository list with undefined language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepositories(repositoryList, 'StaticAnalyzerAST_jfgsc', {
        language: undefined
      })
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository list with null language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepositories(repositoryList, 'StaticAnalyzerAST_kgbcf', {
        language: null
      })
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository list with empty language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepositories(repositoryList, 'StaticAnalyzerAST_sqdfb', {
        language: ''
      })
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository list with unknown language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepositories(repositoryList, 'StaticAnalyzerAST_gizbcm', {
        language: 'unknownLanguage'
      })
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository list with invalid language option', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepositories(repositoryList, 'StaticAnalyzerAST_gxdfv', {})
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository list with undefined options', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepositories(
        repositoryList,
        'StaticAnalyzerAST_dddsd',
        undefined
      )
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository list with null options', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepositories(repositoryList, 'StaticAnalyzerAST_trddd', null)
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository list with undefined destination ', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepositories(repositoryList, undefined, options)
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository list with null destination ', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepositories(repositoryList, null, options)
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository list with empty destination ', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepositories(repositoryList, '', options)
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a AST static analysis by repository list with unknown destination ', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.initializesByRepositories(repositoryList, 'unknown', options)
    ).rejects.toThrow(AnalysisFail)
  })

  it('identify a AST static analysis by not found repository', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = new Repository('unknown', [])

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepository(repository, 'StaticAnalyzerAST_gigoh', options)
    ).rejects.toThrow(AnalysisFail)
  })

  it('identify a AST static analysis by undefined repository', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = undefined

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepository(repository, 'StaticAnalyzerAST_kelkfl', options)
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by a wrongly typed repository', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = {}

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepository(repository, 'StaticAnalyzerAST_dctvt', options)
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by null repository', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = null

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepository(repository, 'StaticAnalyzerAST_fruol', options)
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by repository with undefined language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepository(repository, 'StaticAnalyzerAST_fcred', {
        language: undefined
      })
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by repository with null language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepository(repository, 'StaticAnalyzerAST_fryuk', {
        language: null
      })
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by repository with empty language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepository(repository, 'StaticAnalyzerAST_ukigt', {
        language: ''
      })
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by repository with unknown language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepository(repository, 'StaticAnalyzerAST_pogggh', {
        language: 'unknownLanguage'
      })
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by repository with invalid language option', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepository(repository, 'StaticAnalyzerAST_podgh', {})
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by repository with undefined options', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepository(repository, 'StaticAnalyzerAST_pdogh', undefined)
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by repository with null options', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepository(repository, 'StaticAnalyzerAST_podhh', null)
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by repository list with not found repositories', async () => {
    // Given

    let repositoryListUnknown = [new Repository('unknown', [])]
    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepositories(
        repositoryListUnknown,
        'StaticAnalyzerAST_qmvvc',
        options
      )
    ).rejects.toThrow(AnalysisFail)
  })

  it('identify a AST static analysis by undefined repository list', async () => {
    // Given

    let repositoryListUndefined = undefined
    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepositories(
        repositoryListUndefined,
        'StaticAnalyzerAST_yphgf',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by null repository list', async () => {
    // Given

    let repositoryListNull = null
    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepositories(
        repositoryListNull,
        'StaticAnalyzerAST_ihvgf',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by repository list with undefined repositories', async () => {
    // Given

    let repositoryListUndefined = [undefined]
    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepositories(
        repositoryListUndefined,
        'StaticAnalyzerAST_yghvb',
        options
      )
    ).rejects.toThrow(AnalysisFail)
  })

  it('identify a AST static analysis by repository list with null repositories', async () => {
    // Given

    let repositoryListNull = [null]
    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepositories(
        repositoryListNull,
        'StaticAnalyzerAST_hbmpe',
        options
      )
    ).rejects.toThrow(AnalysisFail)
  })

  it('identify a AST static analysis by empty repository list', async () => {
    // Given

    let repositoryListEmpty = []
    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepositories(
        repositoryListEmpty,
        'StaticAnalyzerAST_styhf',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by repository list with undefined language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepositories(repositoryList, 'StaticAnalyzerAST_rwjpd', {
        language: undefined
      })
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by repository list with null language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepositories(repositoryList, 'StaticAnalyzerAST_duhbv', {
        language: null
      })
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by repository list with empty language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepositories(repositoryList, 'StaticAnalyzerAST_haaaa', {
        language: ''
      })
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by repository list with unknown language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepositories(repositoryList, 'StaticAnalyzerAST_fqlks', {
        language: 'unknownLanguage'
      })
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by repository list with invalid language option', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepositories(repositoryList, 'StaticAnalyzerAST_ftcph', {})
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by repository list with undefined options', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepositories(repositoryList, 'StaticAnalyzerAST_ftphh', undefined)
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by repository list with null options', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepositories(repositoryList, 'StaticAnalyzerAST_fttth', null)
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by repository list with undefined destination', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepositories(repositoryList, undefined, options)
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by repository list with null destination', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepositories(repositoryList, null, options)
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by repository list with empty destination', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepositories(repositoryList, '', options)
    ).rejects.toThrow(BadFormat)
  })

  it('identify a AST static analysis by repository list with unknown destination', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.identifyByRepositories(repositoryList, 'unknown', options)
    ).rejects.toThrow(AnalysisFail)
  })

  it('extract a AST static analysis by not found repository', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = new Repository('unknown', [])

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepository(repository, 'StaticAnalyzerAST_yccvg', options)
    ).rejects.toThrow(AnalysisFail)
  })

  it('extract a AST static analysis by undefined repository', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = undefined

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepository(repository, 'StaticAnalyzerAST_hhgde', options)
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by null repository', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = null

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepository(repository, 'StaticAnalyzerAST_puvfd', options)
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by a wrongly typed repository', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = {}

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepository(repository, 'StaticAnalyzerAST_dlgnr', options)
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by repository with undefined language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepository(repository, 'StaticAnalyzerAST_ykcvx', {
        language: undefined
      })
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by repository with null language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepository(repository, 'StaticAnalyzerAST_jhgqm', {
        language: null
      })
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by repository with empty language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepository(repository, 'StaticAnalyzerAST_gwprv', {
        language: ''
      })
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by repository with unknown language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepository(repository, 'StaticAnalyzerAST_fsrdf', {
        language: 'unknownLanguage'
      })
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by repository with invalid language option', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepository(repository, 'StaticAnalyzerAST_fsssr', {})
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by repository with undefined options', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepository(repository, 'StaticAnalyzerAST_fsrfs', undefined)
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by repository with null options', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepository(repository, 'StaticAnalyzerAST_drffd', null)
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by repository list with not found repositories', async () => {
    // Given

    let repositoryListUnknown = [new Repository('unknown', [])]
    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepositories(
        repositoryListUnknown,
        'StaticAnalyzerAST_kkhcv',
        options
      )
    ).rejects.toThrow(AnalysisFail)
  })

  it('extract a AST static analysis by undefined repository list', async () => {
    // Given

    let repositoryListUndefined = undefined
    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepositories(
        repositoryListUndefined,
        'StaticAnalyzerAST_hepjg',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by null repository list', async () => {
    // Given

    let repositoryListNull = null
    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepositories(
        repositoryListNull,
        'StaticAnalyzerAST_wwllf',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by repository list with undefined repositories', async () => {
    // Given

    let repositoryListUndefined = [undefined]
    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepositories(
        repositoryListUndefined,
        'StaticAnalyzerAST_gfgfs',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by repository list with null repositories', async () => {
    // Given

    let repositoryListNull = [null]
    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepositories(
        repositoryListNull,
        'StaticAnalyzerAST_ktoxw',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by empty repository list', async () => {
    // Given

    let repositoryListEmpty = []
    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepositories(
        repositoryListEmpty,
        'StaticAnalyzerAST_awpmq',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by repository list with undefined language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepositories(repositoryList, 'StaticAnalyzerAST_yhngr', {
        language: undefined
      })
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by repository list with null language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepositories(repositoryList, 'StaticAnalyzerAST_pwofg', {
        language: null
      })
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by repository list with empty language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepositories(repositoryList, '', 'StaticAnalyzerAST_diifg', {
        language: ''
      })
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by repository list with unknown language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepositories(repositoryList, 'StaticAnalyzerAST_nvvvv', {
        language: 'unknownLanguage'
      })
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by repository list with invalid language option', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepositories(repositoryList, 'StaticAnalyzerAST_nbnvv', {})
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by repository list with undefined options', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepositories(repositoryList, 'StaticAnalyzerAST_ncnvv', undefined)
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by repository list with null options', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepositories(repositoryList, 'StaticAnalyzerAST_nbbvv', null)
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by repository list with undefined destination', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepositories(repositoryList, undefined, options)
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by repository list with null destination', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepositories(repositoryList, null, options)
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by repository list with empty destination', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepositories(repositoryList, '', options)
    ).rejects.toThrow(BadFormat)
  })

  it('extract a AST static analysis by repository list with unknown destination', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.extractByRepositories(repositoryList, 'unknown', options)
    ).rejects.toThrow(AnalysisFail)
  })

  it('interpret a AST static analysis by undefined repository list', async () => {
    // Given

    let repositoryListUndefined = undefined
    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.interpretByRepositories(
        repositoryListUndefined,
        'StaticAnalyzerAST_ssugd',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a AST static analysis by null repository list', async () => {
    // Given

    let repositoryListNull = null
    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.interpretByRepositories(
        repositoryListNull,
        'StaticAnalyzerAST_pvbaq',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a AST static analysis by empty repository list', async () => {
    // Given

    let repositoryListEmpty = []
    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.interpretByRepositories(
        repositoryListEmpty,
        'StaticAnalyzerAST_rhods',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a AST static analysis by repository list with undefined language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.interpretByRepositories(repositoryList, 'StaticAnalyzerAST_picrsz', {
        language: undefined
      })
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a AST static analysis by repository list with null language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.interpretByRepositories(repositoryList, 'StaticAnalyzerAST_ibcvg', {
        language: null
      })
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a AST static analysis by repository list with empty language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.interpretByRepositories(repositoryList, 'StaticAnalyzerAST_yygfd', {
        language: ''
      })
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a AST static analysis by repository list with unknown language', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.interpretByRepositories(repositoryList, 'StaticAnalyzerAST_ebgbg', {
        language: 'unknownLanguage'
      })
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a AST static analysis by repository list with invalid language option', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.interpretByRepositories(repositoryList, 'StaticAnalyzerAST_ekvbg', {})
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a AST static analysis by repository list with undefined options', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.interpretByRepositories(
        repositoryList,
        'StaticAnalyzerAST_ekkvs',
        undefined
      )
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a AST static analysis by repository list with null options', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.interpretByRepositories(repositoryList, 'StaticAnalyzerAST_eghbd', null)
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a AST static analysis by repository list with undefined destination', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.interpretByRepositories(repositoryList, undefined, options)
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a AST static analysis by repository list with null destination', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.interpretByRepositories(repositoryList, null, options)
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a AST static analysis by repository list with empty destination', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    await expect(
      staticAnalyzerAST.interpretByRepositories(repositoryList, '', options)
    ).rejects.toThrow(BadFormat)
  })

  it('set a repository model instance with an undefined repository', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        undefined,
        'https://www.github.com/user/project/blob/master',
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        10,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        'javascript-api-express-call',
        'READ',
        'get',
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with a null repository', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        null,
        'https://www.github.com/user/project/blob/master',
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        10,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        'javascript-api-express-call',
        'READ',
        'get',
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with an undefined repository location', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        undefined,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        10,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        'javascript-api-express-call',
        'READ',
        'get',
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with a null repository location', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        null,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        10,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        'javascript-api-express-call',
        'READ',
        'get',
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with an empty repository location path', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        '',
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        10,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        'javascript-api-express-call',
        'READ',
        'get',
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with an undefined file location', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        'https://www.github.com/user/project/blob/master',
        undefined,
        10,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        'javascript-api-express-call',
        'READ',
        'get',
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with a null file location', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        'https://www.github.com/user/project/blob/master',
        null,
        10,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        'javascript-api-express-call',
        'READ',
        'get',
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with an empty file location path', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        'https://www.github.com/user/project/blob/master',
        '',
        10,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        'javascript-api-express-call',
        'READ',
        'get',
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with an undefined file number of lines of code', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        'https://www.github.com/user/project/blob/master',
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        undefined,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        'javascript-api-express-call',
        'READ',
        'get',
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with a null file number of lines of code', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        'https://www.github.com/user/project/blob/master',
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        null,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        'javascript-api-express-call',
        'READ',
        'get',
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with an undefined code fragment location', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        'https://www.github.com/user/project/blob/master',
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        10,
        undefined,
        'javascript-api-express-call',
        'READ',
        'get',
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with a null code fragment location', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        'https://www.github.com/user/project/blob/master',
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        10,
        null,
        'javascript-api-express-call',
        'READ',
        'get',
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with an empty code fragment location path', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        'https://www.github.com/user/project/blob/master',
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        10,
        '',
        'javascript-api-express-call',
        'READ',
        'get',
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with an undefined type', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        'https://www.github.com/user/project/blob/master',
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        10,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        undefined,
        'READ',
        'get',
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with a null type', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        'https://www.github.com/user/project/blob/master',
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        10,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        null,
        'READ',
        'get',
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with an empty type', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        'https://www.github.com/user/project/blob/master',
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        10,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        '',
        'READ',
        'get',
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with an undefined operation', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        'https://www.github.com/user/project/blob/master',
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        10,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        'javascript-api-express-call',
        undefined,
        'get',
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with a null operation', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        'https://www.github.com/user/project/blob/master',
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        10,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        'javascript-api-express-call',
        null,
        'get',
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with an empty operation', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        'https://www.github.com/user/project/blob/master',
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        10,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        'javascript-api-express-call',
        '',
        'get',
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with an undefined method', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        'https://www.github.com/user/project/blob/master',
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        10,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        'javascript-api-express-call',
        'READ',
        undefined,
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with a null method', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        'https://www.github.com/user/project/blob/master',
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        10,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        'javascript-api-express-call',
        'READ',
        null,
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with an empty method', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        'https://www.github.com/user/project/blob/master',
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        10,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        'javascript-api-express-call',
        'READ',
        '',
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with undefined heuristics', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        'https://www.github.com/user/project/blob/master',
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        10,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        'javascript-api-express-call',
        'READ',
        'get',
        "'/order/:order'",
        'order',
        undefined,
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with null heuristics', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        'https://www.github.com/user/project/blob/master',
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        10,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        'javascript-api-express-call',
        'READ',
        'get',
        "'/order/:order'",
        'order',
        null,
        '8'
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with an undefined score', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        'https://www.github.com/user/project/blob/master',
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        10,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        'javascript-api-express-call',
        'READ',
        'get',
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        undefined
      )
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with a null score', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then
    expect(() => {
      staticAnalyzerAST.setRepository(
        new Repository('https://www.github.com/user/project/blob/master', []),
        'https://www.github.com/user/project/blob/master',
        'https://www.github.com/user/project/blob/master/src/app/js/app.js',
        10,
        'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
        'javascript-api-express-call',
        'READ',
        'get',
        "'/order/:order'",
        'order',
        'E1E2E3E4E5E6E7E8',
        null
      )
    }).toThrow(BadFormat)
  })

  it('get a repository folder from a null name', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    expect(() => {
      staticAnalyzerAST.getRepositoryFolder(null, 'StaticAnalyzerAST_bvccd')
    }).toThrow(BadFormat)
  })

  it('get a repository folder from a undefined name', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    expect(() => {
      staticAnalyzerAST.getRepositoryFolder(undefined, 'StaticAnalyzerAST_dccsd')
    }).toThrow(BadFormat)
  })

  it('get a repository folder from an empty name', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    expect(() => {
      staticAnalyzerAST.getRepositoryFolder('', 'StaticAnalyzerAST_ppfsc')
    }).toThrow(BadFormat)
  })

  it('get a AST repository folder from a null name', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    expect(() => {
      staticAnalyzerAST.getCodeQLRepositoryFolder(null, 'StaticAnalyzerAST_xndjg')
    }).toThrow(BadFormat)
  })

  it('get a AST repository folder from a undefined name', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    expect(() => {
      staticAnalyzerAST.getCodeQLRepositoryFolder(undefined, 'StaticAnalyzerAST_dsdcc')
    }).toThrow(BadFormat)
  })

  it('get a AST repository folder from an empty name', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    expect(() => {
      staticAnalyzerAST.getCodeQLRepositoryFolder('', 'StaticAnalyzerAST_dchwr')
    }).toThrow(BadFormat)
  })

  it('get a result AST repository folder from a null name', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    expect(() => {
      staticAnalyzerAST.getResultCodeQLRepositoryFolder(null, 'StaticAnalyzerAST_nqsjf')
    }).toThrow(BadFormat)
  })

  it('get a result AST repository folder from a undefined name', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    expect(() => {
      staticAnalyzerAST.getResultCodeQLRepositoryFolder(undefined, 'StaticAnalyzerAST_llkbd')
    }).toThrow(BadFormat)
  })

  it('get a result AST repository folder from an empty name', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    expect(() => {
      staticAnalyzerAST.getResultCodeQLRepositoryFolder('', 'StaticAnalyzerAST_sqzvh')
    }).toThrow(BadFormat)
  })

  it('get a result AST repository file from a null name', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    expect(() => {
      staticAnalyzerAST.getResultCodeQLRepositoryFile(null, 'StaticAnalyzerAST_dddfm')
    }).toThrow(BadFormat)
  })

  it('get a result AST repository file from a undefined name', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    expect(() => {
      staticAnalyzerAST.getResultCodeQLRepositoryFile(undefined, 'StaticAnalyzerAST_ddcpm')
    }).toThrow(BadFormat)
  })

  it('get a result AST repository file from an empty name', async () => {
    // Given

    let staticAnalyzerAST = new StaticAnalyzerAST()

    // When Then

    expect(() => {
      staticAnalyzerAST.getResultCodeQLRepositoryFile('', 'StaticAnalyzerAST_qpamx')
    }).toThrow(BadFormat)
  })
})
