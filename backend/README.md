# Backend Setup Instructions

## Database Configuration

1. **Create the database:**
   ```sql
   CREATE DATABASE ollyo_task;
   ```

2. **Update database credentials:**
   Edit `backend/config/db.config.php` and update with your MySQL credentials:
   ```php
   return [
       'host' => 'localhost',
       'port' => '3306',
       'database' => 'ollyo_task',  // Your database name
       'username' => 'root',         // Your MySQL username
       'password' => 'your_password', // Your MySQL password
   ];
   ```

3. **Run the schema:**
   ```bash
   mysql -u root -p ollyo_task < backend/schema.sql
   ```
   Or import `backend/schema.sql` using phpMyAdmin or your preferred MySQL client.

## Running the Backend

### Option 1: PHP Built-in Server
```bash
cd backend
php -S 0.0.0.0:8000
```

### Option 2: Using a Web Server (Apache/Nginx)
- Point your web server document root to the `backend` directory
- Ensure PHP is configured and MySQL extension is enabled

## Environment Variables (Optional)

You can also set environment variables instead of using the config file:
```bash
export MYSQL_HOST=localhost
export MYSQL_PORT=3306
export MYSQL_DATABASE=ollyo_task
export MYSQL_USER=root
export MYSQL_PASSWORD=your_password
```

Environment variables take priority over the config file.

## Testing the API

Test the endpoints:
```bash
# Get all presets
curl http://localhost:8000/api/presets.php

# Get all devices
curl http://localhost:8000/api/devices.php
```

