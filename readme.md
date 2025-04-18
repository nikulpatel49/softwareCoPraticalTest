# SoftwareCo Test App

backend API for managing users and roles with JWT-based authentication and Swagger documentation.

## 🚀 Features

- User and Role CRUD operations
- JWT Authentication
- Environment-based configuration via `.env`
- API Key security (`X-API-KEY`)
- Request logging with `morgan` and `winston`
- Swagger API documentation
- Eslint and Prettier integration

---

## 📁 Project Structure

```
.
├── config/             # Configuration files (e.g., passport)
├── controllers/        # Route controllers
├── models/             # Mongoose models (User, Role)
├── routes/             # Express routes
├── middlewares/        # Custom middlewares (auth, api-key, etc.)
├── services/           # service
├── schemas/            # validation
├── utils/              # Utility functions
├── logs/               # Logs (via winston)
├── .env                # Environment variables
├── server.js           # App entry point
├── package.json
└── README.md
```

---

## 🧪 Requirements

- Node.js (v18+ recommended)
- MongoDB (local or cloud)

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/nikulpatel49/softwareCoPraticalTest.git

# Navigate to the folder
cd softwareCoPraticalTest

# Install dependencies
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
API_NAME="SoftwareCo Test App"

# MongoDB Configuration
MONGO_URI="mongodb://127.0.0.1:27017/softwareCo"

# Server port
PORT=5000

# Environment type
NODE_ENV="local"

# JWT Authentication
AUTH_SECRET_KEY="WDCPMefHkk72HKPbga4h"
JWT_EXPIRES_IN="8h"

# Morgan logger
LOG_FORMAT=dev
LOG_DIR=../logs

# API Key
X_API_KEY="test"
```

---

## 🧾 Running the Application

```bash
# Start the server
npm run start

# Start in dev mode (with nodemon)
npm run dev
```

---

## 🔐 Authentication

- JWT-based authentication using `passport-jwt`
- API Key (`X-API-KEY`) middleware for enhanced security

---

## 📘 Swagger Documentation

Swagger UI available at:

```
http://localhost:5000/api-docs
```
git init
## 🔍 Linting

```bash
# Lint check
npx eslint .

# Fix issues
npx eslint . --fix
```

---
