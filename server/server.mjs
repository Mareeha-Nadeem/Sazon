import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authRoutes from "./auth.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
// app.use('/images', express.static('images'));
app.use('/images', express.static(path.join(__dirname, '..', 'images')));


const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "M@reeh@123",
  database: "sazon_db",
  waitForConnections: true,
  connectionLimit: 10,
});

console.log("✅ Connected to MySQL Database");

app.use("/auth", authRoutes);

// 🔐 Middleware to check token
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};

// ✅ LOGIN endpoint — includes `name` in JWT
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

  if (users.length === 0) return res.status(401).json({ message: "User not found" });

  const user = users[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });

  // 👇 JWT includes name
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    "secretkey",
    { expiresIn: "1h" }
  );

  res.status(200).json({ message: "Login successful", token, user });
});

// 🍔 MENU
app.get('/menu', async (req, res) => {
  const [items] = await db.execute(`
    SELECT 
      mi.id, mi.name, mi.price, mi.description, mi.image_url,
      c.category AS category
    FROM menu_items mi
    JOIN categories c ON mi.category_id = c.id
  `);
  res.status(200).json(items);
});
//categoriesss
app.get('/categories', async (req, res) => {
  try {
    const [categories] = await db.execute(`
      SELECT id, category, category_image FROM categories
    `);
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// 🛒 Add to Cart
app.post('/cart', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { menu_item_id, quantity } = req.body;

  try {
    const [existing] = await db.execute(
      "SELECT * FROM cart_items WHERE user_id = ? AND menu_item_id = ?",
      [userId, menu_item_id]
    );

    if (existing.length > 0) {
      await db.execute(
        "UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND menu_item_id = ?",
        [quantity, userId, menu_item_id]
      );
    } else {
      await db.execute(
        "INSERT INTO cart_items (user_id, menu_item_id, quantity) VALUES (?, ?, ?)",
        [userId, menu_item_id, quantity]
      );
    }

    res.status(200).json({ message: "Item added to cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add item" });
  }
});

// 🛒 Get Cart Items
app.get('/cart', authenticate, async (req, res) => {
  const userId = req.user.id;
  try {
    const [items] = await db.execute(`
      SELECT ci.id, ci.quantity, mi.name, mi.price, mi.image_url 
      FROM cart_items ci 
      JOIN menu_items mi ON ci.menu_item_id = mi.id 
      WHERE ci.user_id = ?
    `, [userId]);
    res.json(items);
  } catch {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

// ✏️ Update quantity
app.put('/cart/:id', authenticate, async (req, res) => {
  const userId = req.user.id;
  const cartItemId = req.params.id;
  const { quantity } = req.body;

  try {
    await db.execute(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, cartItemId, userId]
    );
    res.status(200).json({ message: 'Quantity updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update quantity' });
  }
});

// ❌ Delete one item
app.delete('/cart/:id', authenticate, async (req, res) => {
  const userId = req.user.id;
  const cartItemId = req.params.id;

  try {
    await db.execute(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [cartItemId, userId]
    );
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove item' });
  }
});

// ❌ Clear cart
app.delete('/cart', authenticate, async (req, res) => {
  const userId = req.user.id;
  try {
    await db.execute('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
