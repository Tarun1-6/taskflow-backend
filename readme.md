# TaskFlow Backend API

TaskFlow Backend is a REST API for managing tasks, built as a personal learning project to strengthen backend development skills and prepare for placements.

The project focuses on clean architecture, real-world backend practices, performance optimization, and production-style features.

---

## Features

* JWT Authentication with secure cookies
* Task CRUD operations
* Filtering, search, pagination, and sorting
* Dashboard analytics using MongoDB aggregation
* Redis caching (Upstash) for improved performance
* Swagger API documentation
* Background cron job to detect overdue tasks
* Centralized error handling
* Input validation with express-validator
* Rate limiting and request logging

---

## Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* Redis (Upstash)
* Swagger (OpenAPI)
* Winston Logger
* Express Validator
* Node-cron

---

## Key Concepts Demonstrated

* REST API design
* Middleware architecture
* JWT authentication flow
* MongoDB aggregation pipelines
* Redis caching strategies
* Background job scheduling
* Centralized error handling


## Project Structure

* src/
*  controllers/
*  routes/
*  models/
*  middlewares/
*  validators/
*  config/
*  utils/
*  jobs/
* 
* server.js
* package.json

---

## Getting Started

### 1. Clone the repository

git clone https://github.com/Tarun1-6/taskflow-backend.git
cd taskflow-backend

### 2. Install dependencies

npm install

### 3. Configure environment variables

Create a `.env` file:

* PORT=3000
* MONGO_URI=your_mongodb_uri
* JWT_SECRET=your_secret
* REDIS_URL=your_redis_url
* CLIENT_URL=http://localhost:5173
* NODE_ENV=development

### 4. Run the server

Development:
npm run dev

Production:
npm start

---

## API Documentation

Live API:
https://taskflow-backend-39zx.onrender.com

Swagger Documentation:
https://taskflow-backend-39zx.onrender.com/api-docs

---

## Health Check Endpoint

http://localhost:3000/health

---

## Purpose of the Project

This project was built to:

* Improve backend architecture skills
* Understand authentication and middleware flow
* Learn caching and background jobs
* Build a production-style backend for practice and placements

---

## Future Improvements

* Refresh token authentication
* Role-based access control
* Email reminders for overdue tasks
* Docker containerization
* Frontend client for task management

---

## Notes

This repository contains only the backend API.  
A frontend client may be developed in the future.

## Author

Tarun
GitHub: https://github.com/Tarun1-6
