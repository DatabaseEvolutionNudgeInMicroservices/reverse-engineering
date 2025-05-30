const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger.json'
const endpointsFiles = ['./router/router.js']

swaggerAutogen(outputFile, endpointsFiles)
