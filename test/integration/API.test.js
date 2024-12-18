const request = require('supertest');

const baseURL = 'http://localhost:8080'; // If dockerized.
//const baseURL = 'http://localhost:3000'; // If not dockerized, launch from the npm console.

// Happy path test suite

describe('DENIM Reverse Engineering API', () => {

    it('analyze statically a repository', () => {
        const zipFilePath = process.cwd() + '/' + 'test' + '/' + 'integration' + '/' + 'asset' + '/' + 'example.zip';
        return request(baseURL)
            .post('/static/language/javascript/repository/zip')
            .attach('file', zipFilePath)
            .expect(200)
            .then(response => {

                //console.log(JSON.stringify(response.body));

                // When Then
                expect(JSON.stringify(response.body).includes('location":"https://github.com/example/example/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.example.js#L0C0-L0C0"')).toBe(true);
            });
    });
});

// Failure cases test suite

describe('DENIM Reverse Engineering API tries to', () => {

    it('analyze statically an undefined repository', async () => {
        return request(baseURL)
            .post('/static/language/javascript/repository/zip')
            .attach('file', undefined)
            .expect(400)
    });

    it('analyze statically a null repository', async () => {
        return request(baseURL)
            .post('/static/language/javascript/repository/zip')
            .attach('file', null)
            .expect(400)
    });

    it('analyze statically an non-existent repository', async () => {

        return request(baseURL)
            .post('/static/language/javascript/repository/zip')
            .attach('file', '')
            .expect(400)
    });

    it('analyze statically an empty repository', async () => {

        return request(baseURL)
            .post('/static/language/javascript/repository/zip')
            .attach('file', process.cwd() + '/' + 'test' + '/' + 'integration' + '/' + 'asset' + '/' + 'empty.zip')
            .expect(400)
    });
});