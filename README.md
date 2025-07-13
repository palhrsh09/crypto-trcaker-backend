# Crypto Tracker Backend

A Node.js + Express backend service that handles user authentication and serves cryptocurrency data. Users must be authenticated via JWT access tokens to access the dashboard and coin history endpoints.

## 🔐 Features

- **User Authentication**
  - Login with email and password.
  - Passwords hashed using `bcrypt`.
  - Returns a JWT access token on successful login.

- **Protected Routes**
  - `/api/crypto/top` – Get top 10 cryptocurrencies (requires token).
  - `/api/crypto/history/:id` – Get historical data for a specific coin (requires token).

## 🚀 Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **Auth**: JWT, bcrypt
- **Others**: dotenv, axios, node-cron

## 📦 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/palhrsh09/crypto-trcaker-backend
cd crypto-tracker-backend
