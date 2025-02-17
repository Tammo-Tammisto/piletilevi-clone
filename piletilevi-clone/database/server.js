const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());

const db = new sqlite3.Database('./db.sqlite', (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to SQLite database.');

    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
