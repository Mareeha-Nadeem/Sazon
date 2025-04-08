import mysql from 'mysql2/promise';

// MySQL connection setup (Async/Await friendly)
const db = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'M@reeh@123',
  database: 'sazon_db',
  waitForConnections: true,
  connectionLimit: 10,  // Prevent too many open connections
  queueLimit: 0
});

// Log success message
console.log("✅ Connected to MySQL Database");

// Export connection pool
export default db;
