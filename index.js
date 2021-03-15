require('dotenv').config();

const express = require('express');
const app = express();

app.use(require('./src/api'));

const port = process.env.PORT || 80;

const db = require('./src/db');
(async () => {
    await db.init();

    app.listen(port, () => console.log('Listening on port', port));
})();
