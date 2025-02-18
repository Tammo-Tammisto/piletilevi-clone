import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());

const db = new sqlite3.Database('./db.sqlite', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to SQLite database.');
    }
});

app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(rows);
        }
    });
});
//signupi on vaja veel muuta
app.post('/signup', (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    db.run(
        'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
        [firstName, lastName, email, password],
        function (err) {
            if (err) {
                return res.status(500).send(err);
            }

            // Retrieve the newly created user
            db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.send({ message: 'Signup successful', user });
            });
        }
    );
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    console.log("Received Email:", email);
    console.log("Received Password:", password);

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        console.log("User from DB:", user);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        res.json({ message: 'Login successful', user });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
