import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql2/promise"; // Using async/await for cleaner code
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authRoutes from "./auth.js"; // Add .js extension for ESM

const app = express();
const port = 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse incoming JSON requests

// MySQL Connection (using pool)
const db = await mysql.createPool({
  host: "localhost",
  user: "root", // Your MySQL username
  password: "M@reeh@123", // Your MySQL password
  database: "sazon_db", // Your database name
  waitForConnections: true,
  connectionLimit: 10, // Limit number of concurrent connections
  queueLimit: 0
});
console.log("✅ Connected to MySQL Database");

// Use routes from auth.js
app.use("/auth", authRoutes); // This will route requests to /auth/google to auth.js

// 🔹 LOGIN ROUTE
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = users[0];

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user.id, email: user.email }, "secretkey", { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
