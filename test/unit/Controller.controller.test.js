// Controllers

const Controller = require('../../controller/Controller.controller.js')

// Errors

const DownloadFail = require('../../error/DownloadFail.error.js')
const BadFormat = require('../../error/BadFormat.error.js')

// Imports

const path = require('path')

// Setup

const languages = ['javascript']
const options = { language: languages[0] }
const optionsWithHints = {
  language: languages[0],
  hints: {
    out: [
      'express',
      'app',
      'json',
      'request',
      'status',
      'message',
      'response',
      'error',
      'mongodb',
      'mongo',
      'db',
      'collection',
      'redis',
      'redis client',
      'connect',
      'close'
    ],
    in: ['count', 'order', 'order count']
  }
}
const exampleRepository = path.join(process.cwd(), 'test', 'unit', 'asset', 'example.zip')

// Happy path test suite

describe('Controller', () => {
  it('analyzes statically a repository with AST', async () => {
    // Given

    let controller = new Controller()
    const NLP = require('../../helper/NLP.helper')
    const mockResult = [] // Obtained by executing manually the application.
    jest.spyOn(NLP.prototype, 'classifyConcept').mockResolvedValue(mockResult)

    // When Then

    await controller.analyzeStaticallyAST(exampleRepository, options).then((result) => {
      //console.log(JSON.stringify(result))

      // When Then
      expect(JSON.stringify(result)).toEqual(
        '[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/","directories":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/","directories":[],"files":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js","linesOfCode":85,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L0C0-L0C0","technology":{"id":"javascript-any-any-file"},"operation":{"name":"OTHER"},"method":{"name":" "},"sample":{"content":" "},"concepts":[],"heuristics":"A1","score":"1"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L30C1-L39C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/count\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L31C5-L31C34","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[],"heuristics":"E1E2E6E7","score":"4"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L41C1-L57C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L59C1-L80C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/:order_id\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L82C1-L111C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"CREATE"},"method":{"name":"post"},"sample":{"content":"\'/\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L89C33-L89C62","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[],"heuristics":"E1E2E6E7","score":"4"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L45C28-L45C50","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"db.collection"},"sample":{"content":"\'orders\'"},"concepts":[],"heuristics":"M1M2M3M4M5M6","score":"6"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L46C32-L46C50","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"collection.find"},"sample":{"content":"{}"},"concepts":[],"heuristics":"M1M2M3M4M5","score":"5"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L68C28-L68C50","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"db.collection"},"sample":{"content":"\'orders\'"},"concepts":[],"heuristics":"M1M2M3M4M5M6","score":"6"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L69C32-L69C79","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"collection.findOne"},"sample":{"content":"{ _id : ... }"},"concepts":[],"heuristics":"M1M2M3M4M5","score":"5"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L99C28-L99C50","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"db.collection"},"sample":{"content":"\'orders\'"},"concepts":[],"heuristics":"M1M2M3M4M5M6","score":"6"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L100C32-L100C58","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"CREATE"},"method":{"name":"collection.insertOne"},"sample":{"content":"order"},"concepts":[],"heuristics":"M1M3M4M5","score":"4"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L30C1-L39C2","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/count\'"},"concepts":[],"heuristics":"R1R4R5","score":"3"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L31C5-L31C34","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[],"heuristics":"R1R2R3R4R5R6","score":"6"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L41C1-L57C2","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/\'"},"concepts":[],"heuristics":"R1R4R5","score":"3"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L59C1-L80C2","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/:order_id\'"},"concepts":[],"heuristics":"R1R4R5","score":"3"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L89C33-L89C62","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[],"heuristics":"R1R2R3R4R5R6","score":"6"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L91C19-L91C51","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"UPDATE"},"method":{"name":"set"},"sample":{"content":"\'order_count\'"},"concepts":[],"heuristics":"R1R2R3R4R5R6","score":"6"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L93C19-L93C84","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"UPDATE"},"method":{"name":"set"},"sample":{"content":"\'order_count\'"},"concepts":[],"heuristics":"R1R2R3R4R5R6","score":"6"}]}]}]}]'
      )
    })
  })

  it('analyzes statically a repository with AST and keywords hints', async () => {
    // Given

    let controller = new Controller()
    const NLP = require('../../helper/NLP.helper')
    const mockResult = ['count', 'order', 'order count'] // Obtained by executing manually the application.
    jest.spyOn(NLP.prototype, 'classifyConcept').mockResolvedValue(mockResult)

    // When Then

    await controller.analyzeStaticallyAST(exampleRepository, options).then((result) => {
      //console.log(JSON.stringify(result))

      // When Then
      expect(JSON.stringify(result)).toEqual(
        '[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/","directories":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/","directories":[],"files":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js","linesOfCode":85,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L0C0-L0C0","technology":{"id":"javascript-any-any-file"},"operation":{"name":"OTHER"},"method":{"name":" "},"sample":{"content":" "},"concepts":[],"heuristics":"A1","score":"1"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L30C1-L39C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/count\'"},"concepts":[{"name":"count"}],"heuristics":"E0E1E2E3E4E5E6E7E8","score":"9"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L31C5-L31C34","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[],"heuristics":"E1E2E6E7","score":"4"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L41C1-L57C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L59C1-L80C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/:order_id\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L82C1-L111C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"CREATE"},"method":{"name":"post"},"sample":{"content":"\'/\'"},"concepts":[],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L89C33-L89C62","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[],"heuristics":"E1E2E6E7","score":"4"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L45C28-L45C50","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"db.collection"},"sample":{"content":"\'orders\'"},"concepts":[{"name":"order"}],"heuristics":"M0M1M2M3M4M5M6","score":"7"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L46C32-L46C50","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"collection.find"},"sample":{"content":"{}"},"concepts":[],"heuristics":"M1M2M3M4M5","score":"5"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L68C28-L68C50","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"db.collection"},"sample":{"content":"\'orders\'"},"concepts":[{"name":"order"}],"heuristics":"M0M1M2M3M4M5M6","score":"7"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L69C32-L69C79","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"collection.findOne"},"sample":{"content":"{ _id : ... }"},"concepts":[],"heuristics":"M1M2M3M4M5","score":"5"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L99C28-L99C50","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"db.collection"},"sample":{"content":"\'orders\'"},"concepts":[{"name":"order"}],"heuristics":"M0M1M2M3M4M5M6","score":"7"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L100C32-L100C58","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"CREATE"},"method":{"name":"collection.insertOne"},"sample":{"content":"order"},"concepts":[],"heuristics":"M1M3M4M5","score":"4"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L30C1-L39C2","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/count\'"},"concepts":[],"heuristics":"R1R4R5","score":"3"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L31C5-L31C34","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[{"name":"order count"}],"heuristics":"R0R1R2R3R4R5R6","score":"7"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L41C1-L57C2","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/\'"},"concepts":[],"heuristics":"R1R4R5","score":"3"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L59C1-L80C2","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/:order_id\'"},"concepts":[],"heuristics":"R1R4R5","score":"3"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L89C33-L89C62","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'order_count\'"},"concepts":[{"name":"order count"}],"heuristics":"R0R1R2R3R4R5R6","score":"7"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L91C19-L91C51","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"UPDATE"},"method":{"name":"set"},"sample":{"content":"\'order_count\'"},"concepts":[{"name":"order count"}],"heuristics":"R0R1R2R3R4R5R6","score":"7"},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L93C19-L93C84","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"UPDATE"},"method":{"name":"set"},"sample":{"content":"\'order_count\'"},"concepts":[{"name":"order count"}],"heuristics":"R0R1R2R3R4R5R6","score":"7"}]}]}]}]'
      )
    })
  })

  it('analyzes statically a repository with NLP TR', async () => {
    // Given

    let controller = new Controller()
    const NLP = require('../../helper/NLP.helper')
    const mockResult = ['']
    jest.spyOn(NLP.prototype, 'classifyConcept').mockResolvedValue(mockResult)

    // When Then

    await controller.analyzeStaticallyNLPTR(exampleRepository, options).then((result) => {
      //console.log(JSON.stringify(result, null, 4))

      // When Then
      expect(JSON.stringify(result)).toEqual(
        '[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/","directories":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/","directories":[],"files":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js","linesOfCode":85,"codeFragments":[]}]}]}]'
      )
    })
  })

  it('analyzes statically a repository with NLP TR and keyword hints', async () => {
    // Given

    let controller = new Controller()
    const NLP = require('../../helper/NLP.helper')
    const mockResult = ['count', 'order', 'order count'] // Obtained by executing manually the application.
    jest.spyOn(NLP.prototype, 'classifyConcept').mockResolvedValue(mockResult)

    // When Then

    await controller.analyzeStaticallyNLPTR(exampleRepository, optionsWithHints).then((result) => {
      //console.log(JSON.stringify(result, null, 4))

      // When Then
      expect(JSON.stringify(result)).toEqual(
        '[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/","directories":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/","directories":[],"files":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js","linesOfCode":85,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L30L33","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\napp.get(\'/count\', async function (request, response) {\\n    redisClient.get(\'order_count\').then((order_count) => {\\n        if (!order_count) {\\n            return response.status(404).json({error: \'Order count not found\'});"},"concepts":[{"name":"count"},{"name":"order count"},{"name":"order"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L35L35","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n        response.status(200).json(order_count);"},"concepts":[{"name":"order count"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L43L46","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n        await mongoClient.connect();\\n        const db = mongoClient.db(\'order\');\\n        const collection = db.collection(\'orders\');\\n        const document = await collection.find({}).toArray();"},"concepts":[{"name":"order"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L48L49","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n        if (!document) {\\n            return response.status(404).json({error: \'Orders not found\'});"},"concepts":[{"name":"order"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L59L59","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\napp.get(\'/:order_id\', async function (request, response) {"},"concepts":[{"name":"order"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L61L63","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n        const orderId = request.params.order_id;\\n        if (!ObjectId.isValid(orderId)) {\\n            return response.status(400).json({error: \'OrderID not valid\'});"},"concepts":[{"name":"order"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L66L69","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n        await mongoClient.connect();\\n        const db = mongoClient.db(\'order\');\\n        const collection = db.collection(\'orders\');\\n        const document = await collection.findOne({_id: new ObjectId(orderId)});"},"concepts":[{"name":"order"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L71L72","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n        if (!document) {\\n            return response.status(404).json({error: \'Order not found\'});"},"concepts":[{"name":"order"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L82L83","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\napp.post(\'/\', async function (request, response) {\\n    let order = request.body;"},"concepts":[{"name":"order"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L89L91","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n        let order_count = await redisClient.get(\'order_count\');\\n        if (order_count === null) {\\n            await redisClient.set(\'order_count\', 1);"},"concepts":[{"name":"order count"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L93L93","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n            await redisClient.set(\'order_count\', (Number.parseInt(order_count) + 1));"},"concepts":[{"name":"order count"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L97L100","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n        await mongoClient.connect();\\n        const db = mongoClient.db(\'order\');\\n        const collection = db.collection(\'orders\');\\n        const document = await collection.insertOne(order);"},"concepts":[{"name":"order"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L102L103","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n        if (!document) {\\n            return response.status(404).json({error: \'Order not found\'});"},"concepts":[{"name":"order"}],"heuristics":"A0","score":1}]}]}]}]'
      )
    })
  })
})

// Failure cases test suite

describe('Controller tries to ', () => {
  it('analyzes statically with AST a not found repository', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.analyzeStaticallyAST('unknownRepository', options)).rejects.toThrow(
      DownloadFail
    )
  })

  it('analyzes statically with AST an undefined repository', async () => {
    // Given

    let controller = new Controller()
    let repository = undefined

    // When Then

    await expect(controller.analyzeStaticallyAST(repository, options)).rejects.toThrow(BadFormat)
  })

  it('analyzes statically with AST a null repository', async () => {
    // Given

    let controller = new Controller()
    let repository = null

    // When Then

    await expect(controller.analyzeStaticallyAST(repository, options)).rejects.toThrow(BadFormat)
  })

  it('analyzes statically with AST an non-existent repository', async () => {
    // Given

    let controller = new Controller()
    let repository = ''

    // When Then

    await expect(controller.analyzeStaticallyAST(repository, options)).rejects.toThrow(BadFormat)
  })

  it('analyzes statically with AST an empty repository', async () => {
    // Given

    let controller = new Controller()
    let repository = path.join(process.cwd(), 'test', 'unit', 'asset', 'empty.zip')

    // When Then

    await expect(controller.analyzeStaticallyAST(repository, options)).rejects.toThrow(BadFormat)
  })

  it('analyzes statically with AST a repository with undefined options', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.analyzeStaticallyAST(exampleRepository, undefined)).rejects.toThrow(
      BadFormat
    )
  })

  it('analyzes statically with AST a repository list with null options', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.analyzeStaticallyAST(exampleRepository, null)).rejects.toThrow(
      BadFormat
    )
  })

  it('analyzes statically with AST a repository list with empty options', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.analyzeStaticallyAST(exampleRepository, '')).rejects.toThrow(BadFormat)
  })

  it('analyzes statically with AST a repository list with badly formatted options', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(
      controller.analyzeStaticallyAST(exampleRepository, 'unknownLanguage')
    ).rejects.toThrow(BadFormat)
  })

  it('analyzes statically with NLP TR a not found repository', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.analyzeStaticallyNLPTR('unknownRepository', options)).rejects.toThrow(
      DownloadFail
    )
  })

  it('analyzes statically with NLP TR an undefined repository', async () => {
    // Given

    let controller = new Controller()
    let repository = undefined

    // When Then

    await expect(controller.analyzeStaticallyNLPTR(repository, options)).rejects.toThrow(BadFormat)
  })

  it('analyzes statically with NLP TR a null repository', async () => {
    // Given

    let controller = new Controller()
    let repository = null

    // When Then

    await expect(controller.analyzeStaticallyNLPTR(repository, options)).rejects.toThrow(BadFormat)
  })

  it('analyzes statically with NLP TR an non-existent repository', async () => {
    // Given

    let controller = new Controller()
    let repository = ''

    // When Then

    await expect(controller.analyzeStaticallyNLPTR(repository, options)).rejects.toThrow(BadFormat)
  })

  it('analyzes statically with NLP TR an empty repository', async () => {
    // Given

    let controller = new Controller()
    let repository = path.join(process.cwd(), 'test', 'unit', 'asset', 'empty.zip')

    // When Then

    await expect(controller.analyzeStaticallyNLPTR(repository, options)).rejects.toThrow(BadFormat)
  })

  it('analyzes statically with NLP TR a repository with undefined options', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.analyzeStaticallyNLPTR(exampleRepository, undefined)).rejects.toThrow(
      BadFormat
    )
  })

  it('analyzes statically with NLP TR a repository list with null options', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.analyzeStaticallyNLPTR(exampleRepository, null)).rejects.toThrow(
      BadFormat
    )
  })

  it('analyzes statically with NLP TR a repository list with empty options', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.analyzeStaticallyNLPTR(exampleRepository, '')).rejects.toThrow(
      BadFormat
    )
  })

  it('analyzes statically with NLP TR a repository list with badly formatted options', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(
      controller.analyzeStaticallyNLPTR(exampleRepository, 'unknownLanguage')
    ).rejects.toThrow(BadFormat)
  })
})
