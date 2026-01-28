# ID Generation Auto Backend

This is the backend for the ID Generation Auto application, built with Node.js, Express, and Sequelize ORM with PostgreSQL.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL

### Installation

1. **Install PostgreSQL** (if not already installed):
   - Download and install PostgreSQL from https://www.postgresql.org/download/
   - During installation, set a password for the postgres user
   - Or use a package manager like Chocolatey: `choco install postgresql`

2. **Create Database**:
   - Open pgAdmin or command line
   - Create a database named `otech_id_db`
   - Create a user `otech_id_user` with password `password`
   - Or run: `createdb otech_id_db`
   - Make sure PostgreSQL service is running
   - Make sure PostgreSQL service is running

3. **Test Connection** (optional):
   - Try connecting to PostgreSQL with your credentials
   - Use pgAdmin or `psql -U postgres -d id_generation_db`

3. **Configure Environment**:
   - Update `.env` file with your PostgreSQL credentials:
     ```
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=id_generation_db
     DB_USER=postgres
     DB_PASSWORD=your_actual_password
     PORT=5000
     ```

4. **Install Dependencies**:
   ```bash
   npm install
   ```

5. **Start the Server**:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

The server will run on http://localhost:5000

## API Endpoints

- `POST /api/employees` - Create new employee
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

## Database Schema

The `employees` table includes:
- id (Primary Key)
- fullNameEn, fullNameLocal
- positionTitleEn, positionTitleLocal
- idNumber (Unique)
- phone
- issueDate, expiryDate
- photo (Base64 encoded image)
- createdAt, updatedAt