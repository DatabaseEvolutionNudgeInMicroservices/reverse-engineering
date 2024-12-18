// Libraries
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const {spawnSync} = require("child_process");

// Application settings: express
const app = express();
const port = 3000;

// Application settings: body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Application settings: swagger-ui-express
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes list

const routes = require('./router/Router.js');
app.use('/', routes);

// Application entry point

app.listen(port);

