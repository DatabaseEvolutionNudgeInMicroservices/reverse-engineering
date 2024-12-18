# DENIM Reverse Engineering

## Description

This application enables to reverse-engineer a microservices architecture from a data perspective.

## Features

Here is a summary of the features currently supported.

### Static Analysis

#### Description

The static analysis feature enables the developer to (1) retrieve one or more GitHub/GitLab microservices, (2) 
statically analyze them, (3) identify data access code fragments linked to certain API or database technologies and 
likely to change during the evolution phase, implying then the propagation of changes in interdependent components 
(e.g. other microservices or databases), (4) extract thanks to NLP the data concepts of those data access code 
fragments, (5) link the data access code fragments with related data concepts, (6) compare data concepts with other 
ones in the same microservice, (7) associate same data concepts, (8) present the result as a report, in a defined 
model, designed to help developers understand microservices in a conceptual data approach, so that they can pay 
attention to them when co-evolving API and database accesses. This report aims to provide developers with a valuable 
basis for software evolution tasks, such as re-documentation, visualization, quality assessment, improvement 
recommendations, impact analysis, or change propagation. 

Here is a summary of languages and technologies currently supported:

#### Implementation status

| Language              | Technology                        | Implementation status |
|-----------------------|-----------------------------------|-----------------------|
| JavaScript/TypeScript | MongoDB <br/> Redis <br/> Express | 🌕 <br/> 🌕 <br/> 🌕  |

#### How to?

**__INPUT__**

Invoke the static analysis by using the [POST /static/language/:language/repository/zip](http://locahost:3000/static/language/:language/repository/zip) root with a ZIP file inside the request.
All repositories to analyze should be integrated in the ZIP file.
Each directory at the root of the zip file represents a repository.

This zip file can be generated from GitHub/GitLab repositories thanks to [DENIM Downloading](https://github.com/DatabaseEvolutionNudgeInMicroservices/downloading).

**__OUTPUT__**

Consult the response object:

```json
[
  {
    // A repository
    "directories": [
      {
        // A directory
        "location": "https://github.com/<user>/<repository>",
        "directories": [
          // ...
        ],
        "files": [
          {
            // A file
            "location": "https://github.com/<user>/<repository>/.../<file path>.js",
            "linesOfCode": <LoC>,
            "codeFragments": [
              {
                // A code fragment
                "location": "https://github.com/<user>/<repository>/.../<file path>.js#Lx1Cx1-Lx2y2",
                "technology": {
                  "name": "<technology>" // E.g., javascript-api-express, javascript-db-mongo, javascript-db-redis.
                },
                "operation": {
                  "name": "<operation>" // E.g., CREATE, READ, UPDATE, DELETE, OTHER
                },
                "method": {
                  "name": "<method>" // E.g., post, get, findOne, sadd, etc.
                },
                "sample": {
                  "content": "<sample>" // E.g., a Redis key, a MongoDB object, etc.
                },
                "concepts": [
                  {
                    "name": "<concept>" // E.g., a route resource concept name, a Redis key name, a MongoDB, collection name, etc.
                  }
                ],
                "heuristics": "<heuristics>", // The matching heuristics tracing.
                "score": "<score>" // The computed likelihood score.
              }
            ]
          } // ...
        ]
      } // ...
    ]
  } // ...
]
```

## Development details

### Setup

- [Install NodeJS](https://nodejs.org/fr/download).
- [Install Docker Desktop](https://docs.docker.com/desktop/windows/install/).
- [Download the last CodeQL CLI binaries zip file](https://github.com/github/codeql-cli-binaries/releases) and extract
  it at `/lib/codeql-cli`).
- [Download last CodeQL libraries](https://github.com/github/codeql) and extract them next to CodeQL CLI at
  `/lib/codeql-lib`).
- Open the project in an IDE and install the dependencies.
  ```shell
  npm install
  ```
- Create an `.env` file with the following content.
  ```shell
  # Windows
  FILE_SYSTEM_SEPARATOR="\"
  ```
  ```shell
  # Linux
  FILE_SYSTEM_SEPARATOR="/"
  ```
- Launch the application.
  ```shell
  npm run start
  ```
  The app runs at [http://localhost:3000](http://localhost:3000).

### Test the app (manually)

Manual test suites are set up thanks through the [Postman](https://www.postman.com/) tool.

The tests are specified in the `/test/manual` directory and are named following the `*.test.js` pattern.

### Test the app (unit testing)

Unit test suites are set up thanks to the [Jest](https://www.npmjs.com/package/jest) framework.

The tests are specified in the `/test/unit` directory and are named following the `*.test.js` pattern.

The configuration of Jest is stated in the `/package.json` file.

The tests running computes the code coverage.

#### Launching the tests

- Launch the unit tests.

  ```bash
  npm run test_unit
  ```

### Test the app (integration testing)

Integration test suites are set up thanks to the [SuperTest](https://www.npmjs.com/package/supertest) framework.

The tests are specified in the `/test/integration` directory and are named following the `*.test.js` pattern.

The configuration of Jest is stated in the `/package.json` file.

#### Preparing the environment with Docker

- Launch the application on Docker (cf. [Dockerize the application](#dockerize-the-application)).

#### Launching the tests

- Launching integration tests.

  ```bash
  npm run test_integration
  ```

### Dockerize the application

The project contains a `Dockerfile` at its root in order to create an image of the application.

A `docker-compose.yml` file also exists at the root in order to launch easily a container for the application.

- Build the image and launch the container.

  ```bash
  docker-compose up
  ```

  Warning! This command must be executed at the location of the `docker-compose.yml` file and have to be run as with the
  right privileges (administrator).

### Documentation

An autogenerated documentation is available thanks to SwaggerUI
at [http://localhost:3000/docs](http://localhost:3000/docs).

- Generate the documentation.

  ```bash
  npm run swagger
  ```

### CI/CD

A CI/CD process is set up thanks to GitLab CI/CD.
Learn more about GitLab CI/CD via [this page](https://docs.gitlab.com/ee/ci/).

This one is described in the `.gitlab-ci.yml`.
Warning! Right privileges must be granted to Docker on the session on which the CI is executed.

## Technical details

### Technologies

* JavaScript
* Docker

### Libraries

#### Project configuration

* [expressjs](https://www.npmjs.com/package/express) is a backend NodeJS framework.
* [body-parser](https://www.npmjs.com/package/body-parser) is used for parsing REST API request body.

#### Tests

* [Jest](https://www.npmjs.com/package/jest) is used for unit testing.
* [SuperTest](https://www.npmjs.com/package/supertest) is used for integration testing.

#### Documentation

* [swagger-autogen](https://www.npmjs.com/package/swagger-autogen) is used for SWAGGER documentation.
* [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) is used UI SWAGGER documentation.

#### Files

* [multer](https://www.npmjs.com/package/multer) for downloading files.
* [adm-zip](https://www.npmjs.com/package/adm-zip) for unzipping ZIP files.
* [sloc](https://www.npmjs.com/package/sloc) for counting the number of lines of code.

#### Analysis

* [CodeQL](https://github.com/github/codeql-cli-binaries/releases/tag/v2.13.0) is used for static code analysis.
* [Wink](https://winkjs.org/) is used for concept extraction powered by NLP.
* [Natural](https://naturalnode.github.io/natural/) is used for concept extraction powered by NLP.

### Tools

* [npm](https://www.npmjs.com/) is the package manager used.
* [GitLab CI/CD](https://docs.gitlab.com/ee/ci/) is the CI/CD continuous tool used.
* [Docker Desktop](https://docs.docker.com/desktop/windows/install/) is the containerization technology used.
* [Postman](https://www.postman.com/) is the tool for testing manually the API.

## Design details

### Static Analysis

For finding locations of code related to some API or database technologies, some heuristics are defined based on
pattern and rules matching according to the documentation of the technologies. These help to compute the likelihood
scores.

API (Express) Likelihood Score Heuristics.

| ID  | Description                                                                                                                       |
|-----|-----------------------------------------------------------------------------------------------------------------------------------|
| E1  | According to the Express documentation, the method call has an Express-like method name (e.g., get, post, put, delete, ...).      |
| E2  | According to the Express documentation, the method call has an string as first argument.                                          |
| E3  | According to the Express documentation, the method call has an Express route-like string as first argument.                       |
| E4  | According to the Express documentation, the method call has a function as second argument.                                        |
| E5  | According to the Express documentation, the method call has an Express-like receiver name (e.g., app).                            |
| E6  | According to the Express documentation, the method call has an Express-like import around (in the same file).                     |   
| E7  | According to the Express documentation, the method call has an Express-like client assignment around (in the same file).          |
| E8  | According to the Express documentation, the method call is linked to an Express-like client assignment around (in the same file). |

DB (Redis) Likelihood Score Heuristics.

| ID  | Description                                                                                                                                    |
|-----|------------------------------------------------------------------------------------------------------------------------------------------------|
| R1  | According to the Redis documentation, the method call has a Redis-like method name (e.g., get, set, del, scan, keys, sadd, rpush, setnx, ...). |
| R2  | According to the Redis documentation, the method call has a string as first argument.                                                          |
| R3  | According to the Redis documentation, the method call has an Redis-like receiver name (e.g., client, redisClient).                             |
| R4  | According to the Redis documentation, the method call has a Redis-like import around (in the same file).                                       |   
| R5  | According to the Redis documentation, the method call has a Redis-like client assignment around (in the same file).                            |
| R6  | According to the Redis documentation, the method call is linked to an Redis-like client assignment around (in the same file).                  |

DB (MongoDB) Likelihood Score Heuristics.

| ID  | Description                                                                                                                                     |
|-----|-------------------------------------------------------------------------------------------------------------------------------------------------|
| M1  | According to the MongoDB documentation, the method call has a MongoDB-like method name (e.g., findOne, insertMany, updateOne, deleteMany, ...). |
| M2  | According to the MongoDB documentation, the method call has a string, an object or an array as first argument.                                  |
| M3  | According to the MongoDB documentation, the method call has an MongoDB-like receiver name (e.g., db, collection).                               |
| M4  | According to the MongoDB documentation, the method call has a MongoDB-like import around (in the same file).                                    |   
| M5  | According to the MongoDB documentation, the method call has a MongoDB-like client assignment around (in the same file).                         |
| M6  | According to the MongoDB documentation, the method call is linked to a MongoDB-like client assignment around (in the same file).                |

## Evaluation

The complete data of our evaluation is detailed in the `/evaluation` folder. The `1-Ground truth <system name>.xlsx` 
files details in the "Data" folder the manual annotation performed on the system codebases. The "Analysis" folder 
gives insights of some metrics. The `2-Actual <system name>.xlsx` file details the results of the empirical 
evaluation, for example in terms of precision and recall. Other files (i.e., HTML) give graphical visual of the 
results. The script `index.js` with files `3-expected <system name>.csv` and `4-actual <system name>.csv` help to 
compute precision and recall scores. Files `5-<...>.html` contains charts.

## Contributing

If you want to contribute to the project by supporting new technologies or heuristics, please consider the 
following instructions:

- Any query file must be added in the `/query` directory.
- Excepting the `/test` and `/evaluation`, none other directories must be impacted.
- The file `qlpack.yml` cannot be modified.
- Any query file must respect the naming conventions `<Type of detection><Technology name><Type of code fragment>.
  query.ql`.
- Any helping method used for the queries must be added in the `utils.qll` file.
- Any helping method or class must be named clearly (no abbreviations), especially integrating the type of detection,
  technology, and type of code fragment.
- More generally, any contribution must follow the conventions and keep the shape of previous contributions.  
- Any contribution must be tested (unit and integration tests) and evaluated (evaluation). See `/test` and 
  `/evaluation` directories. All the tests and the CI/CD pipeline must pass before definitively integrating the 
  contribution.
- Any contribution must be documented, especially by updating the `README.md` file.
- Any contribution must be approved via the pull request mechanism.