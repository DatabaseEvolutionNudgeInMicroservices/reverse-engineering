// Helpers

const StaticAnalyzerNLPTR = require('../../helper/StaticAnalyzerNLPTR.helper')

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
  new Repository('example', []), // 0
  new Repository('example', []), // 1
  new Repository('example', []), // 2
  new Repository('example', []), // 3
  new Repository('example', []), // 4
  new Repository('example', []), // 5
  new Repository('example', []), // 6
  new Repository('example', []), // 7
  new Repository('example', []), // 8
  new Repository('example', []), // 9
  new Repository('example', []), // 10
  new Repository('example', []) // 11
]
const languages = ['javascript']
const options = {
  language: languages[0],
  hints: { in: [], out: [] }
}
const optionsWithHints = {
  language: languages[0],
  hints: {
    in: ['cinema', 'movie', 'seat', 'ticket'],
    out: [
      'sequelize',
      'postgresql',
      'db',
      'database',
      'model',
      'define',
      'hasMany',
      'belongsTo',
      'hasOne',
      'findAll',
      'create',
      'express',
      'route',
      'app',
      'port',
      'server',
      'get',
      'post',
      'json'
    ]
  }
}

const tempPath = path.join(process.cwd(), TEMP_FOLDER_NAME)

async function prepare(destination, i) {
  /// Preparing.
  fs.mkdirSync(path.join(tempPath, destination))
  fs.mkdirSync(path.join(tempPath, destination, repositoryList[i].getLocation()))
  fs.copyFileSync(
    path.join(process.cwd(), 'test', 'unit', 'asset', 'file0.example.js'),
    path.join(tempPath, destination, repositoryList[i].getLocation(), 'config.js')
  )
  fs.copyFileSync(
    path.join(process.cwd(), 'test', 'unit', 'asset', 'file1.example.js'),
    path.join(tempPath, destination, repositoryList[i].getLocation(), 'server.js')
  )
  fs.copyFileSync(
    path.join(process.cwd(), 'test', 'unit', 'asset', 'file2.example.js'),
    path.join(tempPath, destination, repositoryList[i].getLocation(), 'router.js')
  )
  fs.copyFileSync(
    path.join(process.cwd(), 'test', 'unit', 'asset', 'file3.example.js'),
    path.join(tempPath, destination, repositoryList[i].getLocation(), 'model.js')
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

describe('NLP TR static analyzer', () => {
  it('initializes a NLP TR static analysis by repository', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    await prepare('StaticAnalyzerNLPTR_jhfcf', 0)

    // When Then
    await staticAnalyzerNLPTR
      .initializesByRepository(repositoryList[0], 'StaticAnalyzerNLPTR_jhfcf', options)
      .then(async (result) => {
        const repositoryGenerated1 = fs.existsSync(
          path.join(tempPath, 'StaticAnalyzerNLPTR_jhfcf', repositoryList[0].getLocation())
        )
        expect(repositoryGenerated1).toBe(true)
        await clean('StaticAnalyzerNLPTR_jhfcf')
      })
  })

  it('initializes a NLP TR static analysis by repositories', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    await prepare('StaticAnalyzerNLPTR_jhdfc', 1)

    // When Then

    await staticAnalyzerNLPTR
      .initializesByRepositories([repositoryList[1]], 'StaticAnalyzerNLPTR_jhdfc', options)
      .then(async (result) => {
        //console.log(JSON.stringify(result, null, 4))
        const repositoryGenerated1 = fs.existsSync(
          path.join(tempPath, 'StaticAnalyzerNLPTR_jhdfc', repositoryList[1].getLocation())
        )
        expect(repositoryGenerated1).toBe(true)
        await clean('StaticAnalyzerNLPTR_jhdfc')
      })
  })

  it('identifies a NLP TR static analysis by repository', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    await prepare('StaticAnalyzerNLPTR_phjki', 2)

    // When Then
    await staticAnalyzerNLPTR
      .initializesByRepository(repositoryList[2], 'StaticAnalyzerNLPTR_phjki', optionsWithHints)
      .then(async (result) => {
        await staticAnalyzerNLPTR
          .identifyByRepository(result, 'StaticAnalyzerNLPTR_phjki', optionsWithHints)
          .then(async (result) => {
            //console.log(JSON.stringify(result, null, 4))
            let expectedRepository =
              '{"location":"example/","directories":[{"location":"example/","directories":[],"files":[{"location":"example/config.js","linesOfCode":0,"codeFragments":[{"location":"example/config.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { Sequelize } = require(\'sequelize\')\\nrequire(\'dotenv\').config()"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"example/config.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst sequelize = new Sequelize(process.env.DB_URL, {\\n  dialect: \'postgres\',\\n  logging: false"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"db url"},{"name":"dialect"},{"name":"postgres"},{"name":"logging"}],"heuristics":"A0","score":1}]},{"location":"example/model.js","linesOfCode":0,"codeFragments":[{"location":"example/model.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { DataTypes } = require(\'sequelize\')\\nconst sequelize = require(\'./config\')"},"concepts":[{"name":"data type"},{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"example/model.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Movie = sequelize.define(\'Movie\', {\\n  title: { type: DataTypes.STRING, allowNull: false },\\n  duration: { type: DataTypes.INTEGER, allowNull: false }                    "},"concepts":[{"name":"movie"},{"name":"sequelize"},{"name":"define"},{"name":"movie"},{"name":"title"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"duration"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/model.js#L9L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Cinema = sequelize.define(\'Cinema\', {\\n  name: { type: DataTypes.STRING, allowNull: false },\\n  location: { type: DataTypes.STRING, allowNull: false }"},"concepts":[{"name":"cinema"},{"name":"sequelize"},{"name":"define"},{"name":"cinema"},{"name":"name"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"location"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/model.js#L14L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Seat = sequelize.define(\'Seat\', {\\n  row: { type: DataTypes.STRING, allowNull: false },\\n  number: { type: DataTypes.INTEGER, allowNull: false }"},"concepts":[{"name":"seat"},{"name":"sequelize"},{"name":"define"},{"name":"seat"},{"name":"row"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/model.js#L19L21","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Ticket = sequelize.define(\'Ticket\', {\\n  price: { type: DataTypes.FLOAT, allowNull: false },\\n  status: { type: DataTypes.ENUM(\'available\', \'booked\', \'sold\'), defaultValue: \'available\' }"},"concepts":[{"name":"ticket"},{"name":"sequelize"},{"name":"define"},{"name":"ticket"},{"name":"price"},{"name":"type"},{"name":"data type"},{"name":"float"},{"name":"allow null"},{"name":"status"},{"name":"type"},{"name":"data type"},{"name":"available"},{"name":"booked"},{"name":"sold"},{"name":"default value"},{"name":"available"}],"heuristics":"A0","score":1},{"location":"example/model.js#L25L26","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nCinema.hasMany(Movie)\\nMovie.belongsTo(Cinema)"},"concepts":[{"name":"cinema"},{"name":"many"},{"name":"movie"},{"name":"movie"},{"name":"belongs"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/model.js#L28L29","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nMovie.hasMany(Seat)\\nSeat.belongsTo(Movie)"},"concepts":[{"name":"movie"},{"name":"many"},{"name":"seat"},{"name":"seat"},{"name":"belongs"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/model.js#L31L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nSeat.hasOne(Ticket)\\nTicket.belongsTo(Seat)"},"concepts":[{"name":"seat"},{"name":"one"},{"name":"ticket"},{"name":"ticket"},{"name":"belongs"},{"name":"seat"}],"heuristics":"A0","score":1}]},{"location":"example/router.js","linesOfCode":0,"codeFragments":[{"location":"example/router.js#L1L3","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst express = require(\'express\')\\nconst { Movie, Cinema, Seat, Ticket } = require(\'./models\')\\nconst router = express.Router()"},"concepts":[{"name":"express"},{"name":"express"},{"name":"movie"},{"name":"cinema"},{"name":"seat"},{"name":"ticket"},{"name":"model"},{"name":"router"},{"name":"express"},{"name":"router"}],"heuristics":"A0","score":1},{"location":"example/router.js#L6L8","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/movies\', async (req, res) => {\\n  const movies = await Movie.findAll()\\n  res.json(movies)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/router.js#L10L12","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/movies\', async (req, res) => {\\n  const movie = await Movie.create(req.body)\\n  res.json(movie)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/router.js#L16L18","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/cinemas\', async (req, res) => {\\n  const cinemas = await Cinema.findAll()\\n  res.json(cinemas)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/router.js#L20L22","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/cinemas\', async (req, res) => {\\n  const cinema = await Cinema.create(req.body)\\n  res.json(cinema)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/router.js#L26L28","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/seats\', async (req, res) => {\\n  const seats = await Seat.findAll()\\n  res.json(seats)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/router.js#L30L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/seats\', async (req, res) => {\\n  const seat = await Seat.create(req.body)\\n  res.json(seat)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/router.js#L36L38","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/tickets\', async (req, res) => {\\n  const tickets = await Ticket.findAll()\\n  res.json(tickets)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"ticket"}],"heuristics":"A0","score":1},{"location":"example/router.js#L40L42","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/tickets\', async (req, res) => {\\n  const ticket = await Ticket.create(req.body)\\n  res.json(ticket)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"ticket"}],"heuristics":"A0","score":1}]},{"location":"example/server.js","linesOfCode":0,"codeFragments":[{"location":"example/server.js#L1L5","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrequire(\'dotenv\').config()\\nconst express = require(\'express\')\\nconst sequelize = require(\'./config\')\\nconst routes = require(\'./routes\')\\nconst { sequelize: db } = require(\'./models\')"},"concepts":[{"name":"config"},{"name":"express"},{"name":"express"},{"name":"sequelize"},{"name":"config"},{"name":"route"},{"name":"route"},{"name":"sequelize"},{"name":"db"},{"name":"model"}],"heuristics":"A0","score":1},{"location":"example/server.js#L7L9","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst app = express()\\napp.use(express.json())\\napp.use(\'/api\', routes)"},"concepts":[{"name":"app"},{"name":"express"},{"name":"app"},{"name":"use"},{"name":"express"},{"name":"json"},{"name":"app"},{"name":"use"},{"name":"api"},{"name":"route"}],"heuristics":"A0","score":1},{"location":"example/server.js#L11L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst PORT = process.env.PORT || 3000"},"concepts":[{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1},{"location":"example/server.js#L13L13","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\ndb.sync()"},"concepts":[{"name":"db"}],"heuristics":"A0","score":1},{"location":"example/server.js#L15L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n    console.log(\'Database synced\')\\n    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))"},"concepts":[{"name":"database"},{"name":"synced"},{"name":"app"},{"name":"listen"},{"name":"port"},{"name":"server"},{"name":"running"},{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1}]}]}]}'
            expect(JSON.stringify(result)).toEqual(expectedRepository)
            await clean('StaticAnalyzerNLPTR_phjki')
          })
      })
  })

  it('identifies a NLP TR static analysis by repositories', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    await prepare('StaticAnalyzerNLPTR_mazlr', 3)

    // When Then
    await staticAnalyzerNLPTR
      .initializesByRepositories([repositoryList[3]], 'StaticAnalyzerNLPTR_mazlr', optionsWithHints)
      .then(async (result) => {
        await staticAnalyzerNLPTR
          .identifyByRepositories(
            [repositoryList[3]],
            'StaticAnalyzerNLPTR_mazlr',
            optionsWithHints
          )
          .then(async (result) => {
            //console.log(JSON.stringify(result, null, 4))
            let expectedRepositories =
              '[{"location":"example/","directories":[{"location":"example/","directories":[],"files":[{"location":"example/config.js","linesOfCode":0,"codeFragments":[{"location":"example/config.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { Sequelize } = require(\'sequelize\')\\nrequire(\'dotenv\').config()"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"example/config.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst sequelize = new Sequelize(process.env.DB_URL, {\\n  dialect: \'postgres\',\\n  logging: false"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"db url"},{"name":"dialect"},{"name":"postgres"},{"name":"logging"}],"heuristics":"A0","score":1}]},{"location":"example/model.js","linesOfCode":0,"codeFragments":[{"location":"example/model.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { DataTypes } = require(\'sequelize\')\\nconst sequelize = require(\'./config\')"},"concepts":[{"name":"data type"},{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"example/model.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Movie = sequelize.define(\'Movie\', {\\n  title: { type: DataTypes.STRING, allowNull: false },\\n  duration: { type: DataTypes.INTEGER, allowNull: false }                    "},"concepts":[{"name":"movie"},{"name":"sequelize"},{"name":"define"},{"name":"movie"},{"name":"title"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"duration"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/model.js#L9L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Cinema = sequelize.define(\'Cinema\', {\\n  name: { type: DataTypes.STRING, allowNull: false },\\n  location: { type: DataTypes.STRING, allowNull: false }"},"concepts":[{"name":"cinema"},{"name":"sequelize"},{"name":"define"},{"name":"cinema"},{"name":"name"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"location"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/model.js#L14L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Seat = sequelize.define(\'Seat\', {\\n  row: { type: DataTypes.STRING, allowNull: false },\\n  number: { type: DataTypes.INTEGER, allowNull: false }"},"concepts":[{"name":"seat"},{"name":"sequelize"},{"name":"define"},{"name":"seat"},{"name":"row"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/model.js#L19L21","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Ticket = sequelize.define(\'Ticket\', {\\n  price: { type: DataTypes.FLOAT, allowNull: false },\\n  status: { type: DataTypes.ENUM(\'available\', \'booked\', \'sold\'), defaultValue: \'available\' }"},"concepts":[{"name":"ticket"},{"name":"sequelize"},{"name":"define"},{"name":"ticket"},{"name":"price"},{"name":"type"},{"name":"data type"},{"name":"float"},{"name":"allow null"},{"name":"status"},{"name":"type"},{"name":"data type"},{"name":"available"},{"name":"booked"},{"name":"sold"},{"name":"default value"},{"name":"available"}],"heuristics":"A0","score":1},{"location":"example/model.js#L25L26","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nCinema.hasMany(Movie)\\nMovie.belongsTo(Cinema)"},"concepts":[{"name":"cinema"},{"name":"many"},{"name":"movie"},{"name":"movie"},{"name":"belongs"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/model.js#L28L29","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nMovie.hasMany(Seat)\\nSeat.belongsTo(Movie)"},"concepts":[{"name":"movie"},{"name":"many"},{"name":"seat"},{"name":"seat"},{"name":"belongs"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/model.js#L31L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nSeat.hasOne(Ticket)\\nTicket.belongsTo(Seat)"},"concepts":[{"name":"seat"},{"name":"one"},{"name":"ticket"},{"name":"ticket"},{"name":"belongs"},{"name":"seat"}],"heuristics":"A0","score":1}]},{"location":"example/router.js","linesOfCode":0,"codeFragments":[{"location":"example/router.js#L1L3","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst express = require(\'express\')\\nconst { Movie, Cinema, Seat, Ticket } = require(\'./models\')\\nconst router = express.Router()"},"concepts":[{"name":"express"},{"name":"express"},{"name":"movie"},{"name":"cinema"},{"name":"seat"},{"name":"ticket"},{"name":"model"},{"name":"router"},{"name":"express"},{"name":"router"}],"heuristics":"A0","score":1},{"location":"example/router.js#L6L8","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/movies\', async (req, res) => {\\n  const movies = await Movie.findAll()\\n  res.json(movies)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/router.js#L10L12","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/movies\', async (req, res) => {\\n  const movie = await Movie.create(req.body)\\n  res.json(movie)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/router.js#L16L18","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/cinemas\', async (req, res) => {\\n  const cinemas = await Cinema.findAll()\\n  res.json(cinemas)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/router.js#L20L22","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/cinemas\', async (req, res) => {\\n  const cinema = await Cinema.create(req.body)\\n  res.json(cinema)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/router.js#L26L28","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/seats\', async (req, res) => {\\n  const seats = await Seat.findAll()\\n  res.json(seats)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/router.js#L30L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/seats\', async (req, res) => {\\n  const seat = await Seat.create(req.body)\\n  res.json(seat)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/router.js#L36L38","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/tickets\', async (req, res) => {\\n  const tickets = await Ticket.findAll()\\n  res.json(tickets)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"ticket"}],"heuristics":"A0","score":1},{"location":"example/router.js#L40L42","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/tickets\', async (req, res) => {\\n  const ticket = await Ticket.create(req.body)\\n  res.json(ticket)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"ticket"}],"heuristics":"A0","score":1}]},{"location":"example/server.js","linesOfCode":0,"codeFragments":[{"location":"example/server.js#L1L5","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrequire(\'dotenv\').config()\\nconst express = require(\'express\')\\nconst sequelize = require(\'./config\')\\nconst routes = require(\'./routes\')\\nconst { sequelize: db } = require(\'./models\')"},"concepts":[{"name":"config"},{"name":"express"},{"name":"express"},{"name":"sequelize"},{"name":"config"},{"name":"route"},{"name":"route"},{"name":"sequelize"},{"name":"db"},{"name":"model"}],"heuristics":"A0","score":1},{"location":"example/server.js#L7L9","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst app = express()\\napp.use(express.json())\\napp.use(\'/api\', routes)"},"concepts":[{"name":"app"},{"name":"express"},{"name":"app"},{"name":"use"},{"name":"express"},{"name":"json"},{"name":"app"},{"name":"use"},{"name":"api"},{"name":"route"}],"heuristics":"A0","score":1},{"location":"example/server.js#L11L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst PORT = process.env.PORT || 3000"},"concepts":[{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1},{"location":"example/server.js#L13L13","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\ndb.sync()"},"concepts":[{"name":"db"}],"heuristics":"A0","score":1},{"location":"example/server.js#L15L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n    console.log(\'Database synced\')\\n    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))"},"concepts":[{"name":"database"},{"name":"synced"},{"name":"app"},{"name":"listen"},{"name":"port"},{"name":"server"},{"name":"running"},{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1}]}]}]}]'
            expect(JSON.stringify(result)).toEqual(expectedRepositories)
            await clean('StaticAnalyzerNLPTR_mazlr')
          })
      })
  })

  it('extracts a NLP TR static analysis result by repository', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    await prepare('StaticAnalyzerNLPTR_mqsdq', 4)
    await prepare(path.join('StaticAnalyzerNLPTR_mqsdq', 'example', 'folder1'), 4)
    await prepare(
      path.join('StaticAnalyzerNLPTR_mqsdq', 'example', 'folder1', 'example', 'folder2'),
      4
    )

    // When Then
    await staticAnalyzerNLPTR
      .initializesByRepository(repositoryList[4], 'StaticAnalyzerNLPTR_mqsdq', optionsWithHints)
      .then(async (result) => {
        await staticAnalyzerNLPTR
          .identifyByRepository(repositoryList[4], 'StaticAnalyzerNLPTR_mqsdq', optionsWithHints)
          .then(async (result) => {
            await staticAnalyzerNLPTR
              .extractByRepository(repositoryList[4], 'StaticAnalyzerNLPTR_mqsdq', optionsWithHints)
              .then(async (result) => {
                //console.log(JSON.stringify(result, null, 4))
                let expectedRepository =
                  '{"location":"example/","directories":[{"location":"example/","directories":[{"location":"example/folder1/","directories":[{"location":"example/folder1/example/","directories":[{"location":"example/folder1/example/folder2/","directories":[{"location":"example/folder1/example/folder2/example/","directories":[],"files":[{"location":"example/folder1/example/folder2/example/config.js","linesOfCode":7,"codeFragments":[{"location":"example/folder1/example/folder2/example/config.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { Sequelize } = require(\'sequelize\')\\nrequire(\'dotenv\').config()"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/config.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst sequelize = new Sequelize(process.env.DB_URL, {\\n  dialect: \'postgres\',\\n  logging: false"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"db url"},{"name":"dialect"},{"name":"postgres"},{"name":"logging"}],"heuristics":"A0","score":1}]},{"location":"example/folder1/example/folder2/example/model.js","linesOfCode":25,"codeFragments":[{"location":"example/folder1/example/folder2/example/model.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { DataTypes } = require(\'sequelize\')\\nconst sequelize = require(\'./config\')"},"concepts":[{"name":"data type"},{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/model.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Movie = sequelize.define(\'Movie\', {\\n  title: { type: DataTypes.STRING, allowNull: false },\\n  duration: { type: DataTypes.INTEGER, allowNull: false }                    "},"concepts":[{"name":"movie"},{"name":"sequelize"},{"name":"define"},{"name":"movie"},{"name":"title"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"duration"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/model.js#L9L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Cinema = sequelize.define(\'Cinema\', {\\n  name: { type: DataTypes.STRING, allowNull: false },\\n  location: { type: DataTypes.STRING, allowNull: false }"},"concepts":[{"name":"cinema"},{"name":"sequelize"},{"name":"define"},{"name":"cinema"},{"name":"name"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"location"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/model.js#L14L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Seat = sequelize.define(\'Seat\', {\\n  row: { type: DataTypes.STRING, allowNull: false },\\n  number: { type: DataTypes.INTEGER, allowNull: false }"},"concepts":[{"name":"seat"},{"name":"sequelize"},{"name":"define"},{"name":"seat"},{"name":"row"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/model.js#L19L21","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Ticket = sequelize.define(\'Ticket\', {\\n  price: { type: DataTypes.FLOAT, allowNull: false },\\n  status: { type: DataTypes.ENUM(\'available\', \'booked\', \'sold\'), defaultValue: \'available\' }"},"concepts":[{"name":"ticket"},{"name":"sequelize"},{"name":"define"},{"name":"ticket"},{"name":"price"},{"name":"type"},{"name":"data type"},{"name":"float"},{"name":"allow null"},{"name":"status"},{"name":"type"},{"name":"data type"},{"name":"available"},{"name":"booked"},{"name":"sold"},{"name":"default value"},{"name":"available"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/model.js#L25L26","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nCinema.hasMany(Movie)\\nMovie.belongsTo(Cinema)"},"concepts":[{"name":"cinema"},{"name":"many"},{"name":"movie"},{"name":"movie"},{"name":"belongs"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/model.js#L28L29","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nMovie.hasMany(Seat)\\nSeat.belongsTo(Movie)"},"concepts":[{"name":"movie"},{"name":"many"},{"name":"seat"},{"name":"seat"},{"name":"belongs"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/model.js#L31L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nSeat.hasOne(Ticket)\\nTicket.belongsTo(Seat)"},"concepts":[{"name":"seat"},{"name":"one"},{"name":"ticket"},{"name":"ticket"},{"name":"belongs"},{"name":"seat"}],"heuristics":"A0","score":1}]},{"location":"example/folder1/example/folder2/example/router.js","linesOfCode":36,"codeFragments":[{"location":"example/folder1/example/folder2/example/router.js#L1L3","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst express = require(\'express\')\\nconst { Movie, Cinema, Seat, Ticket } = require(\'./models\')\\nconst router = express.Router()"},"concepts":[{"name":"express"},{"name":"express"},{"name":"movie"},{"name":"cinema"},{"name":"seat"},{"name":"ticket"},{"name":"model"},{"name":"router"},{"name":"express"},{"name":"router"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/router.js#L6L8","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/movies\', async (req, res) => {\\n  const movies = await Movie.findAll()\\n  res.json(movies)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/router.js#L10L12","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/movies\', async (req, res) => {\\n  const movie = await Movie.create(req.body)\\n  res.json(movie)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/router.js#L16L18","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/cinemas\', async (req, res) => {\\n  const cinemas = await Cinema.findAll()\\n  res.json(cinemas)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/router.js#L20L22","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/cinemas\', async (req, res) => {\\n  const cinema = await Cinema.create(req.body)\\n  res.json(cinema)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/router.js#L26L28","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/seats\', async (req, res) => {\\n  const seats = await Seat.findAll()\\n  res.json(seats)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/router.js#L30L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/seats\', async (req, res) => {\\n  const seat = await Seat.create(req.body)\\n  res.json(seat)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/router.js#L36L38","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/tickets\', async (req, res) => {\\n  const tickets = await Ticket.findAll()\\n  res.json(tickets)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"ticket"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/router.js#L40L42","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/tickets\', async (req, res) => {\\n  const ticket = await Ticket.create(req.body)\\n  res.json(ticket)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"ticket"}],"heuristics":"A0","score":1}]},{"location":"example/folder1/example/folder2/example/server.js","linesOfCode":15,"codeFragments":[{"location":"example/folder1/example/folder2/example/server.js#L1L5","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrequire(\'dotenv\').config()\\nconst express = require(\'express\')\\nconst sequelize = require(\'./config\')\\nconst routes = require(\'./routes\')\\nconst { sequelize: db } = require(\'./models\')"},"concepts":[{"name":"config"},{"name":"express"},{"name":"express"},{"name":"sequelize"},{"name":"config"},{"name":"route"},{"name":"route"},{"name":"sequelize"},{"name":"db"},{"name":"model"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/server.js#L7L9","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst app = express()\\napp.use(express.json())\\napp.use(\'/api\', routes)"},"concepts":[{"name":"app"},{"name":"express"},{"name":"app"},{"name":"use"},{"name":"express"},{"name":"json"},{"name":"app"},{"name":"use"},{"name":"api"},{"name":"route"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/server.js#L11L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst PORT = process.env.PORT || 3000"},"concepts":[{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/server.js#L13L13","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\ndb.sync()"},"concepts":[{"name":"db"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/server.js#L15L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n    console.log(\'Database synced\')\\n    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))"},"concepts":[{"name":"database"},{"name":"synced"},{"name":"app"},{"name":"listen"},{"name":"port"},{"name":"server"},{"name":"running"},{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1}]}]}],"files":[]}],"files":[{"location":"example/folder1/example/config.js","linesOfCode":7,"codeFragments":[{"location":"example/folder1/example/config.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { Sequelize } = require(\'sequelize\')\\nrequire(\'dotenv\').config()"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/config.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst sequelize = new Sequelize(process.env.DB_URL, {\\n  dialect: \'postgres\',\\n  logging: false"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"db url"},{"name":"dialect"},{"name":"postgres"},{"name":"logging"}],"heuristics":"A0","score":1}]},{"location":"example/folder1/example/model.js","linesOfCode":25,"codeFragments":[{"location":"example/folder1/example/model.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { DataTypes } = require(\'sequelize\')\\nconst sequelize = require(\'./config\')"},"concepts":[{"name":"data type"},{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/model.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Movie = sequelize.define(\'Movie\', {\\n  title: { type: DataTypes.STRING, allowNull: false },\\n  duration: { type: DataTypes.INTEGER, allowNull: false }                    "},"concepts":[{"name":"movie"},{"name":"sequelize"},{"name":"define"},{"name":"movie"},{"name":"title"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"duration"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/model.js#L9L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Cinema = sequelize.define(\'Cinema\', {\\n  name: { type: DataTypes.STRING, allowNull: false },\\n  location: { type: DataTypes.STRING, allowNull: false }"},"concepts":[{"name":"cinema"},{"name":"sequelize"},{"name":"define"},{"name":"cinema"},{"name":"name"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"location"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/model.js#L14L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Seat = sequelize.define(\'Seat\', {\\n  row: { type: DataTypes.STRING, allowNull: false },\\n  number: { type: DataTypes.INTEGER, allowNull: false }"},"concepts":[{"name":"seat"},{"name":"sequelize"},{"name":"define"},{"name":"seat"},{"name":"row"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/model.js#L19L21","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Ticket = sequelize.define(\'Ticket\', {\\n  price: { type: DataTypes.FLOAT, allowNull: false },\\n  status: { type: DataTypes.ENUM(\'available\', \'booked\', \'sold\'), defaultValue: \'available\' }"},"concepts":[{"name":"ticket"},{"name":"sequelize"},{"name":"define"},{"name":"ticket"},{"name":"price"},{"name":"type"},{"name":"data type"},{"name":"float"},{"name":"allow null"},{"name":"status"},{"name":"type"},{"name":"data type"},{"name":"available"},{"name":"booked"},{"name":"sold"},{"name":"default value"},{"name":"available"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/model.js#L25L26","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nCinema.hasMany(Movie)\\nMovie.belongsTo(Cinema)"},"concepts":[{"name":"cinema"},{"name":"many"},{"name":"movie"},{"name":"movie"},{"name":"belongs"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/model.js#L28L29","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nMovie.hasMany(Seat)\\nSeat.belongsTo(Movie)"},"concepts":[{"name":"movie"},{"name":"many"},{"name":"seat"},{"name":"seat"},{"name":"belongs"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/model.js#L31L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nSeat.hasOne(Ticket)\\nTicket.belongsTo(Seat)"},"concepts":[{"name":"seat"},{"name":"one"},{"name":"ticket"},{"name":"ticket"},{"name":"belongs"},{"name":"seat"}],"heuristics":"A0","score":1}]},{"location":"example/folder1/example/router.js","linesOfCode":36,"codeFragments":[{"location":"example/folder1/example/router.js#L1L3","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst express = require(\'express\')\\nconst { Movie, Cinema, Seat, Ticket } = require(\'./models\')\\nconst router = express.Router()"},"concepts":[{"name":"express"},{"name":"express"},{"name":"movie"},{"name":"cinema"},{"name":"seat"},{"name":"ticket"},{"name":"model"},{"name":"router"},{"name":"express"},{"name":"router"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/router.js#L6L8","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/movies\', async (req, res) => {\\n  const movies = await Movie.findAll()\\n  res.json(movies)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/router.js#L10L12","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/movies\', async (req, res) => {\\n  const movie = await Movie.create(req.body)\\n  res.json(movie)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/router.js#L16L18","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/cinemas\', async (req, res) => {\\n  const cinemas = await Cinema.findAll()\\n  res.json(cinemas)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/router.js#L20L22","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/cinemas\', async (req, res) => {\\n  const cinema = await Cinema.create(req.body)\\n  res.json(cinema)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/router.js#L26L28","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/seats\', async (req, res) => {\\n  const seats = await Seat.findAll()\\n  res.json(seats)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/router.js#L30L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/seats\', async (req, res) => {\\n  const seat = await Seat.create(req.body)\\n  res.json(seat)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/router.js#L36L38","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/tickets\', async (req, res) => {\\n  const tickets = await Ticket.findAll()\\n  res.json(tickets)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"ticket"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/router.js#L40L42","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/tickets\', async (req, res) => {\\n  const ticket = await Ticket.create(req.body)\\n  res.json(ticket)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"ticket"}],"heuristics":"A0","score":1}]},{"location":"example/folder1/example/server.js","linesOfCode":15,"codeFragments":[{"location":"example/folder1/example/server.js#L1L5","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrequire(\'dotenv\').config()\\nconst express = require(\'express\')\\nconst sequelize = require(\'./config\')\\nconst routes = require(\'./routes\')\\nconst { sequelize: db } = require(\'./models\')"},"concepts":[{"name":"config"},{"name":"express"},{"name":"express"},{"name":"sequelize"},{"name":"config"},{"name":"route"},{"name":"route"},{"name":"sequelize"},{"name":"db"},{"name":"model"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/server.js#L7L9","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst app = express()\\napp.use(express.json())\\napp.use(\'/api\', routes)"},"concepts":[{"name":"app"},{"name":"express"},{"name":"app"},{"name":"use"},{"name":"express"},{"name":"json"},{"name":"app"},{"name":"use"},{"name":"api"},{"name":"route"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/server.js#L11L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst PORT = process.env.PORT || 3000"},"concepts":[{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/server.js#L13L13","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\ndb.sync()"},"concepts":[{"name":"db"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/server.js#L15L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n    console.log(\'Database synced\')\\n    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))"},"concepts":[{"name":"database"},{"name":"synced"},{"name":"app"},{"name":"listen"},{"name":"port"},{"name":"server"},{"name":"running"},{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1}]}]}],"files":[]}],"files":[{"location":"example/config.js","linesOfCode":7,"codeFragments":[{"location":"example/config.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { Sequelize } = require(\'sequelize\')\\nrequire(\'dotenv\').config()"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"example/config.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst sequelize = new Sequelize(process.env.DB_URL, {\\n  dialect: \'postgres\',\\n  logging: false"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"db url"},{"name":"dialect"},{"name":"postgres"},{"name":"logging"}],"heuristics":"A0","score":1}]},{"location":"example/model.js","linesOfCode":25,"codeFragments":[{"location":"example/model.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { DataTypes } = require(\'sequelize\')\\nconst sequelize = require(\'./config\')"},"concepts":[{"name":"data type"},{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"example/model.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Movie = sequelize.define(\'Movie\', {\\n  title: { type: DataTypes.STRING, allowNull: false },\\n  duration: { type: DataTypes.INTEGER, allowNull: false }                    "},"concepts":[{"name":"movie"},{"name":"sequelize"},{"name":"define"},{"name":"movie"},{"name":"title"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"duration"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/model.js#L9L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Cinema = sequelize.define(\'Cinema\', {\\n  name: { type: DataTypes.STRING, allowNull: false },\\n  location: { type: DataTypes.STRING, allowNull: false }"},"concepts":[{"name":"cinema"},{"name":"sequelize"},{"name":"define"},{"name":"cinema"},{"name":"name"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"location"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/model.js#L14L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Seat = sequelize.define(\'Seat\', {\\n  row: { type: DataTypes.STRING, allowNull: false },\\n  number: { type: DataTypes.INTEGER, allowNull: false }"},"concepts":[{"name":"seat"},{"name":"sequelize"},{"name":"define"},{"name":"seat"},{"name":"row"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/model.js#L19L21","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Ticket = sequelize.define(\'Ticket\', {\\n  price: { type: DataTypes.FLOAT, allowNull: false },\\n  status: { type: DataTypes.ENUM(\'available\', \'booked\', \'sold\'), defaultValue: \'available\' }"},"concepts":[{"name":"ticket"},{"name":"sequelize"},{"name":"define"},{"name":"ticket"},{"name":"price"},{"name":"type"},{"name":"data type"},{"name":"float"},{"name":"allow null"},{"name":"status"},{"name":"type"},{"name":"data type"},{"name":"available"},{"name":"booked"},{"name":"sold"},{"name":"default value"},{"name":"available"}],"heuristics":"A0","score":1},{"location":"example/model.js#L25L26","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nCinema.hasMany(Movie)\\nMovie.belongsTo(Cinema)"},"concepts":[{"name":"cinema"},{"name":"many"},{"name":"movie"},{"name":"movie"},{"name":"belongs"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/model.js#L28L29","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nMovie.hasMany(Seat)\\nSeat.belongsTo(Movie)"},"concepts":[{"name":"movie"},{"name":"many"},{"name":"seat"},{"name":"seat"},{"name":"belongs"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/model.js#L31L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nSeat.hasOne(Ticket)\\nTicket.belongsTo(Seat)"},"concepts":[{"name":"seat"},{"name":"one"},{"name":"ticket"},{"name":"ticket"},{"name":"belongs"},{"name":"seat"}],"heuristics":"A0","score":1}]},{"location":"example/router.js","linesOfCode":36,"codeFragments":[{"location":"example/router.js#L1L3","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst express = require(\'express\')\\nconst { Movie, Cinema, Seat, Ticket } = require(\'./models\')\\nconst router = express.Router()"},"concepts":[{"name":"express"},{"name":"express"},{"name":"movie"},{"name":"cinema"},{"name":"seat"},{"name":"ticket"},{"name":"model"},{"name":"router"},{"name":"express"},{"name":"router"}],"heuristics":"A0","score":1},{"location":"example/router.js#L6L8","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/movies\', async (req, res) => {\\n  const movies = await Movie.findAll()\\n  res.json(movies)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/router.js#L10L12","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/movies\', async (req, res) => {\\n  const movie = await Movie.create(req.body)\\n  res.json(movie)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/router.js#L16L18","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/cinemas\', async (req, res) => {\\n  const cinemas = await Cinema.findAll()\\n  res.json(cinemas)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/router.js#L20L22","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/cinemas\', async (req, res) => {\\n  const cinema = await Cinema.create(req.body)\\n  res.json(cinema)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/router.js#L26L28","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/seats\', async (req, res) => {\\n  const seats = await Seat.findAll()\\n  res.json(seats)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/router.js#L30L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/seats\', async (req, res) => {\\n  const seat = await Seat.create(req.body)\\n  res.json(seat)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/router.js#L36L38","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/tickets\', async (req, res) => {\\n  const tickets = await Ticket.findAll()\\n  res.json(tickets)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"ticket"}],"heuristics":"A0","score":1},{"location":"example/router.js#L40L42","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/tickets\', async (req, res) => {\\n  const ticket = await Ticket.create(req.body)\\n  res.json(ticket)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"ticket"}],"heuristics":"A0","score":1}]},{"location":"example/server.js","linesOfCode":15,"codeFragments":[{"location":"example/server.js#L1L5","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrequire(\'dotenv\').config()\\nconst express = require(\'express\')\\nconst sequelize = require(\'./config\')\\nconst routes = require(\'./routes\')\\nconst { sequelize: db } = require(\'./models\')"},"concepts":[{"name":"config"},{"name":"express"},{"name":"express"},{"name":"sequelize"},{"name":"config"},{"name":"route"},{"name":"route"},{"name":"sequelize"},{"name":"db"},{"name":"model"}],"heuristics":"A0","score":1},{"location":"example/server.js#L7L9","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst app = express()\\napp.use(express.json())\\napp.use(\'/api\', routes)"},"concepts":[{"name":"app"},{"name":"express"},{"name":"app"},{"name":"use"},{"name":"express"},{"name":"json"},{"name":"app"},{"name":"use"},{"name":"api"},{"name":"route"}],"heuristics":"A0","score":1},{"location":"example/server.js#L11L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst PORT = process.env.PORT || 3000"},"concepts":[{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1},{"location":"example/server.js#L13L13","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\ndb.sync()"},"concepts":[{"name":"db"}],"heuristics":"A0","score":1},{"location":"example/server.js#L15L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n    console.log(\'Database synced\')\\n    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))"},"concepts":[{"name":"database"},{"name":"synced"},{"name":"app"},{"name":"listen"},{"name":"port"},{"name":"server"},{"name":"running"},{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1}]}]}]}'
                expect(JSON.stringify(result)).toEqual(expectedRepository)
                await clean('StaticAnalyzerNLPTR_mqsdq')
              })
          })
      })
  })

  it('extracts a NLP TR static analysis result by repository with URL', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    await prepare('StaticAnalyzerNLPTR_zebyf', 5)
    await prepare(path.join('StaticAnalyzerNLPTR_zebyf', 'example', 'folder1'), 5)
    await prepare(
      path.join('StaticAnalyzerNLPTR_zebyf', 'example', 'folder1', 'example', 'folder2'),
      5
    )
    const denimFilePath = path.join(
      tempPath,
      'StaticAnalyzerNLPTR_zebyf',
      repositoryList[5].getLocation(),
      'denim'
    )
    let url = 'https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    await fs.writeFileSync(denimFilePath, url) // Creation of the denim file.

    // When Then
    await staticAnalyzerNLPTR
      .initializesByRepository(repositoryList[5], 'StaticAnalyzerNLPTR_zebyf', optionsWithHints)
      .then(async (result) => {
        await staticAnalyzerNLPTR
          .identifyByRepository(repositoryList[5], 'StaticAnalyzerNLPTR_zebyf', optionsWithHints)
          .then(async (result) => {
            await staticAnalyzerNLPTR
              .extractByRepository(repositoryList[5], 'StaticAnalyzerNLPTR_zebyf', optionsWithHints)
              .then(async (result) => {
                //console.log(JSON.stringify(result, null, 4))
                let expectedRepository =
                  '{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/","directories":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/","directories":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/","directories":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/","directories":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/","directories":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/","directories":[],"files":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/config.js","linesOfCode":7,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/config.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { Sequelize } = require(\'sequelize\')\\nrequire(\'dotenv\').config()"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/config.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst sequelize = new Sequelize(process.env.DB_URL, {\\n  dialect: \'postgres\',\\n  logging: false"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"db url"},{"name":"dialect"},{"name":"postgres"},{"name":"logging"}],"heuristics":"A0","score":1}]},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/model.js","linesOfCode":25,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/model.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { DataTypes } = require(\'sequelize\')\\nconst sequelize = require(\'./config\')"},"concepts":[{"name":"data type"},{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/model.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Movie = sequelize.define(\'Movie\', {\\n  title: { type: DataTypes.STRING, allowNull: false },\\n  duration: { type: DataTypes.INTEGER, allowNull: false }                    "},"concepts":[{"name":"movie"},{"name":"sequelize"},{"name":"define"},{"name":"movie"},{"name":"title"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"duration"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/model.js#L9L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Cinema = sequelize.define(\'Cinema\', {\\n  name: { type: DataTypes.STRING, allowNull: false },\\n  location: { type: DataTypes.STRING, allowNull: false }"},"concepts":[{"name":"cinema"},{"name":"sequelize"},{"name":"define"},{"name":"cinema"},{"name":"name"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"location"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/model.js#L14L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Seat = sequelize.define(\'Seat\', {\\n  row: { type: DataTypes.STRING, allowNull: false },\\n  number: { type: DataTypes.INTEGER, allowNull: false }"},"concepts":[{"name":"seat"},{"name":"sequelize"},{"name":"define"},{"name":"seat"},{"name":"row"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/model.js#L19L21","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Ticket = sequelize.define(\'Ticket\', {\\n  price: { type: DataTypes.FLOAT, allowNull: false },\\n  status: { type: DataTypes.ENUM(\'available\', \'booked\', \'sold\'), defaultValue: \'available\' }"},"concepts":[{"name":"ticket"},{"name":"sequelize"},{"name":"define"},{"name":"ticket"},{"name":"price"},{"name":"type"},{"name":"data type"},{"name":"float"},{"name":"allow null"},{"name":"status"},{"name":"type"},{"name":"data type"},{"name":"available"},{"name":"booked"},{"name":"sold"},{"name":"default value"},{"name":"available"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/model.js#L25L26","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nCinema.hasMany(Movie)\\nMovie.belongsTo(Cinema)"},"concepts":[{"name":"cinema"},{"name":"many"},{"name":"movie"},{"name":"movie"},{"name":"belongs"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/model.js#L28L29","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nMovie.hasMany(Seat)\\nSeat.belongsTo(Movie)"},"concepts":[{"name":"movie"},{"name":"many"},{"name":"seat"},{"name":"seat"},{"name":"belongs"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/model.js#L31L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nSeat.hasOne(Ticket)\\nTicket.belongsTo(Seat)"},"concepts":[{"name":"seat"},{"name":"one"},{"name":"ticket"},{"name":"ticket"},{"name":"belongs"},{"name":"seat"}],"heuristics":"A0","score":1}]},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/router.js","linesOfCode":36,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/router.js#L1L3","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst express = require(\'express\')\\nconst { Movie, Cinema, Seat, Ticket } = require(\'./models\')\\nconst router = express.Router()"},"concepts":[{"name":"express"},{"name":"express"},{"name":"movie"},{"name":"cinema"},{"name":"seat"},{"name":"ticket"},{"name":"model"},{"name":"router"},{"name":"express"},{"name":"router"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/router.js#L6L8","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/movies\', async (req, res) => {\\n  const movies = await Movie.findAll()\\n  res.json(movies)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/router.js#L10L12","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/movies\', async (req, res) => {\\n  const movie = await Movie.create(req.body)\\n  res.json(movie)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/router.js#L16L18","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/cinemas\', async (req, res) => {\\n  const cinemas = await Cinema.findAll()\\n  res.json(cinemas)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/router.js#L20L22","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/cinemas\', async (req, res) => {\\n  const cinema = await Cinema.create(req.body)\\n  res.json(cinema)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/router.js#L26L28","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/seats\', async (req, res) => {\\n  const seats = await Seat.findAll()\\n  res.json(seats)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/router.js#L30L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/seats\', async (req, res) => {\\n  const seat = await Seat.create(req.body)\\n  res.json(seat)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/router.js#L36L38","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/tickets\', async (req, res) => {\\n  const tickets = await Ticket.findAll()\\n  res.json(tickets)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"ticket"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/router.js#L40L42","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/tickets\', async (req, res) => {\\n  const ticket = await Ticket.create(req.body)\\n  res.json(ticket)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"ticket"}],"heuristics":"A0","score":1}]},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/server.js","linesOfCode":15,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/server.js#L1L5","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrequire(\'dotenv\').config()\\nconst express = require(\'express\')\\nconst sequelize = require(\'./config\')\\nconst routes = require(\'./routes\')\\nconst { sequelize: db } = require(\'./models\')"},"concepts":[{"name":"config"},{"name":"express"},{"name":"express"},{"name":"sequelize"},{"name":"config"},{"name":"route"},{"name":"route"},{"name":"sequelize"},{"name":"db"},{"name":"model"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/server.js#L7L9","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst app = express()\\napp.use(express.json())\\napp.use(\'/api\', routes)"},"concepts":[{"name":"app"},{"name":"express"},{"name":"app"},{"name":"use"},{"name":"express"},{"name":"json"},{"name":"app"},{"name":"use"},{"name":"api"},{"name":"route"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/server.js#L11L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst PORT = process.env.PORT || 3000"},"concepts":[{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/server.js#L13L13","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\ndb.sync()"},"concepts":[{"name":"db"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/server.js#L15L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n    console.log(\'Database synced\')\\n    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))"},"concepts":[{"name":"database"},{"name":"synced"},{"name":"app"},{"name":"listen"},{"name":"port"},{"name":"server"},{"name":"running"},{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1}]}]}],"files":[]}],"files":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/config.js","linesOfCode":7,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/config.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { Sequelize } = require(\'sequelize\')\\nrequire(\'dotenv\').config()"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/config.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst sequelize = new Sequelize(process.env.DB_URL, {\\n  dialect: \'postgres\',\\n  logging: false"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"db url"},{"name":"dialect"},{"name":"postgres"},{"name":"logging"}],"heuristics":"A0","score":1}]},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/model.js","linesOfCode":25,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/model.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { DataTypes } = require(\'sequelize\')\\nconst sequelize = require(\'./config\')"},"concepts":[{"name":"data type"},{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/model.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Movie = sequelize.define(\'Movie\', {\\n  title: { type: DataTypes.STRING, allowNull: false },\\n  duration: { type: DataTypes.INTEGER, allowNull: false }                    "},"concepts":[{"name":"movie"},{"name":"sequelize"},{"name":"define"},{"name":"movie"},{"name":"title"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"duration"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/model.js#L9L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Cinema = sequelize.define(\'Cinema\', {\\n  name: { type: DataTypes.STRING, allowNull: false },\\n  location: { type: DataTypes.STRING, allowNull: false }"},"concepts":[{"name":"cinema"},{"name":"sequelize"},{"name":"define"},{"name":"cinema"},{"name":"name"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"location"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/model.js#L14L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Seat = sequelize.define(\'Seat\', {\\n  row: { type: DataTypes.STRING, allowNull: false },\\n  number: { type: DataTypes.INTEGER, allowNull: false }"},"concepts":[{"name":"seat"},{"name":"sequelize"},{"name":"define"},{"name":"seat"},{"name":"row"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/model.js#L19L21","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Ticket = sequelize.define(\'Ticket\', {\\n  price: { type: DataTypes.FLOAT, allowNull: false },\\n  status: { type: DataTypes.ENUM(\'available\', \'booked\', \'sold\'), defaultValue: \'available\' }"},"concepts":[{"name":"ticket"},{"name":"sequelize"},{"name":"define"},{"name":"ticket"},{"name":"price"},{"name":"type"},{"name":"data type"},{"name":"float"},{"name":"allow null"},{"name":"status"},{"name":"type"},{"name":"data type"},{"name":"available"},{"name":"booked"},{"name":"sold"},{"name":"default value"},{"name":"available"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/model.js#L25L26","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nCinema.hasMany(Movie)\\nMovie.belongsTo(Cinema)"},"concepts":[{"name":"cinema"},{"name":"many"},{"name":"movie"},{"name":"movie"},{"name":"belongs"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/model.js#L28L29","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nMovie.hasMany(Seat)\\nSeat.belongsTo(Movie)"},"concepts":[{"name":"movie"},{"name":"many"},{"name":"seat"},{"name":"seat"},{"name":"belongs"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/model.js#L31L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nSeat.hasOne(Ticket)\\nTicket.belongsTo(Seat)"},"concepts":[{"name":"seat"},{"name":"one"},{"name":"ticket"},{"name":"ticket"},{"name":"belongs"},{"name":"seat"}],"heuristics":"A0","score":1}]},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/router.js","linesOfCode":36,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/router.js#L1L3","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst express = require(\'express\')\\nconst { Movie, Cinema, Seat, Ticket } = require(\'./models\')\\nconst router = express.Router()"},"concepts":[{"name":"express"},{"name":"express"},{"name":"movie"},{"name":"cinema"},{"name":"seat"},{"name":"ticket"},{"name":"model"},{"name":"router"},{"name":"express"},{"name":"router"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/router.js#L6L8","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/movies\', async (req, res) => {\\n  const movies = await Movie.findAll()\\n  res.json(movies)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/router.js#L10L12","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/movies\', async (req, res) => {\\n  const movie = await Movie.create(req.body)\\n  res.json(movie)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/router.js#L16L18","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/cinemas\', async (req, res) => {\\n  const cinemas = await Cinema.findAll()\\n  res.json(cinemas)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/router.js#L20L22","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/cinemas\', async (req, res) => {\\n  const cinema = await Cinema.create(req.body)\\n  res.json(cinema)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/router.js#L26L28","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/seats\', async (req, res) => {\\n  const seats = await Seat.findAll()\\n  res.json(seats)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/router.js#L30L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/seats\', async (req, res) => {\\n  const seat = await Seat.create(req.body)\\n  res.json(seat)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/router.js#L36L38","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/tickets\', async (req, res) => {\\n  const tickets = await Ticket.findAll()\\n  res.json(tickets)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"ticket"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/router.js#L40L42","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/tickets\', async (req, res) => {\\n  const ticket = await Ticket.create(req.body)\\n  res.json(ticket)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"ticket"}],"heuristics":"A0","score":1}]},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/server.js","linesOfCode":15,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/server.js#L1L5","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrequire(\'dotenv\').config()\\nconst express = require(\'express\')\\nconst sequelize = require(\'./config\')\\nconst routes = require(\'./routes\')\\nconst { sequelize: db } = require(\'./models\')"},"concepts":[{"name":"config"},{"name":"express"},{"name":"express"},{"name":"sequelize"},{"name":"config"},{"name":"route"},{"name":"route"},{"name":"sequelize"},{"name":"db"},{"name":"model"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/server.js#L7L9","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst app = express()\\napp.use(express.json())\\napp.use(\'/api\', routes)"},"concepts":[{"name":"app"},{"name":"express"},{"name":"app"},{"name":"use"},{"name":"express"},{"name":"json"},{"name":"app"},{"name":"use"},{"name":"api"},{"name":"route"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/server.js#L11L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst PORT = process.env.PORT || 3000"},"concepts":[{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/server.js#L13L13","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\ndb.sync()"},"concepts":[{"name":"db"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/server.js#L15L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n    console.log(\'Database synced\')\\n    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))"},"concepts":[{"name":"database"},{"name":"synced"},{"name":"app"},{"name":"listen"},{"name":"port"},{"name":"server"},{"name":"running"},{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1}]}]}],"files":[]}],"files":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/config.js","linesOfCode":7,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/config.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { Sequelize } = require(\'sequelize\')\\nrequire(\'dotenv\').config()"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/config.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst sequelize = new Sequelize(process.env.DB_URL, {\\n  dialect: \'postgres\',\\n  logging: false"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"db url"},{"name":"dialect"},{"name":"postgres"},{"name":"logging"}],"heuristics":"A0","score":1}]},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/model.js","linesOfCode":25,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/model.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { DataTypes } = require(\'sequelize\')\\nconst sequelize = require(\'./config\')"},"concepts":[{"name":"data type"},{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/model.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Movie = sequelize.define(\'Movie\', {\\n  title: { type: DataTypes.STRING, allowNull: false },\\n  duration: { type: DataTypes.INTEGER, allowNull: false }                    "},"concepts":[{"name":"movie"},{"name":"sequelize"},{"name":"define"},{"name":"movie"},{"name":"title"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"duration"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/model.js#L9L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Cinema = sequelize.define(\'Cinema\', {\\n  name: { type: DataTypes.STRING, allowNull: false },\\n  location: { type: DataTypes.STRING, allowNull: false }"},"concepts":[{"name":"cinema"},{"name":"sequelize"},{"name":"define"},{"name":"cinema"},{"name":"name"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"location"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/model.js#L14L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Seat = sequelize.define(\'Seat\', {\\n  row: { type: DataTypes.STRING, allowNull: false },\\n  number: { type: DataTypes.INTEGER, allowNull: false }"},"concepts":[{"name":"seat"},{"name":"sequelize"},{"name":"define"},{"name":"seat"},{"name":"row"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/model.js#L19L21","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Ticket = sequelize.define(\'Ticket\', {\\n  price: { type: DataTypes.FLOAT, allowNull: false },\\n  status: { type: DataTypes.ENUM(\'available\', \'booked\', \'sold\'), defaultValue: \'available\' }"},"concepts":[{"name":"ticket"},{"name":"sequelize"},{"name":"define"},{"name":"ticket"},{"name":"price"},{"name":"type"},{"name":"data type"},{"name":"float"},{"name":"allow null"},{"name":"status"},{"name":"type"},{"name":"data type"},{"name":"available"},{"name":"booked"},{"name":"sold"},{"name":"default value"},{"name":"available"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/model.js#L25L26","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nCinema.hasMany(Movie)\\nMovie.belongsTo(Cinema)"},"concepts":[{"name":"cinema"},{"name":"many"},{"name":"movie"},{"name":"movie"},{"name":"belongs"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/model.js#L28L29","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nMovie.hasMany(Seat)\\nSeat.belongsTo(Movie)"},"concepts":[{"name":"movie"},{"name":"many"},{"name":"seat"},{"name":"seat"},{"name":"belongs"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/model.js#L31L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nSeat.hasOne(Ticket)\\nTicket.belongsTo(Seat)"},"concepts":[{"name":"seat"},{"name":"one"},{"name":"ticket"},{"name":"ticket"},{"name":"belongs"},{"name":"seat"}],"heuristics":"A0","score":1}]},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/router.js","linesOfCode":36,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/router.js#L1L3","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst express = require(\'express\')\\nconst { Movie, Cinema, Seat, Ticket } = require(\'./models\')\\nconst router = express.Router()"},"concepts":[{"name":"express"},{"name":"express"},{"name":"movie"},{"name":"cinema"},{"name":"seat"},{"name":"ticket"},{"name":"model"},{"name":"router"},{"name":"express"},{"name":"router"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/router.js#L6L8","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/movies\', async (req, res) => {\\n  const movies = await Movie.findAll()\\n  res.json(movies)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/router.js#L10L12","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/movies\', async (req, res) => {\\n  const movie = await Movie.create(req.body)\\n  res.json(movie)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/router.js#L16L18","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/cinemas\', async (req, res) => {\\n  const cinemas = await Cinema.findAll()\\n  res.json(cinemas)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/router.js#L20L22","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/cinemas\', async (req, res) => {\\n  const cinema = await Cinema.create(req.body)\\n  res.json(cinema)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/router.js#L26L28","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/seats\', async (req, res) => {\\n  const seats = await Seat.findAll()\\n  res.json(seats)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/router.js#L30L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/seats\', async (req, res) => {\\n  const seat = await Seat.create(req.body)\\n  res.json(seat)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/router.js#L36L38","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/tickets\', async (req, res) => {\\n  const tickets = await Ticket.findAll()\\n  res.json(tickets)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"ticket"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/router.js#L40L42","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/tickets\', async (req, res) => {\\n  const ticket = await Ticket.create(req.body)\\n  res.json(ticket)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"ticket"}],"heuristics":"A0","score":1}]},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/server.js","linesOfCode":15,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/server.js#L1L5","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrequire(\'dotenv\').config()\\nconst express = require(\'express\')\\nconst sequelize = require(\'./config\')\\nconst routes = require(\'./routes\')\\nconst { sequelize: db } = require(\'./models\')"},"concepts":[{"name":"config"},{"name":"express"},{"name":"express"},{"name":"sequelize"},{"name":"config"},{"name":"route"},{"name":"route"},{"name":"sequelize"},{"name":"db"},{"name":"model"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/server.js#L7L9","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst app = express()\\napp.use(express.json())\\napp.use(\'/api\', routes)"},"concepts":[{"name":"app"},{"name":"express"},{"name":"app"},{"name":"use"},{"name":"express"},{"name":"json"},{"name":"app"},{"name":"use"},{"name":"api"},{"name":"route"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/server.js#L11L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst PORT = process.env.PORT || 3000"},"concepts":[{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/server.js#L13L13","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\ndb.sync()"},"concepts":[{"name":"db"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/server.js#L15L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n    console.log(\'Database synced\')\\n    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))"},"concepts":[{"name":"database"},{"name":"synced"},{"name":"app"},{"name":"listen"},{"name":"port"},{"name":"server"},{"name":"running"},{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1}]}]}]}'
                expect(JSON.stringify(result)).toEqual(expectedRepository)
                await clean('StaticAnalyzerNLPTR_zebyf')
              })
          })
      })
  })

  it('extracts a NLP TR static analysis result by repository list with URL', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    await prepare('StaticAnalyzerNLPTR_hhcvf', 6)
    await prepare(path.join('StaticAnalyzerNLPTR_hhcvf', 'example', 'folder1'), 6)
    await prepare(
      path.join('StaticAnalyzerNLPTR_hhcvf', 'example', 'folder1', 'example', 'folder2'),
      6
    )
    const denimFilePath = path.join(
      tempPath,
      'StaticAnalyzerNLPTR_hhcvf',
      repositoryList[6].getLocation(),
      'denim'
    )
    let url = 'https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    await fs.writeFileSync(denimFilePath, url) // Creation of the denim file.

    // When Then
    await staticAnalyzerNLPTR
      .initializesByRepositories([repositoryList[6]], 'StaticAnalyzerNLPTR_hhcvf', optionsWithHints)
      .then(async (result) => {
        await staticAnalyzerNLPTR
          .identifyByRepositories(
            [repositoryList[6]],
            'StaticAnalyzerNLPTR_hhcvf',
            optionsWithHints
          )
          .then(async (result) => {
            await staticAnalyzerNLPTR
              .extractByRepositories(
                [repositoryList[6]],
                'StaticAnalyzerNLPTR_hhcvf',
                optionsWithHints
              )
              .then(async (result) => {
                //console.log(JSON.stringify(result, null, 4))
                let expectedRepositories =
                  '[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/","directories":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/","directories":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/","directories":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/","directories":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/","directories":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/","directories":[],"files":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/config.js","linesOfCode":7,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/config.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { Sequelize } = require(\'sequelize\')\\nrequire(\'dotenv\').config()"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/config.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst sequelize = new Sequelize(process.env.DB_URL, {\\n  dialect: \'postgres\',\\n  logging: false"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"db url"},{"name":"dialect"},{"name":"postgres"},{"name":"logging"}],"heuristics":"A0","score":1}]},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/model.js","linesOfCode":25,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/model.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { DataTypes } = require(\'sequelize\')\\nconst sequelize = require(\'./config\')"},"concepts":[{"name":"data type"},{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/model.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Movie = sequelize.define(\'Movie\', {\\n  title: { type: DataTypes.STRING, allowNull: false },\\n  duration: { type: DataTypes.INTEGER, allowNull: false }                    "},"concepts":[{"name":"movie"},{"name":"sequelize"},{"name":"define"},{"name":"movie"},{"name":"title"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"duration"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/model.js#L9L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Cinema = sequelize.define(\'Cinema\', {\\n  name: { type: DataTypes.STRING, allowNull: false },\\n  location: { type: DataTypes.STRING, allowNull: false }"},"concepts":[{"name":"cinema"},{"name":"sequelize"},{"name":"define"},{"name":"cinema"},{"name":"name"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"location"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/model.js#L14L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Seat = sequelize.define(\'Seat\', {\\n  row: { type: DataTypes.STRING, allowNull: false },\\n  number: { type: DataTypes.INTEGER, allowNull: false }"},"concepts":[{"name":"seat"},{"name":"sequelize"},{"name":"define"},{"name":"seat"},{"name":"row"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/model.js#L19L21","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Ticket = sequelize.define(\'Ticket\', {\\n  price: { type: DataTypes.FLOAT, allowNull: false },\\n  status: { type: DataTypes.ENUM(\'available\', \'booked\', \'sold\'), defaultValue: \'available\' }"},"concepts":[{"name":"ticket"},{"name":"sequelize"},{"name":"define"},{"name":"ticket"},{"name":"price"},{"name":"type"},{"name":"data type"},{"name":"float"},{"name":"allow null"},{"name":"status"},{"name":"type"},{"name":"data type"},{"name":"available"},{"name":"booked"},{"name":"sold"},{"name":"default value"},{"name":"available"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/model.js#L25L26","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nCinema.hasMany(Movie)\\nMovie.belongsTo(Cinema)"},"concepts":[{"name":"cinema"},{"name":"many"},{"name":"movie"},{"name":"movie"},{"name":"belongs"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/model.js#L28L29","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nMovie.hasMany(Seat)\\nSeat.belongsTo(Movie)"},"concepts":[{"name":"movie"},{"name":"many"},{"name":"seat"},{"name":"seat"},{"name":"belongs"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/model.js#L31L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nSeat.hasOne(Ticket)\\nTicket.belongsTo(Seat)"},"concepts":[{"name":"seat"},{"name":"one"},{"name":"ticket"},{"name":"ticket"},{"name":"belongs"},{"name":"seat"}],"heuristics":"A0","score":1}]},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/router.js","linesOfCode":36,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/router.js#L1L3","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst express = require(\'express\')\\nconst { Movie, Cinema, Seat, Ticket } = require(\'./models\')\\nconst router = express.Router()"},"concepts":[{"name":"express"},{"name":"express"},{"name":"movie"},{"name":"cinema"},{"name":"seat"},{"name":"ticket"},{"name":"model"},{"name":"router"},{"name":"express"},{"name":"router"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/router.js#L6L8","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/movies\', async (req, res) => {\\n  const movies = await Movie.findAll()\\n  res.json(movies)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/router.js#L10L12","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/movies\', async (req, res) => {\\n  const movie = await Movie.create(req.body)\\n  res.json(movie)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/router.js#L16L18","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/cinemas\', async (req, res) => {\\n  const cinemas = await Cinema.findAll()\\n  res.json(cinemas)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/router.js#L20L22","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/cinemas\', async (req, res) => {\\n  const cinema = await Cinema.create(req.body)\\n  res.json(cinema)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/router.js#L26L28","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/seats\', async (req, res) => {\\n  const seats = await Seat.findAll()\\n  res.json(seats)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/router.js#L30L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/seats\', async (req, res) => {\\n  const seat = await Seat.create(req.body)\\n  res.json(seat)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/router.js#L36L38","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/tickets\', async (req, res) => {\\n  const tickets = await Ticket.findAll()\\n  res.json(tickets)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"ticket"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/router.js#L40L42","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/tickets\', async (req, res) => {\\n  const ticket = await Ticket.create(req.body)\\n  res.json(ticket)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"ticket"}],"heuristics":"A0","score":1}]},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/server.js","linesOfCode":15,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/server.js#L1L5","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrequire(\'dotenv\').config()\\nconst express = require(\'express\')\\nconst sequelize = require(\'./config\')\\nconst routes = require(\'./routes\')\\nconst { sequelize: db } = require(\'./models\')"},"concepts":[{"name":"config"},{"name":"express"},{"name":"express"},{"name":"sequelize"},{"name":"config"},{"name":"route"},{"name":"route"},{"name":"sequelize"},{"name":"db"},{"name":"model"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/server.js#L7L9","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst app = express()\\napp.use(express.json())\\napp.use(\'/api\', routes)"},"concepts":[{"name":"app"},{"name":"express"},{"name":"app"},{"name":"use"},{"name":"express"},{"name":"json"},{"name":"app"},{"name":"use"},{"name":"api"},{"name":"route"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/server.js#L11L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst PORT = process.env.PORT || 3000"},"concepts":[{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/server.js#L13L13","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\ndb.sync()"},"concepts":[{"name":"db"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/folder2/example/server.js#L15L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n    console.log(\'Database synced\')\\n    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))"},"concepts":[{"name":"database"},{"name":"synced"},{"name":"app"},{"name":"listen"},{"name":"port"},{"name":"server"},{"name":"running"},{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1}]}]}],"files":[]}],"files":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/config.js","linesOfCode":7,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/config.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { Sequelize } = require(\'sequelize\')\\nrequire(\'dotenv\').config()"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/config.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst sequelize = new Sequelize(process.env.DB_URL, {\\n  dialect: \'postgres\',\\n  logging: false"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"db url"},{"name":"dialect"},{"name":"postgres"},{"name":"logging"}],"heuristics":"A0","score":1}]},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/model.js","linesOfCode":25,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/model.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { DataTypes } = require(\'sequelize\')\\nconst sequelize = require(\'./config\')"},"concepts":[{"name":"data type"},{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/model.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Movie = sequelize.define(\'Movie\', {\\n  title: { type: DataTypes.STRING, allowNull: false },\\n  duration: { type: DataTypes.INTEGER, allowNull: false }                    "},"concepts":[{"name":"movie"},{"name":"sequelize"},{"name":"define"},{"name":"movie"},{"name":"title"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"duration"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/model.js#L9L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Cinema = sequelize.define(\'Cinema\', {\\n  name: { type: DataTypes.STRING, allowNull: false },\\n  location: { type: DataTypes.STRING, allowNull: false }"},"concepts":[{"name":"cinema"},{"name":"sequelize"},{"name":"define"},{"name":"cinema"},{"name":"name"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"location"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/model.js#L14L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Seat = sequelize.define(\'Seat\', {\\n  row: { type: DataTypes.STRING, allowNull: false },\\n  number: { type: DataTypes.INTEGER, allowNull: false }"},"concepts":[{"name":"seat"},{"name":"sequelize"},{"name":"define"},{"name":"seat"},{"name":"row"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/model.js#L19L21","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Ticket = sequelize.define(\'Ticket\', {\\n  price: { type: DataTypes.FLOAT, allowNull: false },\\n  status: { type: DataTypes.ENUM(\'available\', \'booked\', \'sold\'), defaultValue: \'available\' }"},"concepts":[{"name":"ticket"},{"name":"sequelize"},{"name":"define"},{"name":"ticket"},{"name":"price"},{"name":"type"},{"name":"data type"},{"name":"float"},{"name":"allow null"},{"name":"status"},{"name":"type"},{"name":"data type"},{"name":"available"},{"name":"booked"},{"name":"sold"},{"name":"default value"},{"name":"available"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/model.js#L25L26","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nCinema.hasMany(Movie)\\nMovie.belongsTo(Cinema)"},"concepts":[{"name":"cinema"},{"name":"many"},{"name":"movie"},{"name":"movie"},{"name":"belongs"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/model.js#L28L29","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nMovie.hasMany(Seat)\\nSeat.belongsTo(Movie)"},"concepts":[{"name":"movie"},{"name":"many"},{"name":"seat"},{"name":"seat"},{"name":"belongs"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/model.js#L31L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nSeat.hasOne(Ticket)\\nTicket.belongsTo(Seat)"},"concepts":[{"name":"seat"},{"name":"one"},{"name":"ticket"},{"name":"ticket"},{"name":"belongs"},{"name":"seat"}],"heuristics":"A0","score":1}]},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/router.js","linesOfCode":36,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/router.js#L1L3","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst express = require(\'express\')\\nconst { Movie, Cinema, Seat, Ticket } = require(\'./models\')\\nconst router = express.Router()"},"concepts":[{"name":"express"},{"name":"express"},{"name":"movie"},{"name":"cinema"},{"name":"seat"},{"name":"ticket"},{"name":"model"},{"name":"router"},{"name":"express"},{"name":"router"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/router.js#L6L8","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/movies\', async (req, res) => {\\n  const movies = await Movie.findAll()\\n  res.json(movies)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/router.js#L10L12","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/movies\', async (req, res) => {\\n  const movie = await Movie.create(req.body)\\n  res.json(movie)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/router.js#L16L18","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/cinemas\', async (req, res) => {\\n  const cinemas = await Cinema.findAll()\\n  res.json(cinemas)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/router.js#L20L22","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/cinemas\', async (req, res) => {\\n  const cinema = await Cinema.create(req.body)\\n  res.json(cinema)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/router.js#L26L28","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/seats\', async (req, res) => {\\n  const seats = await Seat.findAll()\\n  res.json(seats)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/router.js#L30L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/seats\', async (req, res) => {\\n  const seat = await Seat.create(req.body)\\n  res.json(seat)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/router.js#L36L38","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/tickets\', async (req, res) => {\\n  const tickets = await Ticket.findAll()\\n  res.json(tickets)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"ticket"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/router.js#L40L42","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/tickets\', async (req, res) => {\\n  const ticket = await Ticket.create(req.body)\\n  res.json(ticket)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"ticket"}],"heuristics":"A0","score":1}]},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/server.js","linesOfCode":15,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/server.js#L1L5","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrequire(\'dotenv\').config()\\nconst express = require(\'express\')\\nconst sequelize = require(\'./config\')\\nconst routes = require(\'./routes\')\\nconst { sequelize: db } = require(\'./models\')"},"concepts":[{"name":"config"},{"name":"express"},{"name":"express"},{"name":"sequelize"},{"name":"config"},{"name":"route"},{"name":"route"},{"name":"sequelize"},{"name":"db"},{"name":"model"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/server.js#L7L9","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst app = express()\\napp.use(express.json())\\napp.use(\'/api\', routes)"},"concepts":[{"name":"app"},{"name":"express"},{"name":"app"},{"name":"use"},{"name":"express"},{"name":"json"},{"name":"app"},{"name":"use"},{"name":"api"},{"name":"route"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/server.js#L11L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst PORT = process.env.PORT || 3000"},"concepts":[{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/server.js#L13L13","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\ndb.sync()"},"concepts":[{"name":"db"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/folder1/example/server.js#L15L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n    console.log(\'Database synced\')\\n    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))"},"concepts":[{"name":"database"},{"name":"synced"},{"name":"app"},{"name":"listen"},{"name":"port"},{"name":"server"},{"name":"running"},{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1}]}]}],"files":[]}],"files":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/config.js","linesOfCode":7,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/config.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { Sequelize } = require(\'sequelize\')\\nrequire(\'dotenv\').config()"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/config.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst sequelize = new Sequelize(process.env.DB_URL, {\\n  dialect: \'postgres\',\\n  logging: false"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"db url"},{"name":"dialect"},{"name":"postgres"},{"name":"logging"}],"heuristics":"A0","score":1}]},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/model.js","linesOfCode":25,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/model.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { DataTypes } = require(\'sequelize\')\\nconst sequelize = require(\'./config\')"},"concepts":[{"name":"data type"},{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/model.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Movie = sequelize.define(\'Movie\', {\\n  title: { type: DataTypes.STRING, allowNull: false },\\n  duration: { type: DataTypes.INTEGER, allowNull: false }                    "},"concepts":[{"name":"movie"},{"name":"sequelize"},{"name":"define"},{"name":"movie"},{"name":"title"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"duration"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/model.js#L9L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Cinema = sequelize.define(\'Cinema\', {\\n  name: { type: DataTypes.STRING, allowNull: false },\\n  location: { type: DataTypes.STRING, allowNull: false }"},"concepts":[{"name":"cinema"},{"name":"sequelize"},{"name":"define"},{"name":"cinema"},{"name":"name"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"location"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/model.js#L14L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Seat = sequelize.define(\'Seat\', {\\n  row: { type: DataTypes.STRING, allowNull: false },\\n  number: { type: DataTypes.INTEGER, allowNull: false }"},"concepts":[{"name":"seat"},{"name":"sequelize"},{"name":"define"},{"name":"seat"},{"name":"row"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/model.js#L19L21","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Ticket = sequelize.define(\'Ticket\', {\\n  price: { type: DataTypes.FLOAT, allowNull: false },\\n  status: { type: DataTypes.ENUM(\'available\', \'booked\', \'sold\'), defaultValue: \'available\' }"},"concepts":[{"name":"ticket"},{"name":"sequelize"},{"name":"define"},{"name":"ticket"},{"name":"price"},{"name":"type"},{"name":"data type"},{"name":"float"},{"name":"allow null"},{"name":"status"},{"name":"type"},{"name":"data type"},{"name":"available"},{"name":"booked"},{"name":"sold"},{"name":"default value"},{"name":"available"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/model.js#L25L26","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nCinema.hasMany(Movie)\\nMovie.belongsTo(Cinema)"},"concepts":[{"name":"cinema"},{"name":"many"},{"name":"movie"},{"name":"movie"},{"name":"belongs"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/model.js#L28L29","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nMovie.hasMany(Seat)\\nSeat.belongsTo(Movie)"},"concepts":[{"name":"movie"},{"name":"many"},{"name":"seat"},{"name":"seat"},{"name":"belongs"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/model.js#L31L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nSeat.hasOne(Ticket)\\nTicket.belongsTo(Seat)"},"concepts":[{"name":"seat"},{"name":"one"},{"name":"ticket"},{"name":"ticket"},{"name":"belongs"},{"name":"seat"}],"heuristics":"A0","score":1}]},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/router.js","linesOfCode":36,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/router.js#L1L3","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst express = require(\'express\')\\nconst { Movie, Cinema, Seat, Ticket } = require(\'./models\')\\nconst router = express.Router()"},"concepts":[{"name":"express"},{"name":"express"},{"name":"movie"},{"name":"cinema"},{"name":"seat"},{"name":"ticket"},{"name":"model"},{"name":"router"},{"name":"express"},{"name":"router"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/router.js#L6L8","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/movies\', async (req, res) => {\\n  const movies = await Movie.findAll()\\n  res.json(movies)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/router.js#L10L12","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/movies\', async (req, res) => {\\n  const movie = await Movie.create(req.body)\\n  res.json(movie)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/router.js#L16L18","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/cinemas\', async (req, res) => {\\n  const cinemas = await Cinema.findAll()\\n  res.json(cinemas)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/router.js#L20L22","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/cinemas\', async (req, res) => {\\n  const cinema = await Cinema.create(req.body)\\n  res.json(cinema)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/router.js#L26L28","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/seats\', async (req, res) => {\\n  const seats = await Seat.findAll()\\n  res.json(seats)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/router.js#L30L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/seats\', async (req, res) => {\\n  const seat = await Seat.create(req.body)\\n  res.json(seat)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/router.js#L36L38","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/tickets\', async (req, res) => {\\n  const tickets = await Ticket.findAll()\\n  res.json(tickets)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"find all"},{"name":"res"},{"name":"json"},{"name":"ticket"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/router.js#L40L42","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/tickets\', async (req, res) => {\\n  const ticket = await Ticket.create(req.body)\\n  res.json(ticket)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"create"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"json"},{"name":"ticket"}],"heuristics":"A0","score":1}]},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/server.js","linesOfCode":15,"codeFragments":[{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/server.js#L1L5","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrequire(\'dotenv\').config()\\nconst express = require(\'express\')\\nconst sequelize = require(\'./config\')\\nconst routes = require(\'./routes\')\\nconst { sequelize: db } = require(\'./models\')"},"concepts":[{"name":"config"},{"name":"express"},{"name":"express"},{"name":"sequelize"},{"name":"config"},{"name":"route"},{"name":"route"},{"name":"sequelize"},{"name":"db"},{"name":"model"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/server.js#L7L9","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst app = express()\\napp.use(express.json())\\napp.use(\'/api\', routes)"},"concepts":[{"name":"app"},{"name":"express"},{"name":"app"},{"name":"use"},{"name":"express"},{"name":"json"},{"name":"app"},{"name":"use"},{"name":"api"},{"name":"route"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/server.js#L11L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst PORT = process.env.PORT || 3000"},"concepts":[{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/server.js#L13L13","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\ndb.sync()"},"concepts":[{"name":"db"}],"heuristics":"A0","score":1},{"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/server.js#L15L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n    console.log(\'Database synced\')\\n    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))"},"concepts":[{"name":"database"},{"name":"synced"},{"name":"app"},{"name":"listen"},{"name":"port"},{"name":"server"},{"name":"running"},{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1}]}]}]}]'
                expect(JSON.stringify(result)).toEqual(expectedRepositories)
                await clean('StaticAnalyzerNLPTR_hhcvf')
              })
          })
      })
  })

  it('interprets a NLP TR static analysis result with hints', async () => {
    // Given
    await prepare('StaticAnalyzerNLPTR_ijhgr', 7)
    const staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    const NLP = require('../../helper/NLP.helper')
    const mockResult = ['movie', 'cinema', 'seat', 'ticket'] // Obtained by executing manually the application.
    jest.spyOn(NLP.prototype, 'classifyConcept').mockResolvedValue(mockResult)

    // When Then
    await staticAnalyzerNLPTR
      .initializesByRepositories([repositoryList[7]], 'StaticAnalyzerNLPTR_ijhgr', optionsWithHints)
      .then(async (result) => {
        await staticAnalyzerNLPTR
          .identifyByRepositories(
            [repositoryList[7]],
            'StaticAnalyzerNLPTR_ijhgr',
            optionsWithHints
          )
          .then(async (result) => {
            await staticAnalyzerNLPTR
              .extractByRepositories(
                [repositoryList[7]],
                'StaticAnalyzerNLPTR_ijhgr',
                optionsWithHints
              )
              .then(async (result) => {
                await staticAnalyzerNLPTR
                  .interpretByRepositories(
                    [repositoryList[7]],
                    'StaticAnalyzerNLPTR_ijhgr',
                    optionsWithHints
                  )
                  .then(async (result) => {
                    expect(JSON.stringify(result)).toEqual(
                      '[{"location":"example/","directories":[{"location":"example/","directories":[],"files":[{"location":"example/config.js","linesOfCode":7,"codeFragments":[]},{"location":"example/model.js","linesOfCode":25,"codeFragments":[{"location":"example/model.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Movie = sequelize.define(\'Movie\', {\\n  title: { type: DataTypes.STRING, allowNull: false },\\n  duration: { type: DataTypes.INTEGER, allowNull: false }                    "},"concepts":[{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/model.js#L9L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Cinema = sequelize.define(\'Cinema\', {\\n  name: { type: DataTypes.STRING, allowNull: false },\\n  location: { type: DataTypes.STRING, allowNull: false }"},"concepts":[{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/model.js#L14L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Seat = sequelize.define(\'Seat\', {\\n  row: { type: DataTypes.STRING, allowNull: false },\\n  number: { type: DataTypes.INTEGER, allowNull: false }"},"concepts":[{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/model.js#L19L21","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Ticket = sequelize.define(\'Ticket\', {\\n  price: { type: DataTypes.FLOAT, allowNull: false },\\n  status: { type: DataTypes.ENUM(\'available\', \'booked\', \'sold\'), defaultValue: \'available\' }"},"concepts":[{"name":"ticket"}],"heuristics":"A0","score":1},{"location":"example/model.js#L25L26","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nCinema.hasMany(Movie)\\nMovie.belongsTo(Cinema)"},"concepts":[{"name":"cinema"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/model.js#L28L29","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nMovie.hasMany(Seat)\\nSeat.belongsTo(Movie)"},"concepts":[{"name":"movie"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/model.js#L31L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nSeat.hasOne(Ticket)\\nTicket.belongsTo(Seat)"},"concepts":[{"name":"seat"},{"name":"ticket"}],"heuristics":"A0","score":1}]},{"location":"example/router.js","linesOfCode":36,"codeFragments":[{"location":"example/router.js#L1L3","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst express = require(\'express\')\\nconst { Movie, Cinema, Seat, Ticket } = require(\'./models\')\\nconst router = express.Router()"},"concepts":[{"name":"movie"},{"name":"cinema"},{"name":"seat"},{"name":"ticket"}],"heuristics":"A0","score":1},{"location":"example/router.js#L6L8","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/movies\', async (req, res) => {\\n  const movies = await Movie.findAll()\\n  res.json(movies)"},"concepts":[{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/router.js#L10L12","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/movies\', async (req, res) => {\\n  const movie = await Movie.create(req.body)\\n  res.json(movie)"},"concepts":[{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/router.js#L16L18","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/cinemas\', async (req, res) => {\\n  const cinemas = await Cinema.findAll()\\n  res.json(cinemas)"},"concepts":[{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/router.js#L20L22","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/cinemas\', async (req, res) => {\\n  const cinema = await Cinema.create(req.body)\\n  res.json(cinema)"},"concepts":[{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/router.js#L26L28","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/seats\', async (req, res) => {\\n  const seats = await Seat.findAll()\\n  res.json(seats)"},"concepts":[{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/router.js#L30L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/seats\', async (req, res) => {\\n  const seat = await Seat.create(req.body)\\n  res.json(seat)"},"concepts":[{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/router.js#L36L38","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/tickets\', async (req, res) => {\\n  const tickets = await Ticket.findAll()\\n  res.json(tickets)"},"concepts":[{"name":"ticket"}],"heuristics":"A0","score":1},{"location":"example/router.js#L40L42","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/tickets\', async (req, res) => {\\n  const ticket = await Ticket.create(req.body)\\n  res.json(ticket)"},"concepts":[{"name":"ticket"}],"heuristics":"A0","score":1}]},{"location":"example/server.js","linesOfCode":15,"codeFragments":[]}]}]}]'
                    )
                    await clean('StaticAnalyzerNLPTR_ijhgr')
                  })
              })
          })
      })
  })

  it('interprets a NLP TR static analysis result without hints', async () => {
    // Given
    await prepare('StaticAnalyzerNLPTR_bcvd', 8)
    const staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    const NLP = require('../../helper/NLP.helper')
    const mockResult = [] // Obtained by executing manually the application.
    jest.spyOn(NLP.prototype, 'classifyConcept').mockResolvedValue(mockResult)

    // When Then
    await staticAnalyzerNLPTR
      .initializesByRepositories([repositoryList[8]], 'StaticAnalyzerNLPTR_bcvd', optionsWithHints)
      .then(async (result) => {
        await staticAnalyzerNLPTR
          .identifyByRepositories([repositoryList[8]], 'StaticAnalyzerNLPTR_bcvd', optionsWithHints)
          .then(async (result) => {
            await staticAnalyzerNLPTR
              .extractByRepositories(
                [repositoryList[8]],
                'StaticAnalyzerNLPTR_bcvd',
                optionsWithHints
              )
              .then(async (result) => {
                await staticAnalyzerNLPTR
                  .interpretByRepositories(
                    [repositoryList[8]],
                    'StaticAnalyzerNLPTR_bcvd',
                    optionsWithHints
                  )
                  .then(async (result) => {
                    expect(JSON.stringify(result)).toEqual(
                      '[{"location":"example/","directories":[{"location":"example/","directories":[],"files":[{"location":"example/config.js","linesOfCode":7,"codeFragments":[]},{"location":"example/model.js","linesOfCode":25,"codeFragments":[]},{"location":"example/router.js","linesOfCode":36,"codeFragments":[]},{"location":"example/server.js","linesOfCode":15,"codeFragments":[]}]}]}]'
                    )
                    await clean('StaticAnalyzerNLPTR_bcvd')
                  })
              })
          })
      })
  })

  it('sets a repository model instance', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    await prepare('StaticAnalyzerNLPTR_iauzd', 9)
    await prepare(path.join('StaticAnalyzerNLPTR_iauzd', 'example', 'folder1'), 9)
    await prepare(
      path.join('StaticAnalyzerNLPTR_iauzd', 'example', 'folder1', 'example', 'folder2'),
      9
    )

    // When

    let repository = staticAnalyzerNLPTR.setRepository(
      repositoryList[9],
      'StaticAnalyzerNLPTR_iauzd',
      options
    )

    // Then
    let expectedRepository =
      '{"location":"example/","directories":[{"location":"example/","directories":[{"location":"example/folder1/","directories":[{"location":"example/folder1/example/","directories":[{"location":"example/folder1/example/folder2/","directories":[{"location":"example/folder1/example/folder2/example/","directories":[],"files":[{"location":"example/folder1/example/folder2/example/config.js","linesOfCode":0,"codeFragments":[{"location":"example/folder1/example/folder2/example/config.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { Sequelize } = require(\'sequelize\')\\nrequire(\'dotenv\').config()"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/config.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst sequelize = new Sequelize(process.env.DB_URL, {\\n  dialect: \'postgres\',\\n  logging: false"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"db url"},{"name":"dialect"},{"name":"postgres"},{"name":"logging"}],"heuristics":"A0","score":1}]},{"location":"example/folder1/example/folder2/example/model.js","linesOfCode":0,"codeFragments":[{"location":"example/folder1/example/folder2/example/model.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { DataTypes } = require(\'sequelize\')\\nconst sequelize = require(\'./config\')"},"concepts":[{"name":"data type"},{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/model.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Movie = sequelize.define(\'Movie\', {\\n  title: { type: DataTypes.STRING, allowNull: false },\\n  duration: { type: DataTypes.INTEGER, allowNull: false }                    "},"concepts":[{"name":"movie"},{"name":"sequelize"},{"name":"define"},{"name":"movie"},{"name":"title"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"duration"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/model.js#L9L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Cinema = sequelize.define(\'Cinema\', {\\n  name: { type: DataTypes.STRING, allowNull: false },\\n  location: { type: DataTypes.STRING, allowNull: false }"},"concepts":[{"name":"cinema"},{"name":"sequelize"},{"name":"define"},{"name":"cinema"},{"name":"name"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"location"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/model.js#L14L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Seat = sequelize.define(\'Seat\', {\\n  row: { type: DataTypes.STRING, allowNull: false },\\n  number: { type: DataTypes.INTEGER, allowNull: false }"},"concepts":[{"name":"seat"},{"name":"sequelize"},{"name":"define"},{"name":"seat"},{"name":"row"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/model.js#L19L21","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Ticket = sequelize.define(\'Ticket\', {\\n  price: { type: DataTypes.FLOAT, allowNull: false },\\n  status: { type: DataTypes.ENUM(\'available\', \'booked\', \'sold\'), defaultValue: \'available\' }"},"concepts":[{"name":"ticket"},{"name":"sequelize"},{"name":"define"},{"name":"ticket"},{"name":"price"},{"name":"type"},{"name":"data type"},{"name":"float"},{"name":"allow null"},{"name":"status"},{"name":"type"},{"name":"data type"},{"name":"available"},{"name":"booked"},{"name":"sold"},{"name":"default value"},{"name":"available"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/model.js#L25L26","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nCinema.hasMany(Movie)\\nMovie.belongsTo(Cinema)"},"concepts":[{"name":"cinema"},{"name":"many"},{"name":"movie"},{"name":"movie"},{"name":"belongs"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/model.js#L28L29","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nMovie.hasMany(Seat)\\nSeat.belongsTo(Movie)"},"concepts":[{"name":"movie"},{"name":"many"},{"name":"seat"},{"name":"seat"},{"name":"belongs"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/model.js#L31L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nSeat.hasOne(Ticket)\\nTicket.belongsTo(Seat)"},"concepts":[{"name":"seat"},{"name":"one"},{"name":"ticket"},{"name":"ticket"},{"name":"belongs"},{"name":"seat"}],"heuristics":"A0","score":1}]},{"location":"example/folder1/example/folder2/example/router.js","linesOfCode":0,"codeFragments":[{"location":"example/folder1/example/folder2/example/router.js#L1L3","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst express = require(\'express\')\\nconst { Movie, Cinema, Seat, Ticket } = require(\'./models\')\\nconst router = express.Router()"},"concepts":[{"name":"express"},{"name":"express"},{"name":"movie"},{"name":"cinema"},{"name":"seat"},{"name":"ticket"},{"name":"model"},{"name":"router"},{"name":"express"},{"name":"router"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/router.js#L6L8","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/movies\', async (req, res) => {\\n  const movies = await Movie.findAll()\\n  res.json(movies)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"find all"},{"name":"res"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/router.js#L10L12","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/movies\', async (req, res) => {\\n  const movie = await Movie.create(req.body)\\n  res.json(movie)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/router.js#L16L18","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/cinemas\', async (req, res) => {\\n  const cinemas = await Cinema.findAll()\\n  res.json(cinemas)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"find all"},{"name":"res"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/router.js#L20L22","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/cinemas\', async (req, res) => {\\n  const cinema = await Cinema.create(req.body)\\n  res.json(cinema)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/router.js#L26L28","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/seats\', async (req, res) => {\\n  const seats = await Seat.findAll()\\n  res.json(seats)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"find all"},{"name":"res"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/router.js#L30L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/seats\', async (req, res) => {\\n  const seat = await Seat.create(req.body)\\n  res.json(seat)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/router.js#L36L38","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/tickets\', async (req, res) => {\\n  const tickets = await Ticket.findAll()\\n  res.json(tickets)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"find all"},{"name":"res"},{"name":"ticket"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/router.js#L40L42","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/tickets\', async (req, res) => {\\n  const ticket = await Ticket.create(req.body)\\n  res.json(ticket)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"ticket"}],"heuristics":"A0","score":1}]},{"location":"example/folder1/example/folder2/example/server.js","linesOfCode":0,"codeFragments":[{"location":"example/folder1/example/folder2/example/server.js#L1L5","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrequire(\'dotenv\').config()\\nconst express = require(\'express\')\\nconst sequelize = require(\'./config\')\\nconst routes = require(\'./routes\')\\nconst { sequelize: db } = require(\'./models\')"},"concepts":[{"name":"config"},{"name":"express"},{"name":"express"},{"name":"sequelize"},{"name":"config"},{"name":"route"},{"name":"route"},{"name":"sequelize"},{"name":"db"},{"name":"model"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/server.js#L7L9","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst app = express()\\napp.use(express.json())\\napp.use(\'/api\', routes)"},"concepts":[{"name":"app"},{"name":"express"},{"name":"app"},{"name":"use"},{"name":"express"},{"name":"app"},{"name":"use"},{"name":"api"},{"name":"route"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/server.js#L11L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst PORT = process.env.PORT || 3000"},"concepts":[{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/server.js#L13L13","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\ndb.sync()"},"concepts":[{"name":"db"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/folder2/example/server.js#L15L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n    console.log(\'Database synced\')\\n    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))"},"concepts":[{"name":"database"},{"name":"synced"},{"name":"app"},{"name":"listen"},{"name":"port"},{"name":"server"},{"name":"running"},{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1}]}]}],"files":[]}],"files":[{"location":"example/folder1/example/config.js","linesOfCode":0,"codeFragments":[{"location":"example/folder1/example/config.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { Sequelize } = require(\'sequelize\')\\nrequire(\'dotenv\').config()"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/config.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst sequelize = new Sequelize(process.env.DB_URL, {\\n  dialect: \'postgres\',\\n  logging: false"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"db url"},{"name":"dialect"},{"name":"postgres"},{"name":"logging"}],"heuristics":"A0","score":1}]},{"location":"example/folder1/example/model.js","linesOfCode":0,"codeFragments":[{"location":"example/folder1/example/model.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { DataTypes } = require(\'sequelize\')\\nconst sequelize = require(\'./config\')"},"concepts":[{"name":"data type"},{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/model.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Movie = sequelize.define(\'Movie\', {\\n  title: { type: DataTypes.STRING, allowNull: false },\\n  duration: { type: DataTypes.INTEGER, allowNull: false }                    "},"concepts":[{"name":"movie"},{"name":"sequelize"},{"name":"define"},{"name":"movie"},{"name":"title"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"duration"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/model.js#L9L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Cinema = sequelize.define(\'Cinema\', {\\n  name: { type: DataTypes.STRING, allowNull: false },\\n  location: { type: DataTypes.STRING, allowNull: false }"},"concepts":[{"name":"cinema"},{"name":"sequelize"},{"name":"define"},{"name":"cinema"},{"name":"name"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"location"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/model.js#L14L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Seat = sequelize.define(\'Seat\', {\\n  row: { type: DataTypes.STRING, allowNull: false },\\n  number: { type: DataTypes.INTEGER, allowNull: false }"},"concepts":[{"name":"seat"},{"name":"sequelize"},{"name":"define"},{"name":"seat"},{"name":"row"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/model.js#L19L21","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Ticket = sequelize.define(\'Ticket\', {\\n  price: { type: DataTypes.FLOAT, allowNull: false },\\n  status: { type: DataTypes.ENUM(\'available\', \'booked\', \'sold\'), defaultValue: \'available\' }"},"concepts":[{"name":"ticket"},{"name":"sequelize"},{"name":"define"},{"name":"ticket"},{"name":"price"},{"name":"type"},{"name":"data type"},{"name":"float"},{"name":"allow null"},{"name":"status"},{"name":"type"},{"name":"data type"},{"name":"available"},{"name":"booked"},{"name":"sold"},{"name":"default value"},{"name":"available"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/model.js#L25L26","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nCinema.hasMany(Movie)\\nMovie.belongsTo(Cinema)"},"concepts":[{"name":"cinema"},{"name":"many"},{"name":"movie"},{"name":"movie"},{"name":"belongs"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/model.js#L28L29","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nMovie.hasMany(Seat)\\nSeat.belongsTo(Movie)"},"concepts":[{"name":"movie"},{"name":"many"},{"name":"seat"},{"name":"seat"},{"name":"belongs"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/model.js#L31L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nSeat.hasOne(Ticket)\\nTicket.belongsTo(Seat)"},"concepts":[{"name":"seat"},{"name":"one"},{"name":"ticket"},{"name":"ticket"},{"name":"belongs"},{"name":"seat"}],"heuristics":"A0","score":1}]},{"location":"example/folder1/example/router.js","linesOfCode":0,"codeFragments":[{"location":"example/folder1/example/router.js#L1L3","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst express = require(\'express\')\\nconst { Movie, Cinema, Seat, Ticket } = require(\'./models\')\\nconst router = express.Router()"},"concepts":[{"name":"express"},{"name":"express"},{"name":"movie"},{"name":"cinema"},{"name":"seat"},{"name":"ticket"},{"name":"model"},{"name":"router"},{"name":"express"},{"name":"router"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/router.js#L6L8","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/movies\', async (req, res) => {\\n  const movies = await Movie.findAll()\\n  res.json(movies)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"find all"},{"name":"res"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/router.js#L10L12","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/movies\', async (req, res) => {\\n  const movie = await Movie.create(req.body)\\n  res.json(movie)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/router.js#L16L18","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/cinemas\', async (req, res) => {\\n  const cinemas = await Cinema.findAll()\\n  res.json(cinemas)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"find all"},{"name":"res"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/router.js#L20L22","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/cinemas\', async (req, res) => {\\n  const cinema = await Cinema.create(req.body)\\n  res.json(cinema)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/router.js#L26L28","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/seats\', async (req, res) => {\\n  const seats = await Seat.findAll()\\n  res.json(seats)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"find all"},{"name":"res"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/router.js#L30L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/seats\', async (req, res) => {\\n  const seat = await Seat.create(req.body)\\n  res.json(seat)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/router.js#L36L38","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/tickets\', async (req, res) => {\\n  const tickets = await Ticket.findAll()\\n  res.json(tickets)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"find all"},{"name":"res"},{"name":"ticket"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/router.js#L40L42","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/tickets\', async (req, res) => {\\n  const ticket = await Ticket.create(req.body)\\n  res.json(ticket)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"ticket"}],"heuristics":"A0","score":1}]},{"location":"example/folder1/example/server.js","linesOfCode":0,"codeFragments":[{"location":"example/folder1/example/server.js#L1L5","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrequire(\'dotenv\').config()\\nconst express = require(\'express\')\\nconst sequelize = require(\'./config\')\\nconst routes = require(\'./routes\')\\nconst { sequelize: db } = require(\'./models\')"},"concepts":[{"name":"config"},{"name":"express"},{"name":"express"},{"name":"sequelize"},{"name":"config"},{"name":"route"},{"name":"route"},{"name":"sequelize"},{"name":"db"},{"name":"model"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/server.js#L7L9","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst app = express()\\napp.use(express.json())\\napp.use(\'/api\', routes)"},"concepts":[{"name":"app"},{"name":"express"},{"name":"app"},{"name":"use"},{"name":"express"},{"name":"app"},{"name":"use"},{"name":"api"},{"name":"route"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/server.js#L11L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst PORT = process.env.PORT || 3000"},"concepts":[{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/server.js#L13L13","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\ndb.sync()"},"concepts":[{"name":"db"}],"heuristics":"A0","score":1},{"location":"example/folder1/example/server.js#L15L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n    console.log(\'Database synced\')\\n    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))"},"concepts":[{"name":"database"},{"name":"synced"},{"name":"app"},{"name":"listen"},{"name":"port"},{"name":"server"},{"name":"running"},{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1}]}]}],"files":[]}],"files":[{"location":"example/config.js","linesOfCode":0,"codeFragments":[{"location":"example/config.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { Sequelize } = require(\'sequelize\')\\nrequire(\'dotenv\').config()"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"example/config.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst sequelize = new Sequelize(process.env.DB_URL, {\\n  dialect: \'postgres\',\\n  logging: false"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"db url"},{"name":"dialect"},{"name":"postgres"},{"name":"logging"}],"heuristics":"A0","score":1}]},{"location":"example/model.js","linesOfCode":0,"codeFragments":[{"location":"example/model.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { DataTypes } = require(\'sequelize\')\\nconst sequelize = require(\'./config\')"},"concepts":[{"name":"data type"},{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"example/model.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Movie = sequelize.define(\'Movie\', {\\n  title: { type: DataTypes.STRING, allowNull: false },\\n  duration: { type: DataTypes.INTEGER, allowNull: false }                    "},"concepts":[{"name":"movie"},{"name":"sequelize"},{"name":"define"},{"name":"movie"},{"name":"title"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"duration"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/model.js#L9L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Cinema = sequelize.define(\'Cinema\', {\\n  name: { type: DataTypes.STRING, allowNull: false },\\n  location: { type: DataTypes.STRING, allowNull: false }"},"concepts":[{"name":"cinema"},{"name":"sequelize"},{"name":"define"},{"name":"cinema"},{"name":"name"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"location"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/model.js#L14L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Seat = sequelize.define(\'Seat\', {\\n  row: { type: DataTypes.STRING, allowNull: false },\\n  number: { type: DataTypes.INTEGER, allowNull: false }"},"concepts":[{"name":"seat"},{"name":"sequelize"},{"name":"define"},{"name":"seat"},{"name":"row"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/model.js#L19L21","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Ticket = sequelize.define(\'Ticket\', {\\n  price: { type: DataTypes.FLOAT, allowNull: false },\\n  status: { type: DataTypes.ENUM(\'available\', \'booked\', \'sold\'), defaultValue: \'available\' }"},"concepts":[{"name":"ticket"},{"name":"sequelize"},{"name":"define"},{"name":"ticket"},{"name":"price"},{"name":"type"},{"name":"data type"},{"name":"float"},{"name":"allow null"},{"name":"status"},{"name":"type"},{"name":"data type"},{"name":"available"},{"name":"booked"},{"name":"sold"},{"name":"default value"},{"name":"available"}],"heuristics":"A0","score":1},{"location":"example/model.js#L25L26","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nCinema.hasMany(Movie)\\nMovie.belongsTo(Cinema)"},"concepts":[{"name":"cinema"},{"name":"many"},{"name":"movie"},{"name":"movie"},{"name":"belongs"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/model.js#L28L29","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nMovie.hasMany(Seat)\\nSeat.belongsTo(Movie)"},"concepts":[{"name":"movie"},{"name":"many"},{"name":"seat"},{"name":"seat"},{"name":"belongs"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/model.js#L31L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nSeat.hasOne(Ticket)\\nTicket.belongsTo(Seat)"},"concepts":[{"name":"seat"},{"name":"one"},{"name":"ticket"},{"name":"ticket"},{"name":"belongs"},{"name":"seat"}],"heuristics":"A0","score":1}]},{"location":"example/router.js","linesOfCode":0,"codeFragments":[{"location":"example/router.js#L1L3","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst express = require(\'express\')\\nconst { Movie, Cinema, Seat, Ticket } = require(\'./models\')\\nconst router = express.Router()"},"concepts":[{"name":"express"},{"name":"express"},{"name":"movie"},{"name":"cinema"},{"name":"seat"},{"name":"ticket"},{"name":"model"},{"name":"router"},{"name":"express"},{"name":"router"}],"heuristics":"A0","score":1},{"location":"example/router.js#L6L8","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/movies\', async (req, res) => {\\n  const movies = await Movie.findAll()\\n  res.json(movies)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"find all"},{"name":"res"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/router.js#L10L12","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/movies\', async (req, res) => {\\n  const movie = await Movie.create(req.body)\\n  res.json(movie)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/router.js#L16L18","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/cinemas\', async (req, res) => {\\n  const cinemas = await Cinema.findAll()\\n  res.json(cinemas)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"find all"},{"name":"res"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/router.js#L20L22","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/cinemas\', async (req, res) => {\\n  const cinema = await Cinema.create(req.body)\\n  res.json(cinema)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/router.js#L26L28","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/seats\', async (req, res) => {\\n  const seats = await Seat.findAll()\\n  res.json(seats)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"find all"},{"name":"res"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/router.js#L30L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/seats\', async (req, res) => {\\n  const seat = await Seat.create(req.body)\\n  res.json(seat)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/router.js#L36L38","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/tickets\', async (req, res) => {\\n  const tickets = await Ticket.findAll()\\n  res.json(tickets)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"find all"},{"name":"res"},{"name":"ticket"}],"heuristics":"A0","score":1},{"location":"example/router.js#L40L42","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/tickets\', async (req, res) => {\\n  const ticket = await Ticket.create(req.body)\\n  res.json(ticket)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"ticket"}],"heuristics":"A0","score":1}]},{"location":"example/server.js","linesOfCode":0,"codeFragments":[{"location":"example/server.js#L1L5","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrequire(\'dotenv\').config()\\nconst express = require(\'express\')\\nconst sequelize = require(\'./config\')\\nconst routes = require(\'./routes\')\\nconst { sequelize: db } = require(\'./models\')"},"concepts":[{"name":"config"},{"name":"express"},{"name":"express"},{"name":"sequelize"},{"name":"config"},{"name":"route"},{"name":"route"},{"name":"sequelize"},{"name":"db"},{"name":"model"}],"heuristics":"A0","score":1},{"location":"example/server.js#L7L9","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst app = express()\\napp.use(express.json())\\napp.use(\'/api\', routes)"},"concepts":[{"name":"app"},{"name":"express"},{"name":"app"},{"name":"use"},{"name":"express"},{"name":"app"},{"name":"use"},{"name":"api"},{"name":"route"}],"heuristics":"A0","score":1},{"location":"example/server.js#L11L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst PORT = process.env.PORT || 3000"},"concepts":[{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1},{"location":"example/server.js#L13L13","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\ndb.sync()"},"concepts":[{"name":"db"}],"heuristics":"A0","score":1},{"location":"example/server.js#L15L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n    console.log(\'Database synced\')\\n    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))"},"concepts":[{"name":"database"},{"name":"synced"},{"name":"app"},{"name":"listen"},{"name":"port"},{"name":"server"},{"name":"running"},{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1}]}]}]}'

    // console.log(JSON.stringify(repository, null, 4))
    expect(JSON.stringify(repository)).toEqual(expectedRepository)
    await clean('StaticAnalyzerNLPTR_iauzd')
  })

  it('sets a repository model instance with out hints', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    await prepare('StaticAnalyzerNLPTR_ablkd', 10)

    // When

    let repository = staticAnalyzerNLPTR.setRepository(
      repositoryList[10],
      'StaticAnalyzerNLPTR_ablkd',
      {
        hints: {
          out: ['dotenv']
        }
      }
    )

    // Then
    let expectedRepository =
      '{"location":"example/","directories":[{"location":"example/","directories":[],"files":[{"location":"example/config.js","linesOfCode":0,"codeFragments":[{"location":"example/config.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { Sequelize } = require(\'sequelize\')\\nrequire(\'dotenv\').config()"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"dotenv"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"example/config.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst sequelize = new Sequelize(process.env.DB_URL, {\\n  dialect: \'postgres\',\\n  logging: false"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"db url"},{"name":"dialect"},{"name":"postgres"},{"name":"logging"}],"heuristics":"A0","score":1}]},{"location":"example/model.js","linesOfCode":0,"codeFragments":[{"location":"example/model.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { DataTypes } = require(\'sequelize\')\\nconst sequelize = require(\'./config\')"},"concepts":[{"name":"data type"},{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"example/model.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Movie = sequelize.define(\'Movie\', {\\n  title: { type: DataTypes.STRING, allowNull: false },\\n  duration: { type: DataTypes.INTEGER, allowNull: false }                    "},"concepts":[{"name":"movie"},{"name":"sequelize"},{"name":"define"},{"name":"movie"},{"name":"title"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"duration"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/model.js#L9L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Cinema = sequelize.define(\'Cinema\', {\\n  name: { type: DataTypes.STRING, allowNull: false },\\n  location: { type: DataTypes.STRING, allowNull: false }"},"concepts":[{"name":"cinema"},{"name":"sequelize"},{"name":"define"},{"name":"cinema"},{"name":"name"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"location"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/model.js#L14L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Seat = sequelize.define(\'Seat\', {\\n  row: { type: DataTypes.STRING, allowNull: false },\\n  number: { type: DataTypes.INTEGER, allowNull: false }"},"concepts":[{"name":"seat"},{"name":"sequelize"},{"name":"define"},{"name":"seat"},{"name":"row"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/model.js#L19L21","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Ticket = sequelize.define(\'Ticket\', {\\n  price: { type: DataTypes.FLOAT, allowNull: false },\\n  status: { type: DataTypes.ENUM(\'available\', \'booked\', \'sold\'), defaultValue: \'available\' }"},"concepts":[{"name":"ticket"},{"name":"sequelize"},{"name":"define"},{"name":"ticket"},{"name":"price"},{"name":"type"},{"name":"data type"},{"name":"float"},{"name":"allow null"},{"name":"status"},{"name":"type"},{"name":"data type"},{"name":"available"},{"name":"booked"},{"name":"sold"},{"name":"default value"},{"name":"available"}],"heuristics":"A0","score":1},{"location":"example/model.js#L25L26","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nCinema.hasMany(Movie)\\nMovie.belongsTo(Cinema)"},"concepts":[{"name":"cinema"},{"name":"many"},{"name":"movie"},{"name":"movie"},{"name":"belongs"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/model.js#L28L29","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nMovie.hasMany(Seat)\\nSeat.belongsTo(Movie)"},"concepts":[{"name":"movie"},{"name":"many"},{"name":"seat"},{"name":"seat"},{"name":"belongs"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/model.js#L31L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nSeat.hasOne(Ticket)\\nTicket.belongsTo(Seat)"},"concepts":[{"name":"seat"},{"name":"one"},{"name":"ticket"},{"name":"ticket"},{"name":"belongs"},{"name":"seat"}],"heuristics":"A0","score":1}]},{"location":"example/router.js","linesOfCode":0,"codeFragments":[{"location":"example/router.js#L1L3","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst express = require(\'express\')\\nconst { Movie, Cinema, Seat, Ticket } = require(\'./models\')\\nconst router = express.Router()"},"concepts":[{"name":"express"},{"name":"express"},{"name":"movie"},{"name":"cinema"},{"name":"seat"},{"name":"ticket"},{"name":"model"},{"name":"router"},{"name":"express"},{"name":"router"}],"heuristics":"A0","score":1},{"location":"example/router.js#L6L8","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/movies\', async (req, res) => {\\n  const movies = await Movie.findAll()\\n  res.json(movies)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"find all"},{"name":"res"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/router.js#L10L12","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/movies\', async (req, res) => {\\n  const movie = await Movie.create(req.body)\\n  res.json(movie)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/router.js#L16L18","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/cinemas\', async (req, res) => {\\n  const cinemas = await Cinema.findAll()\\n  res.json(cinemas)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"find all"},{"name":"res"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/router.js#L20L22","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/cinemas\', async (req, res) => {\\n  const cinema = await Cinema.create(req.body)\\n  res.json(cinema)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/router.js#L26L28","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/seats\', async (req, res) => {\\n  const seats = await Seat.findAll()\\n  res.json(seats)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"find all"},{"name":"res"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/router.js#L30L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/seats\', async (req, res) => {\\n  const seat = await Seat.create(req.body)\\n  res.json(seat)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/router.js#L36L38","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/tickets\', async (req, res) => {\\n  const tickets = await Ticket.findAll()\\n  res.json(tickets)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"find all"},{"name":"res"},{"name":"ticket"}],"heuristics":"A0","score":1},{"location":"example/router.js#L40L42","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/tickets\', async (req, res) => {\\n  const ticket = await Ticket.create(req.body)\\n  res.json(ticket)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"ticket"}],"heuristics":"A0","score":1}]},{"location":"example/server.js","linesOfCode":0,"codeFragments":[{"location":"example/server.js#L1L5","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrequire(\'dotenv\').config()\\nconst express = require(\'express\')\\nconst sequelize = require(\'./config\')\\nconst routes = require(\'./routes\')\\nconst { sequelize: db } = require(\'./models\')"},"concepts":[{"name":"dotenv"},{"name":"config"},{"name":"express"},{"name":"express"},{"name":"sequelize"},{"name":"config"},{"name":"route"},{"name":"route"},{"name":"sequelize"},{"name":"db"},{"name":"model"}],"heuristics":"A0","score":1},{"location":"example/server.js#L7L9","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst app = express()\\napp.use(express.json())\\napp.use(\'/api\', routes)"},"concepts":[{"name":"app"},{"name":"express"},{"name":"app"},{"name":"use"},{"name":"express"},{"name":"app"},{"name":"use"},{"name":"api"},{"name":"route"}],"heuristics":"A0","score":1},{"location":"example/server.js#L11L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst PORT = process.env.PORT || 3000"},"concepts":[{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1},{"location":"example/server.js#L13L13","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\ndb.sync()"},"concepts":[{"name":"db"}],"heuristics":"A0","score":1},{"location":"example/server.js#L15L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n    console.log(\'Database synced\')\\n    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))"},"concepts":[{"name":"database"},{"name":"synced"},{"name":"app"},{"name":"listen"},{"name":"port"},{"name":"server"},{"name":"running"},{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1}]}]}]}'

    // console.log(JSON.stringify(repository, null, 4))

    expect(JSON.stringify(repository)).toEqual(expectedRepository)
    await clean('StaticAnalyzerNLPTR_ablkd')
  })

  it('sets a repository model instance with in and out hints', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    await prepare('StaticAnalyzerNLPTR_dddsm', 11)

    // When

    let repository = staticAnalyzerNLPTR.setRepository(
      repositoryList[11],
      'StaticAnalyzerNLPTR_dddsm',
      {
        hints: {
          out: ['dotenv'],
          in: ['export']
        }
      }
    )

    // Then
    let expectedRepository =
      '{"location":"example/","directories":[{"location":"example/","directories":[],"files":[{"location":"example/config.js","linesOfCode":0,"codeFragments":[{"location":"example/config.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { Sequelize } = require(\'sequelize\')\\nrequire(\'dotenv\').config()"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"dotenv"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"example/config.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst sequelize = new Sequelize(process.env.DB_URL, {\\n  dialect: \'postgres\',\\n  logging: false"},"concepts":[{"name":"sequelize"},{"name":"sequelize"},{"name":"db url"},{"name":"dialect"},{"name":"postgres"},{"name":"logging"}],"heuristics":"A0","score":1}]},{"location":"example/model.js","linesOfCode":0,"codeFragments":[{"location":"example/model.js#L1L2","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst { DataTypes } = require(\'sequelize\')\\nconst sequelize = require(\'./config\')"},"concepts":[{"name":"data type"},{"name":"sequelize"},{"name":"sequelize"},{"name":"config"}],"heuristics":"A0","score":1},{"location":"example/model.js#L4L6","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Movie = sequelize.define(\'Movie\', {\\n  title: { type: DataTypes.STRING, allowNull: false },\\n  duration: { type: DataTypes.INTEGER, allowNull: false }                    "},"concepts":[{"name":"movie"},{"name":"sequelize"},{"name":"define"},{"name":"movie"},{"name":"title"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"duration"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/model.js#L9L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Cinema = sequelize.define(\'Cinema\', {\\n  name: { type: DataTypes.STRING, allowNull: false },\\n  location: { type: DataTypes.STRING, allowNull: false }"},"concepts":[{"name":"cinema"},{"name":"sequelize"},{"name":"define"},{"name":"cinema"},{"name":"name"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"location"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/model.js#L14L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Seat = sequelize.define(\'Seat\', {\\n  row: { type: DataTypes.STRING, allowNull: false },\\n  number: { type: DataTypes.INTEGER, allowNull: false }"},"concepts":[{"name":"seat"},{"name":"sequelize"},{"name":"define"},{"name":"seat"},{"name":"row"},{"name":"type"},{"name":"data type"},{"name":"allow null"},{"name":"type"},{"name":"data type"},{"name":"allow null"}],"heuristics":"A0","score":1},{"location":"example/model.js#L19L21","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst Ticket = sequelize.define(\'Ticket\', {\\n  price: { type: DataTypes.FLOAT, allowNull: false },\\n  status: { type: DataTypes.ENUM(\'available\', \'booked\', \'sold\'), defaultValue: \'available\' }"},"concepts":[{"name":"ticket"},{"name":"sequelize"},{"name":"define"},{"name":"ticket"},{"name":"price"},{"name":"type"},{"name":"data type"},{"name":"float"},{"name":"allow null"},{"name":"status"},{"name":"type"},{"name":"data type"},{"name":"available"},{"name":"booked"},{"name":"sold"},{"name":"default value"},{"name":"available"}],"heuristics":"A0","score":1},{"location":"example/model.js#L25L26","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nCinema.hasMany(Movie)\\nMovie.belongsTo(Cinema)"},"concepts":[{"name":"cinema"},{"name":"many"},{"name":"movie"},{"name":"movie"},{"name":"belongs"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/model.js#L28L29","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nMovie.hasMany(Seat)\\nSeat.belongsTo(Movie)"},"concepts":[{"name":"movie"},{"name":"many"},{"name":"seat"},{"name":"seat"},{"name":"belongs"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/model.js#L31L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nSeat.hasOne(Ticket)\\nTicket.belongsTo(Seat)"},"concepts":[{"name":"seat"},{"name":"one"},{"name":"ticket"},{"name":"ticket"},{"name":"belongs"},{"name":"seat"}],"heuristics":"A0","score":1}]},{"location":"example/router.js","linesOfCode":0,"codeFragments":[{"location":"example/router.js#L1L3","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst express = require(\'express\')\\nconst { Movie, Cinema, Seat, Ticket } = require(\'./models\')\\nconst router = express.Router()"},"concepts":[{"name":"express"},{"name":"express"},{"name":"movie"},{"name":"cinema"},{"name":"seat"},{"name":"ticket"},{"name":"model"},{"name":"router"},{"name":"express"},{"name":"router"}],"heuristics":"A0","score":1},{"location":"example/router.js#L6L8","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/movies\', async (req, res) => {\\n  const movies = await Movie.findAll()\\n  res.json(movies)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"find all"},{"name":"res"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/router.js#L10L12","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/movies\', async (req, res) => {\\n  const movie = await Movie.create(req.body)\\n  res.json(movie)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"movie"},{"name":"req"},{"name":"res"},{"name":"movie"},{"name":"movie"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"movie"}],"heuristics":"A0","score":1},{"location":"example/router.js#L16L18","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/cinemas\', async (req, res) => {\\n  const cinemas = await Cinema.findAll()\\n  res.json(cinemas)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"find all"},{"name":"res"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/router.js#L20L22","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/cinemas\', async (req, res) => {\\n  const cinema = await Cinema.create(req.body)\\n  res.json(cinema)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"cinema"},{"name":"req"},{"name":"res"},{"name":"cinema"},{"name":"cinema"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"cinema"}],"heuristics":"A0","score":1},{"location":"example/router.js#L26L28","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/seats\', async (req, res) => {\\n  const seats = await Seat.findAll()\\n  res.json(seats)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"find all"},{"name":"res"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/router.js#L30L32","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/seats\', async (req, res) => {\\n  const seat = await Seat.create(req.body)\\n  res.json(seat)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"seat"},{"name":"req"},{"name":"res"},{"name":"seat"},{"name":"seat"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"seat"}],"heuristics":"A0","score":1},{"location":"example/router.js#L36L38","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.get(\'/tickets\', async (req, res) => {\\n  const tickets = await Ticket.findAll()\\n  res.json(tickets)"},"concepts":[{"name":"router"},{"name":"get"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"find all"},{"name":"res"},{"name":"ticket"}],"heuristics":"A0","score":1},{"location":"example/router.js#L40L42","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrouter.post(\'/tickets\', async (req, res) => {\\n  const ticket = await Ticket.create(req.body)\\n  res.json(ticket)"},"concepts":[{"name":"router"},{"name":"post"},{"name":"ticket"},{"name":"req"},{"name":"res"},{"name":"ticket"},{"name":"ticket"},{"name":"req"},{"name":"body"},{"name":"res"},{"name":"ticket"}],"heuristics":"A0","score":1}]},{"location":"example/server.js","linesOfCode":0,"codeFragments":[{"location":"example/server.js#L1L5","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nrequire(\'dotenv\').config()\\nconst express = require(\'express\')\\nconst sequelize = require(\'./config\')\\nconst routes = require(\'./routes\')\\nconst { sequelize: db } = require(\'./models\')"},"concepts":[{"name":"dotenv"},{"name":"config"},{"name":"express"},{"name":"express"},{"name":"sequelize"},{"name":"config"},{"name":"route"},{"name":"route"},{"name":"sequelize"},{"name":"db"},{"name":"model"}],"heuristics":"A0","score":1},{"location":"example/server.js#L7L9","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst app = express()\\napp.use(express.json())\\napp.use(\'/api\', routes)"},"concepts":[{"name":"app"},{"name":"express"},{"name":"app"},{"name":"use"},{"name":"express"},{"name":"app"},{"name":"use"},{"name":"api"},{"name":"route"}],"heuristics":"A0","score":1},{"location":"example/server.js#L11L11","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\nconst PORT = process.env.PORT || 3000"},"concepts":[{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1},{"location":"example/server.js#L13L13","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\ndb.sync()"},"concepts":[{"name":"db"}],"heuristics":"A0","score":1},{"location":"example/server.js#L15L16","technology":{"id":"javascript-any-any-any"},"operation":{"name":"?"},"method":{"name":"?"},"sample":{"content":"\\n    console.log(\'Database synced\')\\n    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))"},"concepts":[{"name":"database"},{"name":"synced"},{"name":"app"},{"name":"listen"},{"name":"port"},{"name":"server"},{"name":"running"},{"name":"port"},{"name":"port"}],"heuristics":"A0","score":1}]}]}]}'

    // console.log(JSON.stringify(repository, null, 4))

    expect(JSON.stringify(repository)).toEqual(expectedRepository)
    await clean('StaticAnalyzerNLPTR_dddsm')
  })

  it('gets a repository folder from its name', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When

    let repositoryFolder = staticAnalyzerNLPTR.getRepositoryFolder(
      'example',
      'StaticAnalyzerNLPTR_dpanc'
    )

    // Then

    expect(repositoryFolder).toContain(path.join(tempPath, 'StaticAnalyzerNLPTR_dpanc', 'example'))
  })

  it('returns the correct file extension', () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    expect(staticAnalyzerNLPTR.getFileExtension('file.js')).toBe('js')
    expect(staticAnalyzerNLPTR.getFileExtension('file.java')).toBe('java')
    expect(staticAnalyzerNLPTR.getFileExtension('file.txt')).toBe('txt')
  })

  it('returns an empty string if there is no extension', () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    expect(staticAnalyzerNLPTR.getFileExtension('file')).toBe('')
  })

  it('returns the correct file extension when the file path is undefined', () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    expect(staticAnalyzerNLPTR.getFileExtension(undefined)).toBe('')
  })
})

// Failure cases test suite

describe('NLP TR static analyzer tries to', () => {
  it('initialize a NLP TR static analysis by not found repository', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = new Repository('unknown', [])

    // When Then

    await expect(
      staticAnalyzerNLPTR.initializesByRepository(repository, 'StaticAnalyzerNLPTR_kvbhg', options)
    ).rejects.toThrow(AnalysisFail)
  })

  it('initialize a NLP TR static analysis by undefined repository', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = undefined

    // When Then

    await expect(
      staticAnalyzerNLPTR.initializesByRepository(repository, 'StaticAnalyzerNLPTR_wfgte', options)
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a NLP TR static analysis by null repository', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = null

    // When Then

    await expect(
      staticAnalyzerNLPTR.initializesByRepository(repository, 'StaticAnalyzerNLPTR_wdsdc', options)
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a NLP TR static analysis by wrongly typed repository', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = {}

    // When Then

    await expect(
      staticAnalyzerNLPTR.initializesByRepository(repository, 'StaticAnalyzerNLPTR_sdokk', options)
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a NLP TR static analysis by repository with an undefined destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerNLPTR.initializesByRepository(repository, undefined, options)
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a NLP TR static analysis by repository with a null destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerNLPTR.initializesByRepository(repository, null, options)
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a NLP TR static analysis by repository with an empty destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerNLPTR.initializesByRepository(repository, '', options)
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a NLP TR static analysis by repository with an unknown destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerNLPTR.initializesByRepository(repository, 'unknown', options)
    ).rejects.toThrow(AnalysisFail)
  })

  it('initialize a NLP TR static analysis by repository with undefined options', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerNLPTR.initializesByRepository(
        repository,
        'StaticAnalyzerNLPTR_pnjyg',
        undefined
      )
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a NLP TR static analysis by repository with null options', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerNLPTR.initializesByRepository(repository, 'StaticAnalyzerNLPTR_crhqm', null)
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a NLP TR static analysis by repository list with not found repositories', async () => {
    // Given

    let repositoryListUnknown = [new Repository('unknown', [])]
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.initializesByRepositories(
        repositoryListUnknown,
        'StaticAnalyzerNLPTR_pawpg',
        options
      )
    ).rejects.toThrow(AnalysisFail)
  })

  it('initialize a NLP TR static analysis by undefined repository list', async () => {
    // Given

    let repositoryListUndefined = undefined
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.initializesByRepositories(
        repositoryListUndefined,
        'StaticAnalyzerNLPTR_dcvvv',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a NLP TR static analysis by null repository list', async () => {
    // Given

    let repositoryListNull = null
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.initializesByRepositories(
        repositoryListNull,
        'StaticAnalyzerNLPTR_bcdzd',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a NLP TR static analysis by repository list with undefined repositories', async () => {
    // Given

    let repositoryListUndefined = [undefined]
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.initializesByRepositories(
        repositoryListUndefined,
        'StaticAnalyzerNLPTR_nvhgd',
        options
      )
    ).rejects.toThrow(AnalysisFail)
  })

  it('initialize a NLP TR static analysis by repository list with null repositories', async () => {
    // Given

    let repositoryListNull = [null]
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.initializesByRepositories(
        repositoryListNull,
        'StaticAnalyzerNLPTR_nadaz',
        options
      )
    ).rejects.toThrow(AnalysisFail)
  })

  it('initialize a NLP TR static analysis by empty repository list', async () => {
    // Given

    let repositoryListEmpty = []
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.initializesByRepositories(
        repositoryListEmpty,
        'StaticAnalyzerNLPTR_hjuyg',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a NLP TR static analysis by repository list with an undefined destination ', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.initializesByRepositories(repositoryList, undefined, options)
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a NLP TR static analysis by repository list with a null destination ', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.initializesByRepositories(repositoryList, null, options)
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a NLP TR static analysis by repository list with an empty destination ', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.initializesByRepositories(repositoryList, '', options)
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a NLP TR static analysis by repository list with an unknown destination ', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.initializesByRepositories(repositoryList, 'unknown', options)
    ).rejects.toThrow(AnalysisFail)
  })

  it('initialize a NLP TR static analysis by repository list with undefined options', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.initializesByRepositories(
        repositoryList,
        'StaticAnalyzerNLPTR_bvapm',
        undefined
      )
    ).rejects.toThrow(BadFormat)
  })

  it('initialize a NLP TR static analysis by repository list with null options', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.initializesByRepositories(
        repositoryList,
        'StaticAnalyzerNLPTR_cnhgs',
        null
      )
    ).rejects.toThrow(BadFormat)
  })

  it('identify a NLP TR static analysis by not found repository', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = new Repository('unknown', [])

    // When Then

    await expect(
      staticAnalyzerNLPTR.identifyByRepository(repository, 'StaticAnalyzerNLPTR_ammmk', options)
    ).rejects.toThrow(AnalysisFail)
  })

  it('identify a NLP TR static analysis by undefined repository', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = undefined

    // When Then

    await expect(
      staticAnalyzerNLPTR.identifyByRepository(repository, 'StaticAnalyzerNLPTR_sqwxd', options)
    ).rejects.toThrow(BadFormat)
  })

  it('identify a NLP TR static analysis by null repository', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = null

    // When Then

    await expect(
      staticAnalyzerNLPTR.identifyByRepository(repository, 'StaticAnalyzerNLPTR_llkoi', options)
    ).rejects.toThrow(BadFormat)
  })

  it('identify a NLP TR static analysis by a wrongly typed repository', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = {}

    // When Then

    await expect(
      staticAnalyzerNLPTR.identifyByRepository(repository, 'StaticAnalyzerNLPTR_tyfyi', options)
    ).rejects.toThrow(BadFormat)
  })

  it('identify a NLP TR static analysis by repository with an undefined destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerNLPTR.identifyByRepository(repository, undefined, options)
    ).rejects.toThrow(BadFormat)
  })

  it('identify a NLP TR static analysis by repository with a null destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerNLPTR.identifyByRepository(repository, null, options)
    ).rejects.toThrow(BadFormat)
  })

  it('identify a NLP TR static analysis by repository with an empty destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = repositoryList[0]

    // When Then

    await expect(staticAnalyzerNLPTR.identifyByRepository(repository, '', options)).rejects.toThrow(
      BadFormat
    )
  })

  it('identify a NLP TR static analysis by repository with an unknown destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerNLPTR.identifyByRepository(repository, 'unknown', options)
    ).rejects.toThrow(AnalysisFail)
  })

  it('identify a NLP TR static analysis by repository with undefined options', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerNLPTR.identifyByRepository(repository, 'StaticAnalyzerNLPTR_jqshf', undefined)
    ).rejects.toThrow(BadFormat)
  })

  it('identify a NLP TR static analysis by repository with null options', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerNLPTR.identifyByRepository(repository, 'StaticAnalyzerNLPTR_jdsqsd', null)
    ).rejects.toThrow(BadFormat)
  })

  it('identify a NLP TR static analysis by repository list with not found repositories', async () => {
    // Given

    let repositoryListUnknown = [new Repository('unknown', [])]
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.identifyByRepositories(
        repositoryListUnknown,
        'StaticAnalyzerNLPTR_pppmd',
        options
      )
    ).rejects.toThrow(AnalysisFail)
  })

  it('identify a NLP TR static analysis by undefined repository list', async () => {
    // Given

    let repositoryListUndefined = undefined
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.identifyByRepositories(
        repositoryListUndefined,
        'StaticAnalyzerNLPTR_mdyek',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('identify a NLP TR static analysis by null repository list', async () => {
    // Given

    let repositoryListNull = null
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.identifyByRepositories(
        repositoryListNull,
        'StaticAnalyzerNLPTR_mmlre',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('identify a NLP TR static analysis by repository list with undefined repositories', async () => {
    // Given

    let repositoryListUndefined = [undefined]
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.identifyByRepositories(
        repositoryListUndefined,
        'StaticAnalyzerNLPTR_mmylr',
        options
      )
    ).rejects.toThrow(AnalysisFail)
  })

  it('identify a NLP TR static analysis by repository list with null repositories', async () => {
    // Given

    let repositoryListNull = [null]
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.identifyByRepositories(
        repositoryListNull,

        'StaticAnalyzerNLPTR_wqylr',
        options
      )
    ).rejects.toThrow(AnalysisFail)
  })

  it('identify a NLP TR static analysis by empty repository list', async () => {
    // Given

    let repositoryListEmpty = []
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.identifyByRepositories(
        repositoryListEmpty,

        'StaticAnalyzerNLPTR_mymlr',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('identify a NLP TR static analysis by repository list with an undefined destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.identifyByRepositories(repositoryList, undefined, options)
    ).rejects.toThrow(BadFormat)
  })

  it('identify a NLP TR static analysis by repository list with a null destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.identifyByRepositories(repositoryList, null, options)
    ).rejects.toThrow(BadFormat)
  })

  it('identify a NLP TR static analysis by repository list with an empty destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.identifyByRepositories(repositoryList, '', options)
    ).rejects.toThrow(BadFormat)
  })

  it('identify a NLP TR static analysis by repository list with an unknown destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.identifyByRepositories(repositoryList, 'unknown', options)
    ).rejects.toThrow(AnalysisFail)
  })

  it('identify a NLP TR static analysis by null repository with undefined options', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerNLPTR.identifyByRepository(repository, 'StaticAnalyzerNLPTR_yxdss', undefined)
    ).rejects.toThrow(BadFormat)
  })

  it('identify a NLP TR static analysis by null repository with null options', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerNLPTR.identifyByRepository(repository, 'StaticAnalyzerNLPTR_aoizd', null)
    ).rejects.toThrow(BadFormat)
  })

  it('extract a NLP TR static analysis by not found repository', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = new Repository('unknown', [])

    // When Then

    await expect(
      staticAnalyzerNLPTR.extractByRepository(repository, 'StaticAnalyzerNLPTR_vgfry', options)
    ).rejects.toThrow(AnalysisFail)
  })

  it('extract a NLP TR static analysis by undefined repository', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = undefined

    // When Then

    await expect(
      staticAnalyzerNLPTR.extractByRepository(repository, 'StaticAnalyzerNLPTR_huded', options)
    ).rejects.toThrow(BadFormat)
  })

  it('extract a NLP TR static analysis by null repository', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = null

    // When Then

    await expect(
      staticAnalyzerNLPTR.extractByRepository(repository, 'StaticAnalyzerNLPTR_dccvd', options)
    ).rejects.toThrow(BadFormat)
  })

  it('extract a NLP TR static analysis by a wrongly typed repository', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = {}

    // When Then

    await expect(
      staticAnalyzerNLPTR.extractByRepository(repository, 'StaticAnalyzerNLPTR_dvdcd', options)
    ).rejects.toThrow(BadFormat)
  })

  it('extract a NLP TR static analysis by repository with an undefined destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = {}

    // When Then

    await expect(
      staticAnalyzerNLPTR.extractByRepository(repository, undefined, options)
    ).rejects.toThrow(BadFormat)
  })

  it('extract a NLP TR static analysis by repository with a null destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = {}

    // When Then

    await expect(
      staticAnalyzerNLPTR.extractByRepository(repository, null, options)
    ).rejects.toThrow(BadFormat)
  })

  it('extract a NLP TR static analysis by repository with an empty destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = {}

    // When Then

    await expect(staticAnalyzerNLPTR.extractByRepository(repository, '', options)).rejects.toThrow(
      BadFormat
    )
  })

  it('extract a NLP TR static analysis by repository with an unknown destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerNLPTR.extractByRepository(repository, 'unknown', options)
    ).rejects.toThrow(AnalysisFail)
  })

  it('extract a NLP TR static analysis by repository with undefined options', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerNLPTR.extractByRepository(repository, 'StaticAnalyzerNLPTR_ddssd', undefined)
    ).rejects.toThrow(BadFormat)
  })

  it('extract a NLP TR static analysis by repository with null options', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()
    let repository = repositoryList[0]

    // When Then

    await expect(
      staticAnalyzerNLPTR.extractByRepository(repository, 'StaticAnalyzerNLPTR_atyyt', null)
    ).rejects.toThrow(BadFormat)
  })

  it('extract a NLP TR static analysis by repository list with not found repositories', async () => {
    // Given

    let repositoryListUnknown = [new Repository('unknown', [])]
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.extractByRepositories(
        repositoryListUnknown,
        'StaticAnalyzerNLPTR_paddf',
        options
      )
    ).rejects.toThrow(AnalysisFail)
  })

  it('extract a NLP TR static analysis by undefined repository list', async () => {
    // Given

    let repositoryListUndefined = undefined
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.extractByRepositories(
        repositoryListUndefined,
        'StaticAnalyzerNLPTR_pjhgf',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('extract a NLP TR static analysis by null repository list', async () => {
    // Given

    let repositoryListNull = null
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.extractByRepositories(
        repositoryListNull,
        'StaticAnalyzerNLPTR_ppnkj',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('extract a NLP TR static analysis by repository list with undefined repositories', async () => {
    // Given

    let repositoryListUndefined = [undefined]
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.extractByRepositories(
        repositoryListUndefined,
        'StaticAnalyzerNLPTR_pahgf',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('extract a NLP TR static analysis by repository list with null repositories', async () => {
    // Given

    let repositoryListNull = [null]
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.extractByRepositories(
        repositoryListNull,
        'StaticAnalyzerNLPTR_icfds',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('extract a NLP TR static analysis by empty repository list', async () => {
    // Given

    let repositoryListEmpty = []
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.extractByRepositories(
        repositoryListEmpty,
        'StaticAnalyzerNLPTR_plgds',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('extract a NLP TR static analysis by repository list with undefined destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.extractByRepositories(repositoryList, undefined, options)
    ).rejects.toThrow(BadFormat)
  })

  it('extract a NLP TR static analysis by repository list with null destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.extractByRepositories(repositoryList, null, options)
    ).rejects.toThrow(BadFormat)
  })

  it('extract a NLP TR static analysis by repository list with an empty destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.extractByRepositories(repositoryList, '', options)
    ).rejects.toThrow(BadFormat)
  })

  it('extract a NLP TR static analysis by repository list with an unknown destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.extractByRepositories(repositoryList, 'unknown', options)
    ).rejects.toThrow(AnalysisFail)
  })

  it('extract a NLP TR static analysis by repository list with undefined options', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.extractByRepositories(
        repositoryList,
        'StaticAnalyzerNLPTR_wqcfs',
        undefined
      )
    ).rejects.toThrow(BadFormat)
  })

  it('extract a NLP TR static analysis by repository list with null options', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.extractByRepositories(repositoryList, 'StaticAnalyzerNLPTR_kolde', null)
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a NLP TR static analysis by undefined repository list', async () => {
    // Given

    let repositoryListUndefined = undefined
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.interpretByRepositories(
        repositoryListUndefined,
        'StaticAnalyzerNLPTR_cdfqa',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a NLP TR static analysis by null repository list', async () => {
    // Given

    let repositoryListNull = null
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.interpretByRepositories(
        repositoryListNull,
        'StaticAnalyzerNLPTR_ighsa',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a NLP TR static analysis by empty repository list', async () => {
    // Given

    let repositoryListEmpty = []
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.interpretByRepositories(
        repositoryListEmpty,
        'StaticAnalyzerNLPTR_mawdk',
        options
      )
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a NLP TR static analysis by repository list with an undefined destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.interpretByRepositories(repositoryList, undefined, options)
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a NLP TR static analysis by repository list with a null destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.interpretByRepositories(repositoryList, null, options)
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a NLP TR static analysis by repository list with an empty destination', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.interpretByRepositories(repositoryList, '', options)
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a NLP TR static analysis by repository list with undefined options', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.interpretByRepositories(
        repositoryList,
        'StaticAnalyzerNLPTR_knbde',
        undefined
      )
    ).rejects.toThrow(BadFormat)
  })

  it('interpret a NLP TR static analysis by repository list with null options', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    await expect(
      staticAnalyzerNLPTR.interpretByRepositories(repositoryList, 'StaticAnalyzerNLPTR_kvbzz', null)
    ).rejects.toThrow(BadFormat)
  })

  it('set a repository model instance with an undefined repository', async () => {
    // Given

    // When Then
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // Then
    expect(() => {
      staticAnalyzerNLPTR.setRepository(undefined, 'StaticAnalyzerNLPTR_bcsgf', options)
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with a null repository', async () => {
    // Given

    // When Then
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // Then
    expect(() => {
      staticAnalyzerNLPTR.setRepository(null, 'StaticAnalyzerNLPTR_dscgg', options)
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with an undefined destination directory', async () => {
    // Given

    // When Then
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // Then
    expect(() => {
      staticAnalyzerNLPTR.setRepository(repositoryList[0], undefined, options)
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with a null destination directory', async () => {
    // Given

    // When Then
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // Then
    expect(() => {
      staticAnalyzerNLPTR.setRepository(repositoryList[0], null, options)
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with an empty destination directory path', async () => {
    // Given

    // When Then
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // Then
    expect(() => {
      staticAnalyzerNLPTR.setRepository(repositoryList[0], '', options)
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with a unknown destination directory', async () => {
    // Given

    // When Then
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // Then
    expect(() => {
      staticAnalyzerNLPTR.setRepository(repositoryList[0], 'unknown', options)
    }).toThrow(AnalysisFail)
  })

  it('set a repository model instance with undefined options', async () => {
    // Given

    // When Then
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // Then
    expect(() => {
      staticAnalyzerNLPTR.setRepository(repositoryList[0], 'StaticAnalyzerNLPTR_bhdsf', undefined)
    }).toThrow(BadFormat)
  })

  it('set a repository model instance with null options', async () => {
    // Given

    // When Then
    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // Then
    expect(() => {
      staticAnalyzerNLPTR.setRepository(repositoryList[0], 'StaticAnalyzerNLPTR_kbkjh', null)
    }).toThrow(BadFormat)
  })

  it('get a repository folder from a null name', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    expect(() => {
      staticAnalyzerNLPTR.getRepositoryFolder(null, 'StaticAnalyzerNLPTR_pmanfe')
    }).toThrow(BadFormat)
  })

  it('get a repository folder from a undefined name', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    expect(() => {
      staticAnalyzerNLPTR.getRepositoryFolder(undefined, 'StaticAnalyzerNLPTR_nfhze')
    }).toThrow(BadFormat)
  })

  it('get a repository folder from an empty name', async () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    expect(() => {
      staticAnalyzerNLPTR.getRepositoryFolder('', 'StaticAnalyzerNLPTR_vbaed')
    }).toThrow(BadFormat)
  })

  it('return a file extension when the file path is null', () => {
    // Given

    let staticAnalyzerNLPTR = new StaticAnalyzerNLPTR()

    // When Then

    expect(() => {
      staticAnalyzerNLPTR.getFileExtension(null)
    }).toThrow(BadFormat)
  })
})
