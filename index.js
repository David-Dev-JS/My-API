const logger = require('morgan');
const express = require("express");
const app = express();

const docs = require('./route/docs');
const api = require('./route/api');

app.use(logger('dev'));
app.get('/', (req, res) => {
	res.redirect('/playground')
})
app.use('/', docs);
app.use('/api', api);

app.listen(8080, async () => {
    console.log(`app listening on port http://localhost:8080`)
});