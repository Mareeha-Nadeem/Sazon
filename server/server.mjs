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
app.use('/images', express.static(path.join(__dirname, '..', 'images')));

const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "M@reeh@123",
  database: "sazon_db",
  waitForConnections: true,
  connectionLimit: 10,
});

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
      SELECT ci.id, ci.quantity, mi.id AS menu_item_id, mi.name, mi.price, mi.image_url
      FROM cart_items ci
      JOIN menu_items mi ON ci.menu_item_id = mi.id 
      WHERE ci.user_id = ?
    `, [userId]);
    res.json(items);
  } catch (err) {
    console.error("Error fetching cart:", err);
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

// 🛒 Checkout endpoint - Fixed version
// 🛒 Checkout endpoint - Updated version with address details




// 🚚 Get all saved addresses for the logged-in user
// 🚚 Get all saved addresses for the logged-in user
app.get('/addresses', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.execute(
      `SELECT 
         address_id, full_name, phone_number, street_address, city,
         postal_code, country, address_type, is_default, created_at
       FROM addresses
       WHERE user_id = ?
       ORDER BY is_default DESC, created_at DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching addresses:", err);
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
});


// 📝 Save a new address
// 📝 Save a new address
app.post('/addresses', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // pull everything out and replace undefined → null (or your default)
    const full_name     = req.body.full_name     ?? req.user.name;
    const phone_number  = req.body.phone_number  ?? null;
    const street_address= req.body.street_address?? null;
    const city          = req.body.city          ?? null;
    const postal_code   = req.body.postal_code   ?? null;
    const country       = req.body.country       ?? null;
    const latitude      = req.body.latitude      ?? null;
    const longitude     = req.body.longitude     ?? null;
    const address_type  = req.body.address_type  ?? 'Home';

    // first address gets marked default
    const [[{ count }]] = await db.execute(
      `SELECT COUNT(*) AS count FROM addresses WHERE user_id = ?`,
      [userId]
    );
    const is_default = count === 0 ? 1 : 0;

    const [result] = await db.execute(
      `INSERT INTO addresses 
         (user_id, full_name, phone_number, street_address, city, postal_code, country, latitude, longitude, address_type, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, full_name, phone_number, street_address,
        city, postal_code, country, latitude, longitude,
        address_type, is_default
      ]
    );

    res.status(201).json({ message: "Address saved", address_id: result.insertId });
  } catch (err) {
    console.error("Error saving address:", err);
    res.status(500).json({ message: err.message });
  }
});

// 🔄 Set an address as default
app.patch('/addresses/:id/default', authenticate, async (req, res) => {
  const userId = req.user.id;
  const addressId = req.params.id;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1) Unset any existing default
    await conn.execute(
      `UPDATE addresses 
         SET is_default = FALSE 
       WHERE user_id = ? AND is_default = TRUE`,
      [userId]
    );

    // 2) Set the chosen one as default
    const [result] = await conn.execute(
      `UPDATE addresses 
         SET is_default = TRUE 
       WHERE address_id = ? AND user_id = ?`,
      [addressId, userId]
    );

    if (result.affectedRows === 0) {
      throw new Error("Address not found or you’re not the owner");
    }

    await conn.commit();
    res.json({ message: "Default address updated" });
  } catch (err) {
    await conn.rollback();
    console.error("Error setting default:", err);
    res.status(500).json({ message: err.message || "Failed to set default" });
  } finally {
    conn.release();
  }
});
app.post('/checkout', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { items, addressDetails } = req.body;

  console.log("Received address details:", addressDetails); // Debug log

  if (!items || !items.length) {
    return res.status(400).json({ message: "No items selected" });
  }

  // Improved validation with better error message
  if (!addressDetails) {
    return res.status(400).json({ message: "Address details are missing" });
  }
  
  if (!addressDetails.delivery_address) {
    return res.status(400).json({ message: "Delivery address is required" });
  }
  
  if (!addressDetails.city) {
    return res.status(400).json({ message: "City is required" });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    
    // Calculate total price server-side
    let total = 0;
    for (const item of items) {
      total += item.price * item.quantity;
    }
    
    // Ensure empty strings are converted to NULL for database
    const address = addressDetails.delivery_address.trim();
    const city = addressDetails.city.trim();
    const zipcode = addressDetails.zipcode?.trim() || null;
    const country = addressDetails.country?.trim() || null;
    const latitude = addressDetails.latitude || null;
    const longitude = addressDetails.longitude || null;
    
    console.log("Inserting address:", address, city, zipcode, country); // Debug log
    
    // 1) Insert order with address details - simplified query with named parameters
    const orderQuery = `
      INSERT INTO orders (
        user_id, 
        total_price, 
        delivery_address, 
        city, 
        zipcode, 
        country, 
        latitude, 
        longitude
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [orderRes] = await conn.execute(
      orderQuery, 
      [
        userId, 
        total, 
        address,
        city,
        zipcode,
        country,
        latitude,
        longitude
      ]
    );
    
    const orderId = orderRes.insertId;
    
    // 2) Insert order_items
    for (const item of items) {
      await conn.execute(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.menu_item_id, item.quantity, item.price]
      );
    }
    
    // 3) Remove selected items from cart_items
    for (const item of items) {
      if (item.id) {
        await conn.execute(
          'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
          [item.id, userId]
        );
      }
    }
    
    await conn.commit();
    
    // Return more details in response
    res.status(200).json({ 
      message: "Order placed!", 
      orderId,
      delivery_details: {
        address: address,
        city: city,
        zipcode: zipcode,
        country: country
      }
    });
  } catch (err) {
    await conn.rollback();
    console.error("Checkout error:", err);
    res.status(500).json({ message: "Checkout failed", error: err.message });
  } finally {
    conn.release();
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
}).on('error', (err) => {
  console.error('Error starting server:', err);
});