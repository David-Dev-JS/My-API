const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs.json');
const express = require('express');
const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));

app.use('/playground', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
module.exports = app;