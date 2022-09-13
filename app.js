const express = require('express');
const path = require('path');

const styles = require('./webapp/private/routes/styles');
const tests = require('./webapp/private/routes/tests');
const data = require('./webapp/private/routes/data');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './webapp/public/html/container/container.htm'));
});

app.use('/styles', styles);
app.use('/tests', tests);
app.use('/data', data);
app.use('/public', express.static(path.join(__dirname, 'webapp/public')));

app.listen(port, () => {
    console.log(`Challenger app listening on port ${port}`);
});