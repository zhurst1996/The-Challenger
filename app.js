import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import styles from './webapp/private/routes/styles.js';
import tests from './webapp/private/routes/tests.js';
import data from './webapp/private/routes/data.js';
import weather from './webapp/private/routes/weather.js';

const __filename = fileURLToPath(
    import.meta.url
);

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(path.join(path.dirname(__filename), './webapp/public/html/container/container.htm')));
});

app.use('/styles', styles);
app.use('/tests', tests);
app.use('/data', data);
app.use('/weather', weather);
app.use('/public', express.static(path.join(path.dirname(__filename), 'webapp/public')));

app.listen(port, () => {
    console.log(`Challenger app listening on port ${port}`);
});