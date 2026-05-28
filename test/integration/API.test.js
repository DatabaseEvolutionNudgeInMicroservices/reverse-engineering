const request = require('supertest')

const baseURL = 'http://localhost:8080' // If dockerized.
//const baseURL = 'http://localhost:3000' // If not dockerized, launch from the npm console.

// Happy path test suite

describe('DENIM Reverse Engineering API', () => {
  it('analyze statically by AST a repository', () => {
    const zipFilePath =
      process.cwd() + '/' + 'test' + '/' + 'integration' + '/' + 'asset' + '/' + 'example.zip'
    return request(baseURL)
      .post('/static/ast')
      .attach('file', zipFilePath)
      .field(
        'options',
        JSON.stringify({
          language: 'javascript'
        })
      )
      .expect(200)
      .then((response) => {
        //console.log(JSON.stringify(response.body));

        // When Then
        expect(
          JSON.stringify(response.body).includes(
            '"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L0C0-L0C0"'
          )
        ).toBe(true)
      })
  })

  it('analyze statically by NLP & TR a repository', () => {
    const zipFilePath =
      process.cwd() + '/' + 'test' + '/' + 'integration' + '/' + 'asset' + '/' + 'example.zip'
    return request(baseURL)
      .post('/static/nlptr')
      .attach('file', zipFilePath)
      .field(
        'options',
        JSON.stringify({
          language: 'javascript',
          hints: {
            in: [],
            out: []
          }
        })
      )
      .expect(200)
      .then((response) => {
        //console.log(JSON.stringify(response.body))

        // When Then
        expect(
          JSON.stringify(response.body).includes(
            '"location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js"'
          )
        ).toBe(true)
      })
  })
})

// Failure cases test suite

describe('DENIM Reverse Engineering API tries to', () => {
  it('analyze statically by AST an undefined repository', async () => {
    return request(baseURL)
      .post('/static/ast')
      .attach('file', undefined)
      .field(
        'options',
        JSON.stringify({
          language: 'javascript',
          hints: {
            in: [],
            out: []
          }
        })
      )
      .expect(400)
  })

  it('analyze statically by AST a null repository', async () => {
    return request(baseURL)
      .post('/static/ast')
      .attach('file', null)
      .field(
        'options',
        JSON.stringify({
          language: 'javascript',
          hints: {
            in: [],
            out: []
          }
        })
      )
      .expect(400)
  })

  it('analyze statically by AST an non-existent repository', async () => {
    return request(baseURL)
      .post('/static/ast')
      .attach('file', '')
      .field(
        'options',
        JSON.stringify({
          language: 'javascript',
          hints: {
            in: [],
            out: []
          }
        })
      )
      .expect(400)
  })

  it('analyze statically by AST an empty repository', async () => {
    return request(baseURL)
      .post('/static/ast')
      .attach(
        'file',
        process.cwd() + '/' + 'test' + '/' + 'integration' + '/' + 'asset' + '/' + 'empty.zip'
      )
      .field(
        'options',
        JSON.stringify({
          language: 'javascript',
          hints: {
            in: [],
            out: []
          }
        })
      )
      .expect(400)
  })

  it('analyze statically by AST a repository with a null language', async () => {
    return request(baseURL)
      .post('/static/ast')
      .attach(
        'file',
        process.cwd() + '/' + 'test' + '/' + 'integration' + '/' + 'asset' + '/' + 'example.zip'
      )
      .field(
        'options',
        JSON.stringify({
          language: null,
          hints: {
            in: [],
            out: []
          }
        })
      )
      .expect(400)
  })

  it('analyze statically by AST a repository with an undefined language', async () => {
    return request(baseURL)
      .post('/static/ast')
      .attach(
        'file',
        process.cwd() + '/' + 'test' + '/' + 'integration' + '/' + 'asset' + '/' + 'example.zip'
      )
      .field(
        'options',
        JSON.stringify({
          language: undefined,
          hints: {
            in: [],
            out: []
          }
        })
      )
      .expect(400)
  })

  it('analyze statically by AST a repository with null options', async () => {
    return request(baseURL)
      .post('/static/ast')
      .attach(
        'file',
        process.cwd() + '/' + 'test' + '/' + 'integration' + '/' + 'asset' + '/' + 'example.zip'
      )
      .field('options', JSON.stringify(null))
      .expect(400)
  })

  it('analyze statically by AST a repository with empty options', async () => {
    return request(baseURL)
      .post('/static/ast')
      .attach(
        'file',
        process.cwd() + '/' + 'test' + '/' + 'integration' + '/' + 'asset' + '/' + 'example.zip'
      )
      .field('options', JSON.stringify({}))
      .expect(400)
  })

  it('analyze statically by NLP & TR an undefined repository', async () => {
    return request(baseURL)
      .post('/static/nlptr')
      .attach('file', undefined)
      .field(
        'options',
        JSON.stringify({
          language: 'javascript',
          hints: {
            in: [],
            out: []
          }
        })
      )
      .expect(400)
  })

  it('analyze statically by NLP & TR a null repository', async () => {
    return request(baseURL)
      .post('/static/nlptr')
      .attach('file', null)
      .field(
        'options',
        JSON.stringify({
          language: 'javascript',
          hints: {
            in: [],
            out: []
          }
        })
      )
      .expect(400)
  })

  it('analyze statically by NLP & TR an non-existent repository', async () => {
    return request(baseURL)
      .post('/static/nlptr')
      .attach('file', '')
      .field(
        'options',
        JSON.stringify({
          language: 'javascript',
          hints: {
            in: [],
            out: []
          }
        })
      )
      .expect(400)
  })

  it('analyze statically by NLP & TR an empty repository', async () => {
    return request(baseURL)
      .post('/static/nlptr')
      .attach(
        'file',
        process.cwd() + '/' + 'test' + '/' + 'integration' + '/' + 'asset' + '/' + 'empty.zip'
      )
      .field(
        'options',
        JSON.stringify({
          language: 'javascript',
          hints: {
            in: [],
            out: []
          }
        })
      )
      .expect(400)
  })
})
