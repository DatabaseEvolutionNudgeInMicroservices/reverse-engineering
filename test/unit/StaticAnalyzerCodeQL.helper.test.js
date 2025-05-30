// Helpers

const StaticAnalyzerCodeQL = require('../../helper/StaticAnalyzerCodeQL.helper.js')

// Constants

const { FILE_SYSTEM_SEPARATOR, TEMP_FOLDER_NAME } = require('../../helper/Constant.helper')

// Libraries

const fs = require('fs')

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

const repositoryList = ['example']
const languages = ['javascript']

async function prepare(destination) {
  /// Preparing.
  fs.mkdirSync(
    process.cwd() + FILE_SYSTEM_SEPARATOR + TEMP_FOLDER_NAME + FILE_SYSTEM_SEPARATOR + destination
  )
  fs.mkdirSync(
    process.cwd() +
      FILE_SYSTEM_SEPARATOR +
      TEMP_FOLDER_NAME +
      FILE_SYSTEM_SEPARATOR +
      destination +
      FILE_SYSTEM_SEPARATOR +
      repositoryList[0]
  )
  fs.copyFileSync(
    process.cwd() +
      FILE_SYSTEM_SEPARATOR +
      'test' +
      FILE_SYSTEM_SEPARATOR +
      'unit' +
      FILE_SYSTEM_SEPARATOR +
      'asset' +
      FILE_SYSTEM_SEPARATOR +
      'index.example.js',
    process.cwd() +
      FILE_SYSTEM_SEPARATOR +
      TEMP_FOLDER_NAME +
      FILE_SYSTEM_SEPARATOR +
      destination +
      FILE_SYSTEM_SEPARATOR +
      repositoryList[0] +
      FILE_SYSTEM_SEPARATOR +
      'index.js'
  )
}

async function clean(destination) {
  // Cleaning.

  for (let i = 0; i < repositoryList.length; i++) {
    if (
      fs.existsSync(
        process.cwd() +
          FILE_SYSTEM_SEPARATOR +
          TEMP_FOLDER_NAME +
          FILE_SYSTEM_SEPARATOR +
          destination
      )
    ) {
      await fs.rmSync(
        process.cwd() +
          FILE_SYSTEM_SEPARATOR +
          TEMP_FOLDER_NAME +
          FILE_SYSTEM_SEPARATOR +
          destination,
        { recursive: true }
      )
    }
  }
}

// Happy path test suite

describe('CodeQL static analyzer', () => {
  it('initializes a CodeQL static analysis by repository', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    await prepare('StaticAnalyzerCodeQL_1')

    // When Then
    await staticAnalyzerCodeQL
      .initializesByElement(repositoryList[0], languages[0], 'StaticAnalyzerCodeQL_1')
      .then(async (result) => {
        const repositoryGenerated1 = fs.existsSync(
          process.cwd() +
            FILE_SYSTEM_SEPARATOR +
            TEMP_FOLDER_NAME +
            FILE_SYSTEM_SEPARATOR +
            'StaticAnalyzerCodeQL_1' +
            FILE_SYSTEM_SEPARATOR +
            repositoryList[0] +
            '-codeql'
        )
        const repositoryGenerated2 = fs.existsSync(
          process.cwd() +
            FILE_SYSTEM_SEPARATOR +
            TEMP_FOLDER_NAME +
            FILE_SYSTEM_SEPARATOR +
            'StaticAnalyzerCodeQL_1' +
            FILE_SYSTEM_SEPARATOR +
            repositoryList[0] +
            '-codeql' +
            FILE_SYSTEM_SEPARATOR +
            'result'
        )
        expect(repositoryGenerated1 && repositoryGenerated2).toBe(true)
        await clean('StaticAnalyzerCodeQL_1')
      })
  })

  it('initializes a CodeQL static analysis by repository list', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    await prepare('StaticAnalyzerCodeQL_2')

    // When Then

    await staticAnalyzerCodeQL
      .initializesByList([repositoryList[0]], languages[0], 'StaticAnalyzerCodeQL_2')
      .then(async (result) => {
        const repositoryGenerated1 = fs.existsSync(
          process.cwd() +
            FILE_SYSTEM_SEPARATOR +
            TEMP_FOLDER_NAME +
            FILE_SYSTEM_SEPARATOR +
            'StaticAnalyzerCodeQL_2' +
            FILE_SYSTEM_SEPARATOR +
            repositoryList[0] +
            '-codeql'
        )
        const repositoryGenerated2 = fs.existsSync(
          process.cwd() +
            FILE_SYSTEM_SEPARATOR +
            TEMP_FOLDER_NAME +
            FILE_SYSTEM_SEPARATOR +
            'StaticAnalyzerCodeQL_2' +
            FILE_SYSTEM_SEPARATOR +
            repositoryList[0] +
            '-codeql' +
            FILE_SYSTEM_SEPARATOR +
            'result'
        )
        expect(repositoryGenerated1 && repositoryGenerated2).toBe(true)
        await clean('StaticAnalyzerCodeQL_2')
      })
  })

  it('identifies a CodeQL static analysis by repository', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    await prepare('StaticAnalyzerCodeQL_3')

    // When Then
    await staticAnalyzerCodeQL
      .initializesByElement(repositoryList[0], languages[0], 'StaticAnalyzerCodeQL_3')
      .then(async (result) => {
        await staticAnalyzerCodeQL
          .identifyByElement(repositoryList[0], languages[0], 'StaticAnalyzerCodeQL_3')
          .then(async (result) => {
            const repositoryGenerated1 = fs.existsSync(
              process.cwd() +
                FILE_SYSTEM_SEPARATOR +
                TEMP_FOLDER_NAME +
                FILE_SYSTEM_SEPARATOR +
                'StaticAnalyzerCodeQL_3' +
                FILE_SYSTEM_SEPARATOR +
                repositoryList[0] +
                '-codeql' +
                FILE_SYSTEM_SEPARATOR +
                'result'
            )
            expect(repositoryGenerated1).toBe(true)
            await clean('StaticAnalyzerCodeQL_3')
          })
      })
  })

  it('identifies a CodeQL static analysis by repository list', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    await prepare('StaticAnalyzerCodeQL_4')

    // When Then
    await staticAnalyzerCodeQL
      .initializesByList([repositoryList[0]], languages[0], 'StaticAnalyzerCodeQL_4')
      .then(async (result) => {
        await staticAnalyzerCodeQL
          .identifyByList([repositoryList[0]], languages[0], 'StaticAnalyzerCodeQL_4')
          .then(async (result) => {
            const repositoryGenerated1 = fs.existsSync(
              process.cwd() +
                FILE_SYSTEM_SEPARATOR +
                TEMP_FOLDER_NAME +
                FILE_SYSTEM_SEPARATOR +
                'StaticAnalyzerCodeQL_4' +
                FILE_SYSTEM_SEPARATOR +
                repositoryList[0] +
                '-codeql' +
                FILE_SYSTEM_SEPARATOR +
                'result' +
                FILE_SYSTEM_SEPARATOR +
                'result.csv'
            )
            expect(repositoryGenerated1).toBe(true)
            await clean('StaticAnalyzerCodeQL_4')
          })
      })
  })

  it('extracts a CodeQL static analysis result by repository', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    await prepare('StaticAnalyzerCodeQL_5')

    // When Then
    await staticAnalyzerCodeQL
      .initializesByElement(repositoryList[0], languages[0], 'StaticAnalyzerCodeQL_5')
      .then(async (result) => {
        await staticAnalyzerCodeQL
          .identifyByElement(repositoryList[0], languages[0], 'StaticAnalyzerCodeQL_5')
          .then(async (result) => {
            await staticAnalyzerCodeQL
              .extractByElement(repositoryList[0], languages[0], 'StaticAnalyzerCodeQL_5')
              .then(async (result) => {
                let isArray = Array.isArray(result) && result.length > 0

                //console.log(result)

                const test1 = result.find(
                  (item) =>
                    item.type === 'javascript-api-express-call' &&
                    item.repository === 'example' &&
                    item.file === 'example/index.js' &&
                    item.location === 'example/index.js#L64C1-L85C2' &&
                    item.operation === 'READ' &&
                    item.method === 'get' &&
                    item.sample === "'/:order_id'" &&
                    item.fileNumberOfLinesOfCode === 90
                )

                const test2 = result.find(
                  (item) =>
                    item.type === 'javascript-db-mongo-call' &&
                    item.repository === 'example' &&
                    item.file === 'example/index.js' &&
                    item.location === 'example/index.js#L74C28-L74C77' &&
                    item.operation === 'READ' &&
                    item.method === 'collection.findOne' &&
                    item.sample === '{ _id : ... }' &&
                    item.fileNumberOfLinesOfCode === 90
                )

                const test3 = result.find(
                  (item) =>
                    item.type === 'javascript-db-redis-call' &&
                    item.repository === 'example' &&
                    item.file === 'example/index.js' &&
                    item.location === 'example/index.js#L33C3-L34C23' &&
                    item.operation === 'READ' &&
                    item.method === 'get' &&
                    item.sample === "'order_count'" &&
                    item.fileNumberOfLinesOfCode === 90
                )

                expect(
                  isArray && test1 !== undefined && test2 !== undefined && test3 !== undefined
                ).toBe(true)
                await clean('StaticAnalyzerCodeQL_5')
              })
          })
      })
  })

  it('extracts a CodeQL static analysis result by repository list', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    await prepare('StaticAnalyzerCodeQL_6')

    // When Then
    await staticAnalyzerCodeQL
      .initializesByList([repositoryList[0]], languages[0], 'StaticAnalyzerCodeQL_6')
      .then(async (result) => {
        await staticAnalyzerCodeQL
          .identifyByList([repositoryList[0]], languages[0], 'StaticAnalyzerCodeQL_6')
          .then(async (result) => {
            await staticAnalyzerCodeQL
              .extractByList([repositoryList[0]], languages[0], 'StaticAnalyzerCodeQL_6')
              .then(async (result) => {
                let isArray = Array.isArray(result[0]) && result[0].length > 0

                // console.log(result[0]);

                const test1 = result[0].find(
                  (item) =>
                    item.type === 'javascript-api-express-call' &&
                    item.repository === 'example' &&
                    item.file === 'example/index.js' &&
                    item.location === 'example/index.js#L64C1-L85C2' &&
                    item.operation === 'READ' &&
                    item.method === 'get' &&
                    item.sample === "'/:order_id'" &&
                    item.fileNumberOfLinesOfCode === 90
                )

                const test2 = result[0].find(
                  (item) =>
                    item.type === 'javascript-db-mongo-call' &&
                    item.repository === 'example' &&
                    item.file === 'example/index.js' &&
                    item.location === 'example/index.js#L74C28-L74C77' &&
                    item.operation === 'READ' &&
                    item.method === 'collection.findOne' &&
                    item.sample === '{ _id : ... }' &&
                    item.fileNumberOfLinesOfCode === 90
                )

                const test3 = result[0].find(
                  (item) =>
                    item.type === 'javascript-db-redis-call' &&
                    item.repository === 'example' &&
                    item.file === 'example/index.js' &&
                    item.location === 'example/index.js#L33C3-L34C23' &&
                    item.operation === 'READ' &&
                    item.method === 'get' &&
                    item.sample === "'order_count'" &&
                    item.fileNumberOfLinesOfCode === 90
                )

                expect(
                  isArray && test1 !== undefined && test2 !== undefined && test3 !== undefined
                ).toBe(true)
                await clean('StaticAnalyzerCodeQL_6')
              })
          })
      })
  })

  it('interprets a CodeQL static analysis result', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    await prepare('StaticAnalyzerCodeQL_7')

    // When Then
    await staticAnalyzerCodeQL
      .initializesByList([repositoryList[0]], languages[0], 'StaticAnalyzerCodeQL_7')
      .then(async (result) => {
        await staticAnalyzerCodeQL
          .identifyByList([repositoryList[0]], languages[0], 'StaticAnalyzerCodeQL_7')
          .then(async (result) => {
            await staticAnalyzerCodeQL
              .extractByList([repositoryList[0]], languages[0], 'StaticAnalyzerCodeQL_7')
              .then(async (result) => {
                await staticAnalyzerCodeQL
                  .interpretByList(result, languages[0], 'StaticAnalyzerCodeQL_7')
                  .then(async (result) => {
                    // console.log(JSON.stringify(result));

                    let test1_1 = result[0].getLocation() === 'example/'
                    let test1_2 = result[0].getDirectories()[0].getLocation() === 'example/'
                    let test1_3 =
                      result[0].getDirectories()[0].getFiles()[0].getLocation() ===
                      'example/index.js'
                    let test1_3_1 =
                      result[0].getDirectories()[0].getFiles()[0].getLinesOfCode() === 90
                    let codeFragment1 = result[0]
                      .getDirectories()[0]
                      .getFiles()[0]
                      .getCodeFragments()
                      .find(
                        (codeFragment) =>
                          codeFragment.getLocation() === 'example/index.js#L64C1-L85C2' &&
                          codeFragment.getTechnology().getId() === 'javascript-api-express-call'
                      )
                    let test1_4 =
                      codeFragment1.getTechnology().getId() === 'javascript-api-express-call'
                    let test1_5 = codeFragment1.getOperation().getName() === 'READ'
                    let test1_6 = codeFragment1.getMethod().getName() === 'get'
                    let test1_7 = codeFragment1.getSample().getContent() === "'/:order_id'"

                    let test2_1 = result[0].getLocation() === 'example/'
                    let test2_2 = result[0].getDirectories()[0].getLocation() === 'example/'
                    let test2_3 =
                      result[0].getDirectories()[0].getFiles()[0].getLocation() ===
                      'example/index.js'
                    let test2_3_1 =
                      result[0].getDirectories()[0].getFiles()[0].getLinesOfCode() === 90
                    let codeFragment2 = result[0]
                      .getDirectories()[0]
                      .getFiles()[0]
                      .getCodeFragments()
                      .find(
                        (codeFragment) =>
                          codeFragment.getLocation() === 'example/index.js#L74C28-L74C77' &&
                          codeFragment.getTechnology().getId() === 'javascript-db-mongo-call'
                      )
                    let test2_4 =
                      codeFragment2.getTechnology().getId() === 'javascript-db-mongo-call'
                    let test2_5 = codeFragment2.getOperation().getName() === 'READ'
                    let test2_6 = codeFragment2.getMethod().getName() === 'collection.findOne'
                    let test2_7 = codeFragment2.getSample().getContent() === '{ _id : ... }'

                    let test3_1 = result[0].getLocation() === 'example/'
                    let test3_2 = result[0].getDirectories()[0].getLocation() === 'example/'
                    let test3_3 =
                      result[0].getDirectories()[0].getFiles()[0].getLocation() ===
                      'example/index.js'
                    let test3_3_1 =
                      result[0].getDirectories()[0].getFiles()[0].getLinesOfCode() === 90
                    let codeFragment3 = result[0]
                      .getDirectories()[0]
                      .getFiles()[0]
                      .getCodeFragments()
                      .find(
                        (codeFragment) =>
                          codeFragment.getLocation() === 'example/index.js#L33C3-L34C23' &&
                          codeFragment.getTechnology().getId() === 'javascript-db-redis-call'
                      )
                    let test3_4 =
                      codeFragment3.getTechnology().getId() === 'javascript-db-redis-call'
                    let test3_5 = codeFragment3.getOperation().getName() === 'READ'
                    let test3_6 = codeFragment3.getMethod().getName() === 'get'
                    let test3_7 = codeFragment3.getSample().getContent() === "'order_count'"
                    let test3_8 = codeFragment3.getConcepts()[0].getName() === 'order count'

                    expect(
                      test1_1 &&
                        test1_2 &&
                        test1_3 &&
                        test1_3_1 &&
                        test1_4 &&
                        test1_5 &&
                        test1_6 &&
                        test1_7 &&
                        test2_1 &&
                        test2_2 &&
                        test2_3 &&
                        test2_3_1 &&
                        test2_4 &&
                        test2_5 &&
                        test2_6 &&
                        test2_7 &&
                        test3_1 &&
                        test3_2 &&
                        test3_3 &&
                        test3_3_1 &&
                        test3_4 &&
                        test3_5 &&
                        test3_6 &&
                        test3_7 &&
                        test3_8
                    ).toBe(true)

                    await clean('StaticAnalyzerCodeQL_7')
                  })
              })
          })
      })
  })

  it('interprets a CodeQL static analysis result with repository URL', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    await prepare('StaticAnalyzerCodeQL_8')

    // When Then
    await staticAnalyzerCodeQL
      .initializesByList([repositoryList[0]], languages[0], 'StaticAnalyzerCodeQL_8')
      .then(async (result) => {
        await staticAnalyzerCodeQL
          .identifyByList([repositoryList[0]], languages[0], 'StaticAnalyzerCodeQL_8')
          .then(async (result) => {
            // Creation of the denim file
            const denimFilePath =
              process.cwd() +
              FILE_SYSTEM_SEPARATOR +
              TEMP_FOLDER_NAME +
              FILE_SYSTEM_SEPARATOR +
              'StaticAnalyzerCodeQL_8' +
              FILE_SYSTEM_SEPARATOR +
              repositoryList[0] +
              FILE_SYSTEM_SEPARATOR +
              'denim'
            let url =
              'https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
            fs.writeFileSync(denimFilePath, url)

            await staticAnalyzerCodeQL
              .extractByList([repositoryList[0]], languages[0], 'StaticAnalyzerCodeQL_8')
              .then(async (result) => {
                await staticAnalyzerCodeQL
                  .interpretByList(result, languages[0], 'StaticAnalyzerCodeQL_8')
                  .then(async (result) => {
                    //console.log(JSON.stringify(result));

                    let test1_1 = result[0].getLocation() === url + '/'
                    let test1_2 = result[0].getDirectories()[0].getLocation() === url + '/'
                    let test1_3 =
                      result[0].getDirectories()[0].getFiles()[0].getLocation() ===
                      url + '/index.js'
                    let test1_3_1 =
                      result[0].getDirectories()[0].getFiles()[0].getLinesOfCode() === 90
                    let codeFragment1 = result[0]
                      .getDirectories()[0]
                      .getFiles()[0]
                      .getCodeFragments()
                      .find(
                        (codeFragment) =>
                          codeFragment.getLocation() === url + '/index.js#L64C1-L85C2' &&
                          codeFragment.getTechnology().getId() === 'javascript-api-express-call'
                      )
                    let test1_4 =
                      codeFragment1.getTechnology().getId() === 'javascript-api-express-call'
                    let test1_5 = codeFragment1.getOperation().getName() === 'READ'
                    let test1_6 = codeFragment1.getMethod().getName() === 'get'
                    let test1_7 = codeFragment1.getSample().getContent() === "'/:order_id'"

                    let test2_1 = result[0].getLocation() === url + '/'
                    let test2_2 = result[0].getDirectories()[0].getLocation() === url + '/'
                    let test2_3 =
                      result[0].getDirectories()[0].getFiles()[0].getLocation() ===
                      url + '/index.js'
                    let test2_3_1 =
                      result[0].getDirectories()[0].getFiles()[0].getLinesOfCode() === 90
                    let codeFragment2 = result[0]
                      .getDirectories()[0]
                      .getFiles()[0]
                      .getCodeFragments()
                      .find(
                        (codeFragment) =>
                          codeFragment.getLocation() === url + '/index.js#L74C28-L74C77' &&
                          codeFragment.getTechnology().getId() === 'javascript-db-mongo-call'
                      )
                    let test2_4 =
                      codeFragment2.getTechnology().getId() === 'javascript-db-mongo-call'
                    let test2_5 = codeFragment2.getOperation().getName() === 'READ'
                    let test2_6 = codeFragment2.getMethod().getName() === 'collection.findOne'
                    let test2_7 = codeFragment2.getSample().getContent() === '{ _id : ... }'

                    let test3_1 = result[0].getLocation() === url + '/'
                    let test3_2 = result[0].getDirectories()[0].getLocation() === url + '/'
                    let test3_3 =
                      result[0].getDirectories()[0].getFiles()[0].getLocation() ===
                      url + '/index.js'
                    let test3_3_1 =
                      result[0].getDirectories()[0].getFiles()[0].getLinesOfCode() === 90
                    let codeFragment3 = result[0]
                      .getDirectories()[0]
                      .getFiles()[0]
                      .getCodeFragments()
                      .find(
                        (codeFragment) =>
                          codeFragment.getLocation() === url + '/index.js#L33C3-L34C23' &&
                          codeFragment.getTechnology().getId() === 'javascript-db-redis-call'
                      )
                    let test3_4 =
                      codeFragment3.getTechnology().getId() === 'javascript-db-redis-call'
                    let test3_5 = codeFragment3.getOperation().getName() === 'READ'
                    let test3_6 = codeFragment3.getMethod().getName() === 'get'
                    let test3_7 = codeFragment3.getSample().getContent() === "'order_count'"
                    let test3_8 = codeFragment3.getConcepts()[0].getName() === 'order count'

                    expect(
                      test1_1 &&
                        test1_2 &&
                        test1_3 &&
                        test1_3_1 &&
                        test1_4 &&
                        test1_5 &&
                        test1_6 &&
                        test1_7 &&
                        test2_1 &&
                        test2_2 &&
                        test2_3 &&
                        test2_3_1 &&
                        test2_4 &&
                        test2_5 &&
                        test2_6 &&
                        test2_7 &&
                        test3_1 &&
                        test3_3_1 &&
                        test3_2 &&
                        test3_3 &&
                        test3_4 &&
                        test3_5 &&
                        test3_6 &&
                        test3_7 &&
                        test3_8
                    ).toBe(true)
                    await clean('StaticAnalyzerCodeQL_8')
                  })
              })
          })
      })
  })

  it('gets concepts extracted by NLP', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When

    let nlpExtractedConcepts = staticAnalyzerCodeQL.getConceptsByNLP(
      'room messages message project thread edit' +
        ' resolve reopen status compile stop user content contacts doc-deleted unarchive destroy raw peek' +
        ' health_check get_and_flush_if_old flush change accept flush_all_projects flush_queued_projects redis' +
        ' redis_cluster booking verify comment total build up down file public key count debug editor-event' +
        ' applied-ops queue-key all dangling date v'
    )
    // Count : 46

    // Then

    //console.log(nlpExtractedConcepts);
    //console.log(nlpExtractedConcepts.length);
    expect(nlpExtractedConcepts).toEqual([
      'room',
      'message',
      'message',
      'project',
      'thread',
      'edit',
      'resolve',
      'reopen',
      'status',
      'compile',
      'stop',
      'user',
      'content',
      'contact',
      'doc deleted',
      'unarchive',
      'destroy',
      'raw',
      'peek',
      'health check',
      'get and flush if old',
      'flush',
      'change',
      'accept',
      'flush all project',
      'flush queued project',
      'redis',
      'redis cluster',
      'booking',
      'verify',
      'comment',
      'total',
      'build',
      'up',
      'down',
      'file',
      'public',
      'key',
      'count',
      'debug',
      'editor event',
      'applied ops',
      'queue key',
      'all',
      'dangling',
      'date'
    ])
  })

  it('sorts by TD-IDF measure concepts extracted by NLP', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When

    let sortedConcepts = staticAnalyzerCodeQL.sortByTdIdf(
      ['count', 'order count', 'order', 'id', 'order id'],
      'count, order count, order id, order count, order, order id, order, order count,' +
        ' order count, order id, order count, order count, order count'
    )

    // Then

    //console.log(sortedConcepts);
    expect(sortedConcepts).toEqual([
      {
        name: 'order count',
        relevancy: 6.137056388801094
      },
      {
        name: 'order id',
        relevancy: 4.602792291600821
      },
      {
        name: 'order',
        relevancy: 3.6822338332806566
      },
      {
        name: 'count',
        relevancy: 2.4548225555204377
      },
      {
        name: 'id',
        relevancy: 0.9205584583201641
      }
    ])
  })

  it('sets a code fragment in the model', async () => {
    // Given
    let repositories = []
    let concepts = ['order']
    let fragment = {
      type: 'javascript-api-express-call',
      repository: 'https://www.github.com/user/project/blob/master',
      file: 'https://www.github.com/user/project/blob/master/src/app/js/app.js',
      location: 'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
      operation: 'READ',
      method: 'get',
      sample: "'/order/:order'",
      heuristics: 'E1E2E3E4E5E6E7E8',
      score: '8',
      fileNumberOfLinesOfCode: '10'
    }

    // When
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    repositories = staticAnalyzerCodeQL.setCodeFragment(fragment, concepts, repositories)

    //console.log(JSON.stringify(repositories))

    // Then
    expect(repositories).toEqual([
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
    ])
  })

  it('gets a repository folder from its name', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When

    let repositoryFolder = staticAnalyzerCodeQL.getRepositoryFolder(
      'example',
      'StaticAnalyzerCodeQL_9'
    )

    // Then

    expect(repositoryFolder).toContain(
      process.cwd() +
        FILE_SYSTEM_SEPARATOR +
        TEMP_FOLDER_NAME +
        FILE_SYSTEM_SEPARATOR +
        'StaticAnalyzerCodeQL_9' +
        FILE_SYSTEM_SEPARATOR +
        'example'
    )
  })

  it('gets a CodeQL repository folder from its name', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When

    let repositoryFolder = staticAnalyzerCodeQL.getCodeQLRepositoryFolder(
      'example',
      'StaticAnalyzerCodeQL_10'
    )

    // Then

    expect(repositoryFolder).toContain(
      process.cwd() +
        FILE_SYSTEM_SEPARATOR +
        TEMP_FOLDER_NAME +
        FILE_SYSTEM_SEPARATOR +
        'StaticAnalyzerCodeQL_10' +
        FILE_SYSTEM_SEPARATOR +
        'example-codeql'
    )
  })

  it('gets the query folder', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When

    let repositoryFolder = staticAnalyzerCodeQL.getQueryFolder()

    // Then

    expect(repositoryFolder).toContain('query')
  })

  it('gets a result CodeQL repository folder from its name', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When

    let repositoryFolder = staticAnalyzerCodeQL.getResultCodeQLRepositoryFile(
      'example',
      'StaticAnalyzerCodeQL_11'
    )

    // Then

    expect(repositoryFolder).toContain(
      process.cwd() +
        FILE_SYSTEM_SEPARATOR +
        TEMP_FOLDER_NAME +
        FILE_SYSTEM_SEPARATOR +
        'StaticAnalyzerCodeQL_11' +
        FILE_SYSTEM_SEPARATOR +
        'example-codeql' +
        FILE_SYSTEM_SEPARATOR +
        'result'
    )
  })

  it('gets a result CodeQL repository file from its name', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When

    let repositoryFolder = staticAnalyzerCodeQL.getResultCodeQLRepositoryFile(
      'example',
      'StaticAnalyzerCodeQL_12'
    )

    // Then

    expect(repositoryFolder).toContain(
      process.cwd() +
        FILE_SYSTEM_SEPARATOR +
        TEMP_FOLDER_NAME +
        FILE_SYSTEM_SEPARATOR +
        'StaticAnalyzerCodeQL_12' +
        FILE_SYSTEM_SEPARATOR +
        'example-codeql' +
        FILE_SYSTEM_SEPARATOR +
        'result' +
        FILE_SYSTEM_SEPARATOR +
        'result.csv'
    )
  })
})

// Failure cases test suite

describe('CodeQL static analyzer tries to', () => {
  afterEach(async () => {
    await clean()
  })

  it('initialize a CodeQL static analysis by not found repository', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    let repository = 'unknown'

    // When Then

    await expect(
      staticAnalyzerCodeQL.initializesByElement(repository, languages[0], 'StaticAnalyzerCodeQL_13')
    ).rejects.toThrow(AnalysisFail)
  })

  it('initialize a CodeQL static analysis by undefined repository', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    let repository = undefined

    // When Then

    await expect(
      staticAnalyzerCodeQL.initializesByElement(repository, languages[0], 'StaticAnalyzerCodeQL_14')
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a CodeQL static analysis by null repository', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    let repository = null

    // When Then

    await expect(
      staticAnalyzerCodeQL.initializesByElement(repository, languages[0], 'StaticAnalyzerCodeQL_15')
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a CodeQL static analysis by null repository with undefined language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerCodeQL.initializesByElement(repository, undefined, 'StaticAnalyzerCodeQL_16')
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a CodeQL static analysis by null repository with null language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerCodeQL.initializesByElement(repository, null, 'StaticAnalyzerCodeQL_17')
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a CodeQL static analysis by null repository with empty language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerCodeQL.initializesByElement(repository, '', 'StaticAnalyzerCodeQL_18')
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a CodeQL static analysis by null repository with unknown language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerCodeQL.initializesByElement(
        repository,
        'unknownLanguage',
        'StaticAnalyzerCodeQL_19'
      )
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a CodeQL static analysis by repository list with not found repositories', async () => {
    // Given

    let repositoryList = ['unknown']
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.initializesByList(
        repositoryList,
        languages[0],
        'StaticAnalyzerCodeQL_20'
      )
    ).rejects.toThrow(AnalysisFail)
  })

  it('initialize a CodeQL static analysis by undefined repository list', async () => {
    // Given

    let repositoryList = undefined
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.initializesByList(
        repositoryList,
        languages[0],
        'StaticAnalyzerCodeQL_21'
      )
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a CodeQL static analysis by null repository list', async () => {
    // Given

    let repositoryList = null
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.initializesByList(
        repositoryList,
        languages[0],
        'StaticAnalyzerCodeQL_22'
      )
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a CodeQL static analysis by repository list with undefined repositories', async () => {
    // Given

    let repositoryList = [undefined]
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.initializesByList(
        repositoryList,
        languages[0],
        'StaticAnalyzerCodeQL_23'
      )
    ).rejects.toThrow(AnalysisFail)
  })

  it('initialize a CodeQL static analysis by repository list with null repositories', async () => {
    // Given

    let repositoryList = [null]
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.initializesByList(
        repositoryList,
        languages[0],
        'StaticAnalyzerCodeQL_24'
      )
    ).rejects.toThrow(AnalysisFail)
  })

  it('initialize a CodeQL static analysis by empty repository list', async () => {
    // Given

    let repositoryList = []
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.initializesByList(
        repositoryList,
        languages[0],
        'StaticAnalyzerCodeQL_25'
      )
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a CodeQL static analysis by repository list with undefined language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.initializesByList(repositoryList, undefined, 'StaticAnalyzerCodeQL_26')
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a CodeQL static analysis by repository list with null language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.initializesByList(repositoryList, null, 'StaticAnalyzerCodeQL_27')
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a CodeQL static analysis by repository list with empty language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.initializesByList(repositoryList, '', 'StaticAnalyzerCodeQL_28')
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a CodeQL static analysis by repository list with unknown language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.initializesByList(
        repositoryList,
        'unknownLanguage',
        'StaticAnalyzerCodeQL_29'
      )
    ).rejects.toThrow(BadFormat)
  })

  it('identify a CodeQL static analysis by not found repository', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    let repository = 'unknown'

    // When Then

    await expect(
      staticAnalyzerCodeQL.identifyByElement(repository, languages[0], 'StaticAnalyzerCodeQL_30')
    ).rejects.toThrow(AnalysisFail)
  })

  it('identify a CodeQL static analysis by undefined repository', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    let repository = undefined

    // When Then

    await expect(
      staticAnalyzerCodeQL.identifyByElement(repository, languages[0], 'StaticAnalyzerCodeQL_31')
    ).rejects.toThrow(BadFormat)
  })

  it('identify a CodeQL static analysis by null repository', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    let repository = null

    // When Then

    await expect(
      staticAnalyzerCodeQL.identifyByElement(repository, languages[0], 'StaticAnalyzerCodeQL_32')
    ).rejects.toThrow(BadFormat)
  })

  it('identify a CodeQL static analysis by null repository with undefined language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerCodeQL.identifyByElement(repository, undefined, 'StaticAnalyzerCodeQL_33')
    ).rejects.toThrow(BadFormat)
  })

  it('identify a CodeQL static analysis by null repository with null language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerCodeQL.identifyByElement(repository, null, 'StaticAnalyzerCodeQL_34')
    ).rejects.toThrow(BadFormat)
  })

  it('identify a CodeQL static analysis by null repository with empty language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerCodeQL.identifyByElement(repository, '', 'StaticAnalyzerCodeQL_35')
    ).rejects.toThrow(BadFormat)
  })

  it('identify a CodeQL static analysis by null repository with unknown language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerCodeQL.identifyByElement(
        repository,
        'unknownLanguage',
        'StaticAnalyzerCodeQL_36'
      )
    ).rejects.toThrow(BadFormat)
  })

  it('identify a CodeQL static analysis by repository list with not found repositories', async () => {
    // Given

    let repositoryList = ['unknown']
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.identifyByList(repositoryList, languages[0], 'StaticAnalyzerCodeQL_37')
    ).rejects.toThrow(AnalysisFail)
  })

  it('identify a CodeQL static analysis by undefined repository list', async () => {
    // Given

    let repositoryList = undefined
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.identifyByList(repositoryList, languages[0], 'StaticAnalyzerCodeQL_38')
    ).rejects.toThrow(BadFormat)
  })

  it('identify a CodeQL static analysis by null repository list', async () => {
    // Given

    let repositoryList = null
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.identifyByList(repositoryList, languages[0], 'StaticAnalyzerCodeQL_39')
    ).rejects.toThrow(BadFormat)
  })

  it('identify a CodeQL static analysis by repository list with undefined repositories', async () => {
    // Given

    let repositoryList = [undefined]
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.identifyByList(repositoryList, languages[0], 'StaticAnalyzerCodeQL_40')
    ).rejects.toThrow(AnalysisFail)
  })

  it('identify a CodeQL static analysis by repository list with null repositories', async () => {
    // Given

    let repositoryList = [null]
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.identifyByList(repositoryList, languages[0], 'StaticAnalyzerCodeQL_41')
    ).rejects.toThrow(AnalysisFail)
  })

  it('identify a CodeQL static analysis by empty repository list', async () => {
    // Given

    let repositoryList = []
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.identifyByList(repositoryList, languages[0], 'StaticAnalyzerCodeQL_42')
    ).rejects.toThrow(BadFormat)
  })

  it('identify a CodeQL static analysis by repository list with undefined language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.identifyByList(repositoryList, undefined, 'StaticAnalyzerCodeQL_43')
    ).rejects.toThrow(BadFormat)
  })

  it('identify a CodeQL static analysis by repository list with null language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.identifyByList(repositoryList, null, 'StaticAnalyzerCodeQL_44')
    ).rejects.toThrow(BadFormat)
  })

  it('identify a CodeQL static analysis by repository list with empty language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.identifyByList(repositoryList, '', 'StaticAnalyzerCodeQL_45')
    ).rejects.toThrow(BadFormat)
  })

  it('identify a CodeQL static analysis by repository list with unknown language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.identifyByList(
        repositoryList,
        'unknownLanguage',
        'StaticAnalyzerCodeQL_46'
      )
    ).rejects.toThrow(BadFormat)
  })

  it('extract a CodeQL static analysis by not found repository', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    let repository = 'unknown'

    // When Then

    await expect(
      staticAnalyzerCodeQL.extractByElement(repository, languages[0], 'StaticAnalyzerCodeQL_47')
    ).rejects.toThrow(AnalysisFail)
  })

  it('extract a CodeQL static analysis by undefined repository', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    let repository = undefined

    // When Then

    await expect(
      staticAnalyzerCodeQL.extractByElement(repository, languages[0], 'StaticAnalyzerCodeQL_48')
    ).rejects.toThrow(BadFormat)
  })

  it('extract a CodeQL static analysis by null repository', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    let repository = null

    // When Then

    await expect(
      staticAnalyzerCodeQL.extractByElement(repository, languages[0], 'StaticAnalyzerCodeQL_49')
    ).rejects.toThrow(BadFormat)
  })

  it('extract a CodeQL static analysis by repository with undefined language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerCodeQL.extractByElement(repository, undefined, 'StaticAnalyzerCodeQL_50')
    ).rejects.toThrow(BadFormat)
  })

  it('extract a CodeQL static analysis by repository with null language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerCodeQL.extractByElement(repository, null, 'StaticAnalyzerCodeQL_51')
    ).rejects.toThrow(BadFormat)
  })

  it('extract a CodeQL static analysis by repository with empty language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerCodeQL.extractByElement(repository, '', 'StaticAnalyzerCodeQL_52')
    ).rejects.toThrow(BadFormat)
  })

  it('extract a CodeQL static analysis by repository with unknown language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerCodeQL.extractByElement(
        repository,
        'unknownLanguage',
        'StaticAnalyzerCodeQL_53'
      )
    ).rejects.toThrow(BadFormat)
  })

  it('extract a CodeQL static analysis by repository list with not found repositories', async () => {
    // Given

    let repositoryList = ['unknown']
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.extractByList(repositoryList, languages[0], 'StaticAnalyzerCodeQL_54')
    ).rejects.toThrow(AnalysisFail)
  })

  it('extract a CodeQL static analysis by undefined repository list', async () => {
    // Given

    let repositoryList = undefined
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.extractByList(repositoryList, languages[0], 'StaticAnalyzerCodeQL_55')
    ).rejects.toThrow(BadFormat)
  })

  it('extract a CodeQL static analysis by null repository list', async () => {
    // Given

    let repositoryList = null
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.extractByList(repositoryList, languages[0], 'StaticAnalyzerCodeQL_56')
    ).rejects.toThrow(BadFormat)
  })

  it('extract a CodeQL static analysis by repository list with undefined repositories', async () => {
    // Given

    let repositoryList = [undefined]
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.extractByList(repositoryList, languages[0], 'StaticAnalyzerCodeQL_57')
    ).rejects.toThrow(BadFormat)
  })

  it('extract a CodeQL static analysis by repository list with null repositories', async () => {
    // Given

    let repositoryList = [null]
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.extractByList(repositoryList, languages[0], 'StaticAnalyzerCodeQL_58')
    ).rejects.toThrow(BadFormat)
  })

  it('extract a CodeQL static analysis by empty repository list', async () => {
    // Given

    let repositoryList = []
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.extractByList(repositoryList, languages[0], 'StaticAnalyzerCodeQL_59')
    ).rejects.toThrow(BadFormat)
  })

  it('extract a CodeQL static analysis by repository list with undefined language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.extractByList(repositoryList, undefined, 'StaticAnalyzerCodeQL_60')
    ).rejects.toThrow(BadFormat)
  })

  it('extract a CodeQL static analysis by repository list with null language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.extractByList(repositoryList, null, 'StaticAnalyzerCodeQL_61')
    ).rejects.toThrow(BadFormat)
  })

  it('extract a CodeQL static analysis by repository list with empty language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.extractByList(repositoryList, '', 'StaticAnalyzerCodeQL_61')
    ).rejects.toThrow(BadFormat)
  })

  it('extract a CodeQL static analysis by repository list with unknown language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.extractByList(
        repositoryList,
        'unknownLanguage',
        'StaticAnalyzerCodeQL_62'
      )
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a CodeQL static analysis by undefined repository list', async () => {
    // Given

    let repositoryList = undefined
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.interpretByList(repositoryList, languages[0], 'StaticAnalyzerCodeQL_63')
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a CodeQL static analysis by null repository list', async () => {
    // Given

    let repositoryList = null
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.interpretByList(repositoryList, languages[0], 'StaticAnalyzerCodeQL_64')
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a CodeQL static analysis by empty repository list', async () => {
    // Given

    let repositoryList = []
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.interpretByList(repositoryList, languages[0], 'StaticAnalyzerCodeQL_65')
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a CodeQL static analysis by repository list with undefined language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.interpretByList(repositoryList, undefined, 'StaticAnalyzerCodeQL_66')
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a CodeQL static analysis by repository list with null language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.interpretByList(repositoryList, null, 'StaticAnalyzerCodeQL_67')
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a CodeQL static analysis by repository list with empty language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.interpretByList(repositoryList, '', 'StaticAnalyzerCodeQL_68')
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a CodeQL static analysis by repository list with unknown language', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    await expect(
      staticAnalyzerCodeQL.interpretByList(
        repositoryList,
        'unknownLanguage',
        'StaticAnalyzerCodeQL_69'
      )
    ).rejects.toThrow(BadFormat)
  })

  it('get concepts extracted by NPL from null data', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    expect(staticAnalyzerCodeQL.getConceptsByNLP(null)).toEqual([])
  })

  it('get concepts extracted by NPL from undefined data', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    expect(staticAnalyzerCodeQL.getConceptsByNLP(undefined)).toEqual([])
  })

  it('get concepts extracted by NPL from empty data', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    expect(staticAnalyzerCodeQL.getConceptsByNLP('')).toEqual([])
  })

  it('sort by TD-IDF concepts extracted by NPL from null data', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    expect(
      staticAnalyzerCodeQL.sortByTdIdf(
        null,
        'count, order count, order id, order count, order, order id, order, order count,' +
          ' order count, order id, order count, order count, order count'
      )
    ).toEqual([])
  })

  it('sort by TD-IDF concepts extracted by NPL from undefined data', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    expect(
      staticAnalyzerCodeQL.sortByTdIdf(
        undefined,
        'count, order count, order id, order count, order, order id, order, order count,' +
          ' order count, order id, order count, order count, order count'
      )
    ).toEqual([])
  })

  it('sort by TD-IDF concepts extracted by NPL from empty data', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    expect(
      staticAnalyzerCodeQL.sortByTdIdf(
        [],
        'count, order count, order id, order count, order, order id, order, order count,' +
          ' order count, order id, order count, order count, order count'
      )
    ).toEqual([])
  })

  it('sort by TD-IDF concepts extracted by NPL from null reference document', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    expect(
      staticAnalyzerCodeQL.sortByTdIdf(['count', 'order count', 'order', 'id', 'order id'], null)
    ).toEqual(['count', 'order count', 'order', 'id', 'order id'])
  })

  it('sort by TD-IDF concepts extracted by NPL from undefined reference document', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    expect(
      staticAnalyzerCodeQL.sortByTdIdf(
        ['count', 'order count', 'order', 'id', 'order id'],
        undefined
      )
    ).toEqual(['count', 'order count', 'order', 'id', 'order id'])
  })

  it('sort by TD-IDF concepts extracted by NPL from empty reference document', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    expect(
      staticAnalyzerCodeQL.sortByTdIdf(['count', 'order count', 'order', 'id', 'order id'], '')
    ).toEqual(['count', 'order count', 'order', 'id', 'order id'])
  })

  it('set an undefined code fragment in the model', async () => {
    // Given
    let repositories = []
    let concepts = ['order']
    let fragment = undefined

    // When
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    repositories = staticAnalyzerCodeQL.setCodeFragment(fragment, concepts, repositories)

    // Then
    expect(repositories).toEqual([])
  })

  it('set a null code fragment in the model', async () => {
    // Given
    let repositories = []
    let concepts = ['order']
    let fragment = null

    // When
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    repositories = staticAnalyzerCodeQL.setCodeFragment(fragment, concepts, repositories)

    // Then
    expect(repositories).toEqual([])
  })

  it('set an undefined concepts list in the model', async () => {
    // Given
    let repositories = []
    let concepts = undefined
    let fragment = {
      type: 'javascript-api-express-call',
      repository: 'https://www.github.com/user/project/blob/master',
      file: 'https://www.github.com/user/project/blob/master/src/app/js/app.js',
      location: 'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
      operation: 'READ',
      method: 'get',
      sample: "'/order/:order'",
      heuristics: 'E1E2E3E4E5E6E7E8',
      score: '8'
    }

    // When
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    repositories = staticAnalyzerCodeQL.setCodeFragment(fragment, concepts, repositories)

    // Then
    expect(repositories).toEqual([])
  })

  it('set a null concepts list in the model', async () => {
    // Given
    let repositories = []
    let concepts = null
    let fragment = {
      type: 'javascript-api-express-call',
      repository: 'https://www.github.com/user/project/blob/master/',
      file: 'https://www.github.com/user/project/blob/master/src/app/js/app.js',
      location: 'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
      operation: 'READ',
      method: 'get',
      sample: "'/order/:order'",
      heuristics: 'E1E2E3E4E5E6E7E8',
      score: '8'
    }

    // When
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    repositories = staticAnalyzerCodeQL.setCodeFragment(fragment, concepts, repositories)

    // Then
    expect(repositories).toEqual([])
  })

  it('set an undefined repositories list in the model', async () => {
    // Given
    let repositories = undefined
    let concepts = ['order']
    let fragment = {
      type: 'javascript-api-express-call',
      repository: 'https://www.github.com/user/project/blob/master/',
      file: 'https://www.github.com/user/project/blob/master/src/app/js/app.js',
      location: 'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
      operation: 'READ',
      method: 'get',
      sample: "'/order/:order'",
      heuristics: 'E1E2E3E4E5E6E7E8',
      score: '8'
    }

    // When
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    repositories = staticAnalyzerCodeQL.setCodeFragment(fragment, concepts, repositories)

    // Then
    expect(repositories).toEqual(undefined)
  })

  it('set a null repositories list in the model', async () => {
    // Given
    let repositories = null
    let concepts = ['order']
    let fragment = {
      type: 'javascript-api-express-call',
      repository: 'https://www.github.com/user/project/blob/master/',
      file: 'https://www.github.com/user/project/blob/master/src/app/js/app.js',
      location: 'https://www.github.com/user/project/blob/master/src/app/js/app.js#L1C1-L2C2',
      operation: 'READ',
      method: 'get',
      sample: "'/order/:order'",
      heuristics: 'E1E2E3E4E5E6E7E8',
      score: '8'
    }

    // When
    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()
    repositories = staticAnalyzerCodeQL.setCodeFragment(fragment, concepts, repositories)

    // Then
    expect(repositories).toEqual(null)
  })

  it('get a repository folder from a null name', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    expect(() => {
      staticAnalyzerCodeQL.getRepositoryFolder(null, 'StaticAnalyzerCodeQL_70')
    }).toThrow(BadFormat)
  })

  it('get a repository folder from a undefined name', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    expect(() => {
      staticAnalyzerCodeQL.getRepositoryFolder(undefined)
    }).toThrow(BadFormat)
  })

  it('get a repository folder from an empty name', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    expect(() => {
      staticAnalyzerCodeQL.getRepositoryFolder('', 'StaticAnalyzerCodeQL_71')
    }).toThrow(BadFormat)
  })

  it('get a CodeQL repository folder from a null name', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    expect(() => {
      staticAnalyzerCodeQL.getCodeQLRepositoryFolder(null, 'StaticAnalyzerCodeQL_72')
    }).toThrow(BadFormat)
  })

  it('get a CodeQL repository folder from a undefined name', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    expect(() => {
      staticAnalyzerCodeQL.getCodeQLRepositoryFolder(undefined, 'StaticAnalyzerCodeQL_73')
    }).toThrow(BadFormat)
  })

  it('get a CodeQL repository folder from an empty name', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    expect(() => {
      staticAnalyzerCodeQL.getCodeQLRepositoryFolder('', 'StaticAnalyzerCodeQL_74')
    }).toThrow(BadFormat)
  })

  it('get a result CodeQL repository folder from a null name', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    expect(() => {
      staticAnalyzerCodeQL.getResultCodeQLRepositoryFolder(null, 'StaticAnalyzerCodeQL_75')
    }).toThrow(BadFormat)
  })

  it('get a result CodeQL repository folder from a undefined name', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    expect(() => {
      staticAnalyzerCodeQL.getResultCodeQLRepositoryFolder(undefined, 'StaticAnalyzerCodeQL_76')
    }).toThrow(BadFormat)
  })

  it('get a result CodeQL repository folder from an empty name', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    expect(() => {
      staticAnalyzerCodeQL.getResultCodeQLRepositoryFolder('', 'StaticAnalyzerCodeQL_77')
    }).toThrow(BadFormat)
  })

  it('get a result CodeQL repository file from a null name', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    expect(() => {
      staticAnalyzerCodeQL.getResultCodeQLRepositoryFile(null, 'StaticAnalyzerCodeQL_78')
    }).toThrow(BadFormat)
  })

  it('get a result CodeQL repository file from a undefined name', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    expect(() => {
      staticAnalyzerCodeQL.getResultCodeQLRepositoryFile(undefined, 'StaticAnalyzerCodeQL_79')
    }).toThrow(BadFormat)
  })

  it('get a result CodeQL repository file from an empty name', async () => {
    // Given

    let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL()

    // When Then

    expect(() => {
      staticAnalyzerCodeQL.getResultCodeQLRepositoryFile('', 'StaticAnalyzerCodeQL_80')
    }).toThrow(BadFormat)
  })
})
