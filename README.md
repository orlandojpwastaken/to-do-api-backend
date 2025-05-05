# ToDo API Backend

A RESTful API for managing ToDo items with user authentication, built using Express.js and PostgreSQL.



## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- Swagger/OpenAPI
- bcrypt for password hashing
- express-session for session management

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/orlandojpwastaken/to-do-api-backend.git
cd to-do-api-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
SESSION_SECRET=your_session_secret
```

4. Start the server:
```bash
npm start
```

The server will start on `http://localhost:3000` by default.

## API Documentation

API documentation is available at `/api-docs` when the server is running.

### Authentication Endpoints

#### Register User
- **POST** `/api/users/register`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```

#### Login
- **POST** `/api/users/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123"
  }
  ```

#### Logout
- **POST** `/api/users/logout`
- Requires authentication

#### Get Profile
- **GET** `/api/users/profile`
- Requires authentication

#### Update Profile
- **PUT** `/api/users/profile`
- Requires authentication
- **Body**:
  ```json
  {
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "janedoe@example.com"
  }
  ```

### Todo Endpoints

#### Create Todo
- **POST** `/api/todos`
- Requires authentication
- **Body**:
  ```json
  {
    "title": "Finish project",
    "description": "Complete the backend and frontend",
    "deadline": "2025-05-10T18:00:00.000Z"
  }
  ```

#### Get All Todos
- **GET** `/api/todos`
- Requires authentication

#### Get Single Todo
- **GET** `/api/todos/:id`
- Requires authentication

#### Update Todo
- **PUT** `/api/todos/:id`
- Requires authentication
- **Body**:
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "deadline": "2025-05-11T18:00:00.000Z",
    "completed": false
  }
  ```

#### Delete Todo
- **DELETE** `/api/todos/:id`
- Requires authentication

#### Toggle Todo Completion
- **PATCH** `/api/todos/:id/toggle`
- Requires authentication

## Database Schema

### Users Table
- id (Primary Key)
- email (Unique)
- password (Hashed)
- firstName
- lastName
- createdAt
- updatedAt

### Todos Table
- id (Primary Key)
- title
- description
- completed
- deadline
- userId (Foreign Key to Users)
- createdAt
- updatedAt

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

All error responses follow this format:
```json
{
  "error": "Error title",
  "details": "Error Details"
}
```