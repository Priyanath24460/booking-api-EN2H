# 📅 Booking API

A RESTful API built with **NestJS**, **TypeORM**, and **PostgreSQL** for managing services and customer bookings. Designed as part of the EN2H Backend Engineering Internship Technical Assessment.

---

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| NestJS | Backend framework |
| TypeORM | ORM for database interaction |
| PostgreSQL | Relational database |
| JWT (Passport) | Authentication |
| class-validator | Request body validation |
| Swagger | Auto-generated API documentation |

---

## ✨ Features

- **User Authentication** — Register and login with JWT tokens
- **Service Management** — Full CRUD, protected by JWT
- **Booking System** — Customers book services **without login**
- **Business Rules** — Past date prevention, duplicate slot prevention, status transition validation
- **Pagination** — Supported on `GET /services` and `GET /bookings`
- **Global Exception Filter** — Consistent error response format
- **Swagger Documentation** — Interactive API docs at `/api/docs`

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) v14+
- npm v9+

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd booking-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=booking_db

JWT_SECRET=your_secret_key
```

### 4. Create the PostgreSQL database

```sql
CREATE DATABASE booking_db;
```

> The app uses `synchronize: true` in development — TypeORM will auto-create all tables on startup.

### 5. Start the development server

```bash
npm run start:dev
```

Server starts at: `http://localhost:3000`  
Swagger docs at: `http://localhost:3000/api/docs`

---

## 📚 API Documentation

Interactive Swagger UI is available at:

```
http://localhost:3000/api/docs
```

To test protected endpoints:
1. Use `POST /auth/login` to get a JWT token
2. Click **Authorize** in Swagger and paste the token
3. All protected endpoints will now include the token automatically

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Login and receive JWT token |

### Services

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/services` | JWT | Create a new service |
| `GET` | `/services?page=1&limit=10` | JWT | Get all services (paginated) |
| `GET` | `/services/:id` | JWT | Get a service by ID |
| `PATCH` | `/services/:id` | JWT | Update a service |
| `DELETE` | `/services/:id` | JWT | Delete a service |

### Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/bookings` | **Public** | Create a booking (no login needed) |
| `GET` | `/bookings?status=pending&page=1&limit=10` | JWT | Get all bookings (paginated, filterable) |
| `GET` | `/bookings/:id` | JWT | Get a booking by ID |
| `PATCH` | `/bookings/:id/status` | JWT | Update booking status |
| `DELETE` | `/bookings/:id` | JWT | Delete a booking |

---

## 📦 Example Requests

### Register
```json
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

### Create a Booking (Public)
```json
POST /bookings
{
  "customerName": "Jane Smith",
  "customerEmail": "jane@example.com",
  "customerPhone": "+94771234567",
  "serviceId": 1,
  "bookingDate": "2026-08-15",
  "bookingTime": "10:00",
  "notes": "Please use fragrance-free products"
}
```

### Update Booking Status (Admin)
```json
PATCH /bookings/1/status
Authorization: Bearer <token>
{
  "status": "confirmed"
}
```

---

## 🔒 Business Rules

| Rule | Description |
|------|-------------|
| Past dates | Booking dates in the past are rejected with `400 Bad Request` |
| Duplicate slots | Same service + date + time cannot be booked twice |
| Inactive services | Bookings for inactive services are rejected |
| Status transitions | Cancelled bookings cannot be marked as completed and vice versa |

---

## 🗄️ Database Schema

### `users` table
| Column | Type | Description |
|--------|------|-------------|
| id | int | Primary key |
| name | varchar(100) | Full name |
| email | varchar(150) | Unique email |
| password | varchar | Hashed password |
| createdAt | timestamp | Auto-set |

### `services` table
| Column | Type | Description |
|--------|------|-------------|
| id | int | Primary key |
| title | varchar(150) | Service name |
| description | text | Service description |
| duration | int | Duration in minutes |
| price | decimal(10,2) | Price |
| isActive | boolean | Availability flag |
| createdAt / updatedAt | timestamp | Auto-set |

### `bookings` table
| Column | Type | Description |
|--------|------|-------------|
| id | int | Primary key |
| customerName | varchar(100) | Customer full name |
| customerEmail | varchar(150) | Customer email |
| customerPhone | varchar(20) | Customer phone |
| serviceId | int | FK → services.id |
| bookingDate | date | Date of appointment |
| bookingTime | time | Time of appointment |
| status | enum | pending / confirmed / cancelled / completed |
| notes | text | Optional notes |
| createdAt / updatedAt | timestamp | Auto-set |

---

## 🧪 Running Tests

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov
```
