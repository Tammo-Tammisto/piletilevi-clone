import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;
const saltRounds = 10;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database(
  "./db.sqlite",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error("Database connection error:", err);
    } else {
      console.log("Connected to SQLite database.");
    }
  }
);

app.get("/users", (req, res) => {
  db.all("SELECT id, first_name, last_name, email FROM users", (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(rows);
    }
  });
});

app.get("/user/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT first_name, last_name, email, created_at FROM users WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(row);
    }
  });
});

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    db.run(
      "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
      [firstName, lastName, email, hashedPassword],
      function (err) {
        if (err) {
          return res.status(500).send(err);
        }

        // Retrieve the newly created user without the password
        db.get(
          "SELECT id, first_name, last_name, email FROM users WHERE email = ?",
          [email],
          (err, user) => {
            if (err) {
              return res.status(500).send(err);
            }
            res.send({ message: "Signup successful", user });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare the hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Send user info excluding the password
    const { password: _, ...userWithoutPassword } = user;
    res.json({ message: "Login successful", user: userWithoutPassword });
  });
});

app.post("/new-event", (req, res) => {
  const {
    userId,
    title,
    description,
    location,
    date,
    price,
    totalTickets,
    imageUrl,
    genre,
  } = req.body;

  db.get("SELECT role FROM users WHERE id = ?", [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied: Only admins can create events" });
    }

    db.run(
      "INSERT INTO events (title, description, location, date, price, total_tickets, imgURL, genre) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        description,
        location,
        date,
        price,
        totalTickets,
        imageUrl,
        genre,
      ],
      function (err) {
        if (err) {
          return res.status(500).send(err);
        }
        res.send({
          message: "Event created successfully",
          eventId: this.lastID,
        });
      }
    );
  });
});

app.post("/is-admin", (req, res) => {
  const { userId } = req.body;

  db.get("SELECT role FROM users WHERE id = ?", [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is an admin
    const isAdmin = user.role === "admin";
    res.json({ isAdmin });
  });
});

app.get("/events", (req, res) => {
  db.all("SELECT * FROM events", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get("/event-summaries", (req, res) => {
  db.all(
    "SELECT id, imgURL, title, date, location FROM events",
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

app.get("/event-summaries/:genre", (req, res) => {
  const { genre } = req.params;
  db.all(
    "SELECT id, imgURL, title, date, location FROM events WHERE genre LIKE '%' || ? || '%'",
    [genre],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

app.get("/event/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM events WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(row);
  });
});

app.put("/update-event/:id", (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    location,
    date,
    price,
    totalTickets,
    imageUrl,
    genre,
  } = req.body;

  db.run(
    "UPDATE events SET title = ?, description = ?, location = ?, date = ?, price = ?, total_tickets = ?, imgURL = ?, genre = ? WHERE id = ?",
    [
      title,
      description,
      location,
      date,
      price,
      totalTickets,
      imageUrl,
      genre,
      id,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Event updated successfully" });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
