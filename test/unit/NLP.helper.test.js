// Helpers

const NLP = require('../../helper/NLP.helper')

// Setup

const codeExampleJavascript = `
// This is a starting one-line comment
const db = require("./database");
let db = new Database(
  'db://' + process.env.DATABASE_HOST + ':' + process.env.DATABASE_PORT
) // This is an ending one-line comment
/* This is a online multi-line comment */
/* This
is
a
starting
multiline
comment
*/
function fetchUsers(userId) { 
    return db.query(\`SELECT * FROM users WHERE user_id = \${userId}\`);
} /* This
is
an
ending
multiline comment */
    // Indented comment
class userService {
    createUser(user) {
        console.log("Creating user:", user);
        return db.insert("users", user);
    }
}
// Comment 1
// Comment 2

// Comment //

    /// /// /// Hey

  // Comment
  // Comment
  
  // Comment
module.exports = { fetchUsers, userService };
`
const codeExampleJava = `
// This is a starting one-line comment
/* This is a online multi-line comment */
/* This
is
a
starting
multiline
comment
*/
import com.mongodb.client.*;  // This is an ending one-line comment
import com.mongodb.client.model.Filters;
import org.bson.Document;
import org.bson.types.ObjectId;
import redis.clients.jedis.Jedis;

import static spark.Spark.*;
        // Indented comment
public class ReportProjectUserApi {
    private static final String MONGO_URI = "mongodb://" + System.getenv("MONGO_DATABASE_HOST") + ":" + System.getenv("MONGO_DATABASE_PORT");
    private static final MongoClient mongoClient = MongoClients.create(MONGO_URI);
    private static final Jedis redisClient = new Jedis(System.getenv("REDIS_DATABASE_HOST"), Integer.parseInt(System.getenv("REDIS_DATABASE_PORT")));

    public static void main(String[] args) {
        port(4000);

        get("/reports", (req, res) -> {
            MongoDatabase db = mongoClient.getDatabase("reporting");
            MongoCollection<Document> collection = db.getCollection("reports");
            return collection.find().into(new java.util.ArrayList<>());
        }, new JsonTransformer());

        get("/projects/:project_id", (req, res) -> {
            String projectId = req.params("project_id");
            if (!ObjectId.isValid(projectId)) {
                res.status(400);
                return new Document("error", "Invalid project ID");
            }
            MongoDatabase db = mongoClient.getDatabase("reporting");
            MongoCollection<Document> collection = db.getCollection("projects");
            Document project = collection.find(Filters.eq("_id", new ObjectId(projectId))).first();
            if (project == null) {
                res.status(404);
                return new Document("error", "Project not found");
            }
            return project;
        }, new JsonTransformer());

        post("/users", (req, res) -> {
            MongoDatabase db = mongoClient.getDatabase("reporting");
            MongoCollection<Document> collection = db.getCollection("users");
            Document user = Document.parse(req.body());
            collection.insertOne(user);
            res.status(201);
            return user;
        }, new JsonTransformer());

        post("/reports", (req, res) -> {
            String reportCount = redisClient.get("report_count");
            int newCount = (reportCount == null) ? 1 : Integer.parseInt(reportCount) + 1;
            redisClient.set("report_count", String.valueOf(newCount));

            MongoDatabase db = mongoClient.getDatabase("reporting");
            MongoCollection<Document> collection = db.getCollection("reports");
            Document report = Document.parse(req.body());
            collection.insertOne(report);
            res.status(201);
            return report;
        }, new JsonTransformer());
    } /* This
is
an
ending
multiline comment */

// Comment 1
// Comment 2

// Comment //

    /// /// /// Hey

  // Comment
  // Comment
  
  // Comment
}
`

// Happy path test suite

describe('NLP', () => {
  it('extracts concepts from a raw file', async () => {
    // Given

    let nlpHelper = new NLP()

    // When

    let concepts = nlpHelper.extractConcepts(
      'room ' +
        'messages ' +
        'message ' +
        'project ' +
        'thread ' +
        'edit ' +
        'resolve ' +
        'reopen ' +
        'status ' +
        'compile ' +
        'stop ' +
        'user ' +
        'content ' +
        'contacts ' +
        'doc-deleted ' +
        'unarchive ' +
        'destroy ' +
        'raw peek ' +
        'health_check ' +
        'get_and_flush_if_old ' +
        'flush ' +
        'change ' +
        'accept ' +
        'flush_all_projects ' +
        'flush_queued_projects ' +
        'redis ' +
        'redis_cluster ' +
        'booking ' +
        'verify ' +
        'comment ' +
        'total ' +
        'build ' +
        'up ' +
        'down ' +
        'file ' +
        'public ' +
        'key ' +
        'count ' +
        'debug ' +
        'editor-event ' +
        'applied-ops ' +
        'queue-key ' +
        'all ' +
        'dangling ' +
        'date ' +
        'v ' +
        'export ' +
        'function ' +
        'module ' +
        'DATABASE_URL ' +
        'DatabaseClient ' +
        'dbClient '
    )
    // Count : 49

    // Then

    expect(concepts).toEqual([
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
      'get flush old',
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
      'date',
      'export',
      'function',
      'module',
      'database url',
      'database client',
      'db client'
    ])
  })

  it('extracts concepts from a list', async () => {
    // Given

    let nlpHelper = new NLP()

    // When

    let concepts = nlpHelper.extractConcepts([
      'room',
      'messages',
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
      'contacts',
      'doc-deleted',
      'unarchive',
      'destroy',
      'raw peek',
      'health_check',
      'get_and_flush_if_old',
      'flush',
      'change',
      'accept',
      'flush_all_projects',
      'flush_queued_projects',
      'redis',
      'redis_cluster',
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
      'editor-event',
      'applied-ops',
      'queue-key',
      'all',
      'dangling',
      'date',
      'v',
      'export',
      'function',
      'module',
      'DATABASE_URL',
      'DatabaseClient',
      'dbClient'
    ])
    // Count : 49

    // Then

    expect(concepts).toEqual([
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
      'raw peek',
      'health check',
      'get flush old',
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
      'date',
      'export',
      'function',
      'module',
      'database url',
      'database client',
      'db client'
    ])
  })

  it('extracts concepts from a Java code example', async () => {
    // Given

    let nlpHelper = new NLP()

    // When

    let concepts = nlpHelper.extractConcepts(
      nlpHelper.removeComments(codeExampleJava, 'java'),
      'java'
    )

    // Then

    expect(concepts).toEqual([
      'com',
      'mongodb',
      'client',
      'com',
      'mongodb',
      'client',
      'model',
      'org',
      'bson',
      'document',
      'org',
      'bson',
      'type',
      'redis',
      'client',
      'jedis',
      'jedis',
      'spark',
      'spark',
      'report project user api',
      'mongo uri',
      'mongodb',
      'getenv',
      'mongo database host',
      'getenv',
      'mongo database port',
      'mongo client',
      'mongo client',
      'mongo client',
      'create',
      'mongo uri',
      'jedis',
      'redis client',
      'jedis',
      'getenv',
      'redis database host',
      'parse int',
      'getenv',
      'redis database port',
      'port',
      'get',
      'report',
      'req',
      'res',
      'mongo database',
      'db',
      'mongo client',
      'get database',
      'reporting',
      'mongo collection',
      'document',
      'db',
      'get collection',
      'report',
      'find',
      'json transformer',
      'get',
      'project',
      'project',
      'req',
      'res',
      'project',
      'req',
      'params',
      'project',
      'valid',
      'project',
      'res',
      'status',
      'document',
      'invalid',
      'project',
      'mongo database',
      'db',
      'mongo client',
      'get database',
      'reporting',
      'mongo collection',
      'document',
      'db',
      'get collection',
      'project',
      'document',
      'project',
      'find',
      'eq',
      'project',
      'first',
      'project',
      'res',
      'status',
      'document',
      'project',
      'not',
      'found',
      'project',
      'json transformer',
      'post',
      'user',
      'req',
      'res',
      'mongo database',
      'db',
      'mongo client',
      'get database',
      'reporting',
      'mongo collection',
      'document',
      'db',
      'get collection',
      'user',
      'document',
      'user',
      'document',
      'parse',
      'req',
      'body',
      'insert one',
      'user',
      'res',
      'status',
      'user',
      'json transformer',
      'post',
      'report',
      'req',
      'res',
      'report count',
      'redis client',
      'get',
      'report count',
      'new count',
      'report count',
      'parse int',
      'report count',
      'redis client',
      'report count',
      'new count',
      'mongo database',
      'db',
      'mongo client',
      'get database',
      'reporting',
      'mongo collection',
      'document',
      'db',
      'get collection',
      'report',
      'document',
      'report',
      'document',
      'parse',
      'req',
      'body',
      'insert one',
      'report',
      'res',
      'status',
      'report',
      'json transformer'
    ])
  })

  it('extracts concepts from a Javascript code example', async () => {
    // Given

    let nlpHelper = new NLP()

    // When

    let concepts = nlpHelper.extractConcepts(
      nlpHelper.removeComments(codeExampleJavascript, 'javascript'),
      'js'
    )

    // Then

    expect(concepts).toEqual([
      'db',
      'database',
      'db',
      'database',
      'db',
      'database host',
      'database port',
      'fetch user',
      'user',
      'db',
      'query',
      'select',
      'user',
      'user',
      'user',
      'user service',
      'create user',
      'user',
      'creating',
      'user',
      'user',
      'db',
      'insert',
      'user',
      'user',
      'fetch user',
      'user service'
    ])
  })

  it('extracts concepts from a module Javascript code example', async () => {
    // Given

    let nlpHelper = new NLP()

    // When

    let concepts = nlpHelper.extractConcepts(
      nlpHelper.removeComments(codeExampleJavascript, 'javascript'),
      'mjs'
    )

    // Then

    expect(concepts).toEqual([
      'db',
      'database',
      'db',
      'database',
      'db',
      'database host',
      'database port',
      'fetch user',
      'user',
      'db',
      'query',
      'select',
      'user',
      'user',
      'user',
      'user service',
      'create user',
      'user',
      'creating',
      'user',
      'user',
      'db',
      'insert',
      'user',
      'user',
      'fetch user',
      'user service'
    ])
  })

  it('removes comments from a Java code example', async () => {
    // Given

    let nlpHelper = new NLP()

    // When

    let codeExampleWithoutComments = nlpHelper.removeComments(codeExampleJava, 'java')

    // Then

    expect(codeExampleWithoutComments).toEqual(
      '\n' +
        '                                      \n' +
        '                                         \n' +
        '       \n' +
        '  \n' +
        ' \n' +
        '        \n' +
        '         \n' +
        '       \n' +
        '  \n' +
        'import com.mongodb.client.*;                                       \n' +
        'import com.mongodb.client.model.Filters;\n' +
        'import org.bson.Document;\n' +
        'import org.bson.types.ObjectId;\n' +
        'import redis.clients.jedis.Jedis;\n' +
        '\n' +
        'import static spark.Spark.*;\n' +
        '                           \n' +
        'public class ReportProjectUserApi {\n' +
        '    private static final String MONGO_URI = "mongodb://" + System.getenv("MONGO_DATABASE_HOST") + ":" + System.getenv("MONGO_DATABASE_PORT");\n' +
        '    private static final MongoClient mongoClient = MongoClients.create(MONGO_URI);\n' +
        '    private static final Jedis redisClient = new Jedis(System.getenv("REDIS_DATABASE_HOST"), Integer.parseInt(System.getenv("REDIS_DATABASE_PORT")));\n' +
        '\n' +
        '    public static void main(String[] args) {\n' +
        '        port(4000);\n' +
        '\n' +
        '        get("/reports", (req, res) -> {\n' +
        '            MongoDatabase db = mongoClient.getDatabase("reporting");\n' +
        '            MongoCollection<Document> collection = db.getCollection("reports");\n' +
        '            return collection.find().into(new java.util.ArrayList<>());\n' +
        '        }, new JsonTransformer());\n' +
        '\n' +
        '        get("/projects/:project_id", (req, res) -> {\n' +
        '            String projectId = req.params("project_id");\n' +
        '            if (!ObjectId.isValid(projectId)) {\n' +
        '                res.status(400);\n' +
        '                return new Document("error", "Invalid project ID");\n' +
        '            }\n' +
        '            MongoDatabase db = mongoClient.getDatabase("reporting");\n' +
        '            MongoCollection<Document> collection = db.getCollection("projects");\n' +
        '            Document project = collection.find(Filters.eq("_id", new ObjectId(projectId))).first();\n' +
        '            if (project == null) {\n' +
        '                res.status(404);\n' +
        '                return new Document("error", "Project not found");\n' +
        '            }\n' +
        '            return project;\n' +
        '        }, new JsonTransformer());\n' +
        '\n' +
        '        post("/users", (req, res) -> {\n' +
        '            MongoDatabase db = mongoClient.getDatabase("reporting");\n' +
        '            MongoCollection<Document> collection = db.getCollection("users");\n' +
        '            Document user = Document.parse(req.body());\n' +
        '            collection.insertOne(user);\n' +
        '            res.status(201);\n' +
        '            return user;\n' +
        '        }, new JsonTransformer());\n' +
        '\n' +
        '        post("/reports", (req, res) -> {\n' +
        '            String reportCount = redisClient.get("report_count");\n' +
        '            int newCount = (reportCount == null) ? 1 : Integer.parseInt(reportCount) + 1;\n' +
        '            redisClient.set("report_count", String.valueOf(newCount));\n' +
        '\n' +
        '            MongoDatabase db = mongoClient.getDatabase("reporting");\n' +
        '            MongoCollection<Document> collection = db.getCollection("reports");\n' +
        '            Document report = Document.parse(req.body());\n' +
        '            collection.insertOne(report);\n' +
        '            res.status(201);\n' +
        '            return report;\n' +
        '        }, new JsonTransformer());\n' +
        '    }        \n' +
        '  \n' +
        '  \n' +
        '      \n' +
        '                    \n' +
        '\n' +
        '            \n' +
        '            \n' +
        '\n' +
        '             \n' +
        '\n' +
        '                   \n' +
        '\n' +
        '            \n' +
        '            \n' +
        '  \n' +
        '            \n' +
        '}\n'
    )
  })

  it('removes comments from a JavaScript code example', async () => {
    // Given

    let nlpHelper = new NLP()

    // When

    let codeExampleWithoutComments = nlpHelper.removeComments(codeExampleJavascript, 'javascript')

    // Then

    expect(codeExampleWithoutComments).toEqual(
      '\n' +
        '                                      \n' +
        'const db = require("./database");\n' +
        'let db = new Database(\n' +
        "  'db://' + process.env.DATABASE_HOST + ':' + process.env.DATABASE_PORT\n" +
        ')                                      \n' +
        '                                         \n' +
        '       \n' +
        '  \n' +
        ' \n' +
        '        \n' +
        '         \n' +
        '       \n' +
        '  \n' +
        'function fetchUsers(userId) { \n' +
        '    return db.query(`SELECT * FROM users WHERE user_id = ${userId}`);\n' +
        '}        \n' +
        '  \n' +
        '  \n' +
        '      \n' +
        '                    \n' +
        '                       \n' +
        'class userService {\n' +
        '    createUser(user) {\n' +
        '        console.log("Creating user:", user);\n' +
        '        return db.insert("users", user);\n' +
        '    }\n' +
        '}\n' +
        '            \n' +
        '            \n' +
        '\n' +
        '             \n' +
        '\n' +
        '                   \n' +
        '\n' +
        '            \n' +
        '            \n' +
        '  \n' +
        '            \n' +
        'module.exports = { fetchUsers, userService };\n'
    )
  })

  it('extracts raw concepts from text', () => {
    // Given

    let nlpHelper = new NLP()

    // When

    const concepts = nlpHelper.extractRawConcepts(
      nlpHelper.removeComments(codeExampleJavascript, 'javascript')
    )

    // Then

    expect(concepts).toEqual([
      'const',
      'db',
      'require',
      'database',
      'let',
      'db',
      'new',
      'Database',
      'db',
      'process',
      'env',
      'DATABASE_HOST',
      'process',
      'env',
      'DATABASE_PORT',
      'function',
      'fetchUsers',
      'userId',
      'return',
      'db',
      'query',
      'SELECT',
      'FROM',
      'users',
      'WHERE',
      'user_id',
      'userId',
      'class',
      'userService',
      'createUser',
      'user',
      'console',
      'log',
      'Creating',
      'user',
      'user',
      'return',
      'db',
      'insert',
      'users',
      'user',
      'module',
      'exports',
      'fetchUsers',
      'userService'
    ])
  })

  it('extracts raw concepts from empty text', () => {
    // Given

    let nlpHelper = new NLP()

    // When

    let concepts = nlpHelper.extractRawConcepts('')

    // Then
    expect(concepts).toEqual([])
  })

  it('removes single-character from a concepts list', () => {
    // Given

    let nlpHelper = new NLP()
    let concepts = ['a', 'hello', 'b', 'world']
    concepts = nlpHelper.filterNoisyConcepts(concepts)

    // When Then

    expect(concepts).toEqual(['hello', 'world'])
  })

  it('removes single-character from a concepts list that does not contain single-character', () => {
    // Given

    let nlpHelper = new NLP()
    let concepts = ['hello', 'world']
    concepts = nlpHelper.filterNoisyConcepts(concepts)

    // When Then

    expect(concepts).toEqual(['hello', 'world'])
  })

  it('removes single-character from an empty concepts list', () => {
    // Given

    let nlpHelper = new NLP()
    let concepts = []
    concepts = nlpHelper.filterNoisyConcepts(concepts)

    // When Then

    expect(concepts).toEqual([])
  })

  it('filters stop words from a concepts list', () => {
    // Given

    let nlpHelper = new NLP()
    let concepts = ['hello', 'the', 'world', 'and', 'great']

    // When

    concepts = nlpHelper.filterStopWords(concepts)

    // Then

    expect(concepts).toEqual(['hello', 'world', 'great'])
  })

  it('filters stop words from a concepts list in case of multi-word concepts', () => {
    // Given

    let nlpHelper = new NLP()
    let concepts = ['hello the world', 'is amazing', 'great', 'and nice to meet you']

    // When

    concepts = nlpHelper.filterStopWords(concepts)

    expect(concepts).toEqual(['hello world', 'amazing', 'great', 'nice meet'])
  })

  it('filters stop words from a concepts list that does not contain stop words', () => {
    // Given

    let nlpHelper = new NLP()
    let concepts = ['hello', 'world', 'great']

    // When

    concepts = nlpHelper.filterStopWords(concepts)

    // Then

    expect(concepts).toEqual(['hello', 'world', 'great'])
  })

  it('filters stop words from an empty concepts list', () => {
    // Given

    let nlpHelper = new NLP()
    let concepts = []

    // When

    concepts = nlpHelper.filterStopWords(concepts)

    // Then

    expect(concepts).toEqual([])
  })

  it('does not filter excluded stop words from a concepts list', () => {
    // Given

    let nlpHelper = new NLP()
    let concepts = [
      'hello the world',
      'is amazing',
      'great',
      'and nice to meet you all',
      'now',
      'one day',
      'or many days'
    ]
    // NOTE: all, now, and many are excluded from stop words to not filtered.

    // When

    concepts = nlpHelper.filterStopWords(concepts)

    // Then

    expect(concepts).toEqual([
      'hello world',
      'amazing',
      'great',
      'nice meet all',
      'now',
      'one day',
      'many days'
    ])
  })

  it('filters supplementary included stop words from an concepts list', () => {
    // Given

    let nlpHelper = new NLP()
    let concepts = ['user', 'id', 'user id']
    // NOTE: id is among the supplementary inclusion stop words to not filtered.

    // When

    concepts = nlpHelper.filterStopWords(concepts)

    // Then

    expect(concepts).toEqual(['user', 'user'])
  })

  it('removes reserved keywords from a concepts list based on a file hint', () => {
    // Given

    let nlpHelper = new NLP()
    let concepts = ['function', 'hello', 'var', 'world', 'dotenv']

    // When

    concepts = nlpHelper.filterReservedKeywords(concepts, 'js')

    // Then

    expect(concepts).toEqual(['hello', 'world'])
  })

  it('removes reserved keywords from a concepts list based on an __extends__ file hint', () => {
    // Given

    let nlpHelper = new NLP()
    let concepts = ['function', 'hello', 'var', 'world', 'dotenv']

    // When

    concepts = nlpHelper.filterReservedKeywords(concepts, 'mjs')

    // Then

    expect(concepts).toEqual(['hello', 'world'])
  })

  it('removes reserved keywords from a concepts list based on file hint and keyword hints', () => {
    // Given

    let nlpHelper = new NLP()
    let concepts = ['function', 'hello', 'var', 'world', 'dotenv']

    // When

    concepts = nlpHelper.filterReservedKeywords(concepts, 'js', ['dotenv', 'function']) // where "function" is a conceptual entity of the domain.

    // Then

    expect(concepts).toEqual(['function', 'hello', 'world', 'dotenv'])
  })

  it('does not remove any reserved keywords when the list does not contain reserved keywords', () => {
    // Given

    let nlpHelper = new NLP()
    let concepts = ['hello', 'world']

    // When

    concepts = nlpHelper.filterReservedKeywords(concepts, 'js')

    // Then

    expect(concepts).toEqual(['hello', 'world'])
  })

  it('does not remove any reserved keywords when there is not file hint', () => {
    // Given

    let nlpHelper = new NLP()
    let concepts = ['function', 'hello', 'var', 'world']

    // When

    concepts = nlpHelper.filterReservedKeywords(concepts, '')

    // Then

    expect(concepts).toEqual(['function', 'hello', 'var', 'world'])
  })

  it('splits kebab-case, snake_case, SCREAMING_SNAKE_CASE, camelCase, and PascalCase concepts into individual words from a concepts list', () => {
    // Given

    let nlpHelper = new NLP()
    let concepts = [
      'helloWorld',
      'my-variable',
      'some_function',
      'BigClassName',
      'DATABASE_HOST_URL'
    ]

    // When

    concepts = nlpHelper.formatMultipleWordsConcepts(concepts)

    // Then

    expect(concepts).toEqual([
      'hello world',
      'my variable',
      'some function',
      'big class name',
      'database host url'
    ])
  })

  it(
    'splits kebab-case, snake_case, SCREAMING_SNAKE_CASE, camelCase, and PascalCase concepts into individual words from an already' +
      ' well-formatted concepts list',
    () => {
      // Given

      let nlpHelper = new NLP()
      let concepts = [
        'hello world',
        'my variable',
        'some function',
        'big class name',
        'database host url'
      ]

      // When

      concepts = nlpHelper.formatMultipleWordsConcepts(concepts)

      // Then

      expect(concepts).toEqual([
        'hello world',
        'my variable',
        'some function',
        'big class name',
        'database host url'
      ])
    }
  )

  it('lemmatizes plural words from a concepts list', () => {
    // Given

    let nlpHelper = new NLP()
    let concepts = ['cars', 'libraries']

    // When

    concepts = nlpHelper.lemmatizeConcepts(concepts)

    // Then

    expect(concepts).toEqual(['car', 'library'])
  })

  it('lemmatizes words already under their base form from a concepts list', () => {
    // Given

    let nlpHelper = new NLP()
    let concepts = ['computer', 'world']

    // When

    concepts = nlpHelper.lemmatizeConcepts(concepts)

    // Then

    expect(concepts).toEqual(['computer', 'world'])
  })

  it('does not lemmatize exclusions from a concept list', () => {
    // Given

    let nlpHelper = new NLP()
    let concepts = ['data']

    // When

    concepts = nlpHelper.lemmatizeConcepts(concepts)

    // Then

    expect(concepts).toEqual(['data'])
  })

  it('returns the concepts list statistics', () => {
    // Given

    let nlpHelper = new NLP()
    let concepts = ['hello world', 'hello', 'great world']

    // When

    concepts = nlpHelper.getConceptsStatistics(concepts)

    // Then

    expect(concepts).toEqual({
      hello: { numberOfOccurrence: 2 },
      world: { numberOfOccurrence: 2 },
      great: { numberOfOccurrence: 1 }
    })
  })

  it('returns an empty concepts list statistics when from an empty concepts list', () => {
    // Given

    let nlpHelper = new NLP()

    // When

    let concepts = nlpHelper.getConceptsStatistics([])

    // Then

    expect(concepts).toEqual({})
  })

  it('scores concepts from different documents by several measures', async () => {
    // Given

    let nlpHelper = new NLP()

    // When

    let scoredConcepts = nlpHelper.scoreConcepts([
      [
        'the',
        'world',
        'kid',
        'dad',
        'mum',
        'cat',
        'dog',
        'car',
        'bike',
        'motorbike',
        'truck',
        'ball',
        'racket',
        'net',
        'court'
      ],
      [
        'the',
        'world',
        'the',
        'kid',
        'the',
        'dad',
        'the',
        'mum',
        'the',
        'cat',
        'the',
        'dog',
        'the',
        'car',
        'the',
        'bike',
        'the',
        'motorbike',
        'the',
        'truck',
        'the',
        'ball',
        'the',
        'racket'
      ],
      [
        'the',
        'world',
        'kid',
        'the',
        'world',
        'dad',
        'the',
        'world',
        'mum',
        'the',
        'world',
        'cat',
        'the',
        'world',
        'dog',
        'the',
        'world',
        'car',
        'the',
        'world',
        'bike',
        'the',
        'world',
        'motorbike',
        'the',
        'world',
        'truck',
        'the',
        'world',
        'ball'
      ],
      ['the', 'court', 'the', 'court', 'the', 'court', 'the', 'court']
    ])

    // Then

    expect(scoredConcepts).toEqual([
      {
        name: 'world', // Very frequent everywhere.
        score: 0.8179347826086957
      },
      {
        name: 'court', // Frequent not everywhere.
        score: 0.5813266009682708
      },
      {
        name: 'the', // Too frequent everywhere.
        score: 0.44660370861742144
      },
      {
        name: 'net', // Very rare everywhere.
        score: 0.27349268863842513
      },
      {
        name: 'racket', // Rare everywhere.
        score: 0.10067561903744082
      },
      {
        name: 'kid', // Frequent everywhere.
        score: 0.08018867924528304
      },
      {
        name: 'dad', // Frequent everywhere.
        score: 0.08018867924528304
      },
      {
        name: 'mum', // Frequent everywhere.
        score: 0.08018867924528304
      },
      {
        name: 'cat', // Frequent everywhere.
        score: 0.08018867924528304
      },
      {
        name: 'dog', // Frequent everywhere.
        score: 0.08018867924528304
      },
      {
        name: 'car', // Frequent everywhere.
        score: 0.08018867924528304
      },
      {
        name: 'bike', // Frequent everywhere.
        score: 0.08018867924528304
      },
      {
        name: 'motorbike', // Frequent everywhere.
        score: 0.08018867924528304
      },
      {
        name: 'truck', // Frequent everywhere.
        score: 0.08018867924528304
      },
      {
        name: 'ball', // Weakly frequent everywhere.
        score: 0.08018867924528304
      }
    ]) // It scores by atypical statistical profile.
  })

  it('scores concepts from different documents by several measures with keyword hints', async () => {
    // Given

    let nlpHelper = new NLP()

    // When

    let scoredConcepts = nlpHelper.scoreConcepts(
      [
        [
          'the',
          'world',
          'kid',
          'dad',
          'mum',
          'cat',
          'dog',
          'car',
          'bike',
          'motorbike',
          'truck',
          'ball',
          'racket',
          'net',
          'court'
        ],
        [
          'the',
          'world',
          'the',
          'kid',
          'the',
          'dad',
          'the',
          'mum',
          'the',
          'cat',
          'the',
          'dog',
          'the',
          'car',
          'the',
          'bike',
          'the',
          'motorbike',
          'the',
          'truck',
          'the',
          'ball',
          'the',
          'racket'
        ],
        [
          'the',
          'world',
          'kid',
          'the',
          'world',
          'dad',
          'the',
          'world',
          'mum',
          'the',
          'world',
          'cat',
          'the',
          'world',
          'dog',
          'the',
          'world',
          'car',
          'the',
          'world',
          'bike',
          'the',
          'world',
          'motorbike',
          'the',
          'world',
          'truck',
          'the',
          'world',
          'ball'
        ],
        ['the', 'court', 'the', 'court', 'the', 'court', 'the', 'court']
      ],
      ['ball'] // Keyword hints.
    )

    // Then

    expect(scoredConcepts).toEqual([
      {
        name: 'ball', // Weakly frequent everywhere BUT among keyword hints.
        score: 1
      },
      {
        name: 'world',
        score: 0.8179347826086957
      },
      {
        name: 'court',
        score: 0.5813266009682708
      },
      {
        name: 'the',
        score: 0.44660370861742144
      },
      {
        name: 'net',
        score: 0.27349268863842513
      },
      {
        name: 'racket',
        score: 0.10067561903744082
      },
      {
        name: 'kid',
        score: 0.08018867924528304
      },
      {
        name: 'dad',
        score: 0.08018867924528304
      },
      {
        name: 'mum',
        score: 0.08018867924528304
      },
      {
        name: 'cat',
        score: 0.08018867924528304
      },
      {
        name: 'dog',
        score: 0.08018867924528304
      },
      {
        name: 'car',
        score: 0.08018867924528304
      },
      {
        name: 'bike',
        score: 0.08018867924528304
      },
      {
        name: 'motorbike',
        score: 0.08018867924528304
      },
      {
        name: 'truck',
        score: 0.08018867924528304
      }
    ]) // It scores by atypical statistical profile and keyword hints.
  })

  it('scores empty concepts list by several measures', async () => {
    // Given

    let nlpHelper = new NLP()

    // When

    let scoredConcepts = nlpHelper.scoreConcepts([])

    // Then

    expect(scoredConcepts).toEqual([])
  })

  it('classifies concepts list based on keyword hints', async () => {
    // Given
    const mockResult = ['count', 'order', 'order count'] // Obtained by executing manually the application.
    const spy = jest.spyOn(NLP.prototype, 'classifyConcept').mockResolvedValue(mockResult)
    const nlpHelper = new NLP()
    const terms = [
      'get',
      'count',
      'order',
      'collection',
      'find',
      'find one',
      'post',
      'insert one',
      'response',
      'status',
      'mongo client',
      'order count',
      'db',
      'document',
      'redis client',
      'app',
      'redis',
      'request',
      'not',
      'body parser',
      'connect',
      'found',
      'message',
      'express',
      'close',
      'mongodb',
      'use',
      'ready',
      'valid',
      'application port',
      'urlencoded',
      'extended',
      'create client',
      'url',
      'redis database host',
      'redis database port',
      'ok',
      'mongo database host',
      'mongo database port',
      'params',
      'body'
    ]
    const inclusionKeywordHint = ['order', 'count']
    const exclusionKeywordHint = [
      'get',
      'post',
      'put',
      'delete',
      'patch',
      'all',
      'head',
      'del',
      'collection',
      'aggregate',
      'bulkWrite',
      'count',
      'countDocuments',
      'createIndex',
      'createIndexes',
      'deleteMany',
      'deleteOne',
      'distinct',
      'drop',
      'dropAllIndexes',
      'dropIndex',
      'dropIndexes',
      'ensureIndex',
      'estimatedDocumentCount',
      'find',
      'findAndModify',
      'findAndRemove',
      'findOne',
      'findOneAndDelete',
      'findOneAndReplace',
      'findOneAndUpdate',
      'geoHaystackSearch',
      'group',
      'indexes',
      'indexExists',
      'indexInformation',
      'initializeOrderedBulkOp',
      'initializeUnorderedBulkOp',
      'insert',
      'insertMany',
      'insertOne',
      'isCapped',
      'listIndexes',
      'mapReduce',
      'options',
      'parallelCollectionScan',
      'reIndex',
      'remove',
      'rename',
      'replaceOne',
      'save',
      'stats',
      'update',
      'updateMany',
      'updateOne',
      'watch'
    ]

    // When
    const result = await nlpHelper.classifyConcept(
      terms,
      inclusionKeywordHint,
      exclusionKeywordHint
    )

    // Then
    expect(result).toEqual(mockResult)
    expect(spy).toHaveBeenCalledWith(terms, inclusionKeywordHint, exclusionKeywordHint)

    // Cleanup
    spy.mockRestore()
  })

  it('classifies concepts list without inclusion keyword hints', async () => {
    // Given
    const mockResult = ['count', 'order', 'order count']
    // Obtained by executing manually the application.
    const spy = jest.spyOn(NLP.prototype, 'classifyConcept').mockResolvedValue(mockResult)
    const nlpHelper = new NLP()
    const terms = [
      'get',
      'count',
      'order',
      'collection',
      'find',
      'find one',
      'post',
      'insert one',
      'response',
      'status',
      'mongo client',
      'order count',
      'db',
      'document',
      'redis client',
      'app',
      'redis',
      'request',
      'not',
      'body parser',
      'connect',
      'found',
      'message',
      'express',
      'close',
      'mongodb',
      'use',
      'ready',
      'valid',
      'application port',
      'urlencoded',
      'extended',
      'create client',
      'url',
      'redis database host',
      'redis database port',
      'ok',
      'mongo database host',
      'mongo database port',
      'params',
      'body'
    ]
    const inclusionKeywordHint = [] // NOTE: The inclusion group may be empty (not recommended), as the exclusion group has a default basis seed and classification will be performed based on a threshold calculated from this default basis seed.
    const exclusionKeywordHint = [
      'get',
      'post',
      'put',
      'delete',
      'patch',
      'all',
      'head',
      'del',
      'collection',
      'aggregate',
      'bulkWrite',
      'count',
      'countDocuments',
      'createIndex',
      'createIndexes',
      'deleteMany',
      'deleteOne',
      'distinct',
      'drop',
      'dropAllIndexes',
      'dropIndex',
      'dropIndexes',
      'ensureIndex',
      'estimatedDocumentCount',
      'find',
      'findAndModify',
      'findAndRemove',
      'findOne',
      'findOneAndDelete',
      'findOneAndReplace',
      'findOneAndUpdate',
      'geoHaystackSearch',
      'group',
      'indexes',
      'indexExists',
      'indexInformation',
      'initializeOrderedBulkOp',
      'initializeUnorderedBulkOp',
      'insert',
      'insertMany',
      'insertOne',
      'isCapped',
      'listIndexes',
      'mapReduce',
      'options',
      'parallelCollectionScan',
      'reIndex',
      'remove',
      'rename',
      'replaceOne',
      'save',
      'stats',
      'update',
      'updateMany',
      'updateOne',
      'watch'
    ]

    // When
    const result = await nlpHelper.classifyConcept(
      terms,
      inclusionKeywordHint,
      exclusionKeywordHint
    )

    // Then
    expect(result).toEqual(mockResult)
    expect(spy).toHaveBeenCalledWith(terms, inclusionKeywordHint, exclusionKeywordHint)

    // Cleanup
    spy.mockRestore()
  })

  it('classifies concepts list without exclusion keyword hints', async () => {
    // Given
    const mockResult = ['count', 'order', 'order count']
    // Obtained by executing manually the application.
    const spy = jest.spyOn(NLP.prototype, 'classifyConcept').mockResolvedValue(mockResult)
    const nlpHelper = new NLP()
    const terms = [
      'get',
      'count',
      'order',
      'collection',
      'find',
      'find one',
      'post',
      'insert one',
      'response',
      'status',
      'mongo client',
      'order count',
      'db',
      'document',
      'redis client',
      'app',
      'redis',
      'request',
      'not',
      'body parser',
      'connect',
      'found',
      'message',
      'express',
      'close',
      'mongodb',
      'use',
      'ready',
      'valid',
      'application port',
      'urlencoded',
      'extended',
      'create client',
      'url',
      'redis database host',
      'redis database port',
      'ok',
      'mongo database host',
      'mongo database port',
      'params',
      'body'
    ]
    const inclusionKeywordHint = ['order', 'cloud']
    const exclusionKeywordHint = [] // NOTE: The exclusion group may be empty (not recommended), as it has a default basis seed and classification will be performed based on a threshold calculated from this default basis seed and also based on the inclusion group.

    // When
    const result = await nlpHelper.classifyConcept(
      terms,
      inclusionKeywordHint,
      exclusionKeywordHint
    )

    // Then
    expect(result).toEqual(mockResult)
    expect(spy).toHaveBeenCalledWith(terms, inclusionKeywordHint, exclusionKeywordHint)

    // Cleanup
    spy.mockRestore()
  })
})

// Failure cases test suite

describe('NLP tries to', () => {
  it('extract concepts from null data', async () => {
    // Given

    let nlpHelper = new NLP()

    // When Then

    expect(nlpHelper.extractConcepts(null)).toEqual([])
  })

  it('extract concepts from undefined data', async () => {
    // Given

    let nlpHelper = new NLP()

    // When Then

    expect(nlpHelper.extractConcepts(undefined)).toEqual([])
  })

  it('extract concepts from empty data', async () => {
    // Given

    let nlpHelper = new NLP()

    // When Then

    expect(nlpHelper.extractConcepts('')).toEqual([])
  })
})
