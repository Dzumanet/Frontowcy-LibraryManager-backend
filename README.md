# Library Manager API

Library Manager API is a backend system designed as part of the final project for the Frontowcy course. It provides functionality for managing a library, including handling users, books, rentals, logs, and authentication. This project demonstrates practical application development skills.

## Features

### Authentication
- User login and logout using JWT tokens.
- Role-based access control (admin and client roles).
- Middleware for guarding routes based on roles.

### User Management
- Register new users.
- Update user profiles.
- View borrowed books and their statuses.
- Admin access to view all users' activities and rentals.

### Book Management
- Add new books (admin only).
- View all available books and their details.
- Edit and delete books (admin only).
- Ensure book availability is respected during operations.

### Rental Management
- Borrow books for a specified period.
- Return borrowed books.
- Admin access to view all rentals and force return books if necessary.

### Logs Management
- Create logs for all actions performed in the system.
- Retrieve logs filtered by users or actions (admin only).

### System Architecture
- Built with **NestJS** framework.
- **MySQL** database integration using TypeORM.
- **Swagger** documentation for API endpoints.
- Additional packages and tools used:
    - **Passport** for authentication.
    - **JWT** for token-based security.
    - **Class-Transformer** and **Class-Validator** for data validation and transformation.
    - **Helmet** for security headers.
    - **Cookie-Parser** for managing cookies.
    - **Prettier** and **ESLint** for code formatting and linting.
    - **Jest** for testing.
---

## Installation

### Prerequisites
- Node.js (v16 or later)
- MySQL database
- npm or yarn package manager

### Steps
1. Clone the repository:
   ```bash
   git clone <https://github.com/Dzumanet/Frontowcy-LibraryManager-backend.git>
   
   ```

2. Install dependencies:
   ```bash
   npm install
   or
   yarn install
   ```

3. Create a `.env` file in the root directory and configure the following variables:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=3306
   DATABASE_USER=root
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=library_manager
   JWT_KEY=your_secret_key
   SAlT_PWD_KEY=your_salt_key
   PORT=3000
   ```

4. Run database migrations (if applicable):
   ```bash
   npm run typeorm:migration:run
   ```

5. Start the application:
   ```bash
   npm run start:dev
   or
   yarn start:dev
   ```

6. Access the Swagger documentation at `http://localhost:3000/api`.

---

## Modules

### Authentication Module
- Handles login and logout functionality.
- Role-based guards for route protection.
- JWT strategy for validating tokens.

### User Module
- **Endpoints**:
    - `POST /user/register` - Register a new user.
    - `GET /user/me` - Get details of the currently logged-in user.
    - `PATCH /user/update-profile` - Update user profile.
    - `GET /user/borrowed-books` - View borrowed books for the logged-in user.

### Book Module
- **Endpoints**:
    - `POST /book/register` - Add a new book (admin only).
    - `GET /books` - Retrieve all books.
    - `GET /book/:id` - Retrieve a book by ID.
    - `PUT /book/:id` - Update a book (admin only).
    - `DELETE /book/:id` - Delete a book (admin only).

### Rental Module
- **Endpoints**:
    - `POST /rental/create` - Create a new rental.
    - `POST /rental/return/:rentalId` - Return a book.
    - `GET /rentals` - Retrieve all rentals (admin only).
    - `GET /rental/book/:bookId` - Get rental details for a specific book.
    - `GET /rentals/user/:userId` - Retrieve rentals by user (admin only).

### Log Module
- **Endpoints**:
    - `POST /log` - Create a log entry.
    - `GET /log` - Retrieve all logs (admin only).
    - `GET /log/user/:userId` - Retrieve logs by user (admin only).

---

## Development

### Code Formatting
- Prettier configuration is included in the project for consistent formatting.
- Run `npm run format` to format the code.

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

