# piletilevi-clone MVP
- Users can explore events by categories, dates, or locations, with search and filtering options
- Ticket Purchase
- User registration, login, and dashboard for managing orders and viewing tickets
- Admins can create, update, or delete events with full management functionality


# 🎟️ Piletilevi Clone – Database Structure


---

## 📅 Events Table

| Column Name     | Type       | Default               | Description                        |
|-----------------|------------|------------------------|------------------------------------|
| `id`            | INTEGER    | Primary Key, Auto Increment | Unique event identifier       |
| `imgURL`        | TEXT       | –                      | URL to an image for the event      |
| `title`         | TEXT       | –                      | Title of the event                 |
| `description`   | TEXT       | –                      | Event description                  |
| `genre`         | TEXT       | –                      | Type of event (music, theater, etc.) |
| `location`      | TEXT       | –                      | Where the event takes place        |
| `date`          | INTEGER    | –                      | Date of event (Unix Timestamp)     |
| `price`         | REAL       | –                      | Price of a single ticket           |
| `total_tickets` | INTEGER    | –                      | Number of tickets available        |
| `created_at`    | TIMESTAMP  | CURRENT_TIMESTAMP      | When the event was created         |

---

## 👤 Users Table

| Column Name   | Type      | Default           | Description                       |
|---------------|-----------|-------------------|-----------------------------------|
| `id`          | INTEGER   | Primary Key, Auto Increment | Unique user identifier     |
| `first_name`  | TEXT      | –                 | User's first name                 |
| `last_name`   | TEXT      | –                 | User's last name                  |
| `email`       | TEXT      | –                 | User's email address              |
| `password`    | TEXT      | –                 | Hashed password (bcrypt + salt)   |
| `role`        | TEXT      | 'customer'        | User role (e.g., customer, admin) |
| `created_at`  | TIMESTAMP | CURRENT_TIMESTAMP | Account creation date             |

---

## 🎫 Tickets Table

| Column Name | Type    | Description                             |
|-------------|---------|-----------------------------------------|
| `id`        | INTEGER | Primary Key, Auto Increment             |
| `eventID`   | INTEGER | Foreign key referencing `events.id`     |
| `userID`    | INTEGER | Foreign key referencing `users.id`      |

---