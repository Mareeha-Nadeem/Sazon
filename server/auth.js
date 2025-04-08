import express from "express";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import db from "./db.js"; // Import DB connection

const router = express.Router();
const client = new OAuth2Client("26833402978-kgr7hfustnkudlj6t1l1ah9adb9ung8k.apps.googleusercontent.com");

// ---- Normal Signup ----
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Please provide name, email, and password" });

  try {
    const [existingUsers] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUsers.length > 0) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

    res.status(201).json({ message: "User registered successfully", user: { id: result.insertId, name, email } });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ---- Google Login ----
router.post("/google", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Token is missing" });

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "26833402978-kgr7hfustnkudlj6t1l1ah9adb9ung8k.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const { sub, name, email } = payload;

    const [users] = await db.execute("SELECT * FROM users WHERE email = ? OR google_id = ?", [email, sub]);

    if (users.length > 0) {
      return res.status(200).json({ message: "User already exists", user: users[0] });
    }

    const [result] = await db.execute("INSERT INTO users (name, email, google_id) VALUES (?, ?, ?)", [name, email, sub]);

    res.status(201).json({ message: "User registered successfully", user: { id: result.insertId, name, email, google_id: sub } });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ error: "Google authentication failed" });
  }
});

export default router;
