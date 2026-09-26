 # Personal Expense Tracker

A full-stack expense tracker built to practice **TypeScript, SQL, MySQL, REST APIs, and backend architecture**.

The project allows users to manage their expenses, filter and search them, and view spending summaries and category-wise analytics.

## Features

* Create expenses
* View expenses
* Update expenses
* Delete expenses
* Search expenses
* Filter by category
* Filter by amount
* Use multiple filters together
* View total spending
* View expense count
* View category-wise analytics
* Form validation
* Centralized error handling
* Loading states
* Empty states
* Error states

## Tech Stack

### Frontend

* React
* TypeScript
* Vite

### Backend

* Node.js
* Express
* TypeScript

### Database

* MySQL
* SQL

### Development

* Git
* GitHub
* Postman

## Architecture

The project uses a layered backend structure:

```text
React
  ↓
API Layer
  ↓
Express Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
MySQL
```

The backend separates different responsibilities into different layers.

### Error Handling

```text
AppError
   ↓
Error Handler
   ↓
HTTP Response
```

This keeps error handling consistent across the API.

## Database

The project uses MySQL with tables for:

* Categories
* Expenses

Expenses are connected to categories using a foreign key.

The project also uses SQL migrations to create and update the database structure.

## API

The backend provides REST API endpoints for expense management.

```text
GET     /api/expenses
GET     /api/expenses/:id
POST    /api/create
PUT     /api/update/:id
DELETE  /api/delete/:id
```

The API handles:

* Creating expenses
* Reading expenses
* Updating expenses
* Deleting expenses
* Validation
* Filtering
* Searching
* Analytics

## Project Structure

```text
expense-tracker/
├── client/              # React frontend
├── server/              # Express backend
├── .env.example         # Environment variable template
├── .gitignore
└── README.md
```

## Environment Variables

Create a `.env` file inside the server folder and add the required database configuration.

Example:

```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=expense_tracker
DB_PORT=3306
```

Do not commit your `.env` file to GitHub.

Use `.env.example` to show the required environment variables without exposing real credentials.

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

### 2. Install dependencies

Install dependencies for both the client and server.

```bash
cd client
npm install
```

```bash
cd ../server
npm install
```

### 3. Configure the database

Create a MySQL database named:

```text
expense_tracker
```

Then configure your `.env` file.

### 4. Run the backend

```bash
npm run dev
```

### 5. Run the frontend

Open another terminal:

```bash
cd client
npm run dev
```

The application can then be opened using the local URL shown by Vite.

## What I Learned

This project helped me practice:

* TypeScript in a real project
* SQL and MySQL
* REST API development
* React and TypeScript integration
* Controller → Service → Repository architecture
* Database relationships
* SQL queries and aggregation
* API validation
* Centralized error handling
* Frontend loading, empty, and error states
* Connecting a frontend, backend, and database

## Project Goal

The main goal of this project was to strengthen my full-stack development foundation by building a complete application with **React, TypeScript, Node.js, Express, SQL, and MySQL**.

It was also an important step in my learning journey toward **AI Full Stack Development**.
