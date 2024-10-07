import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

// Existing user-related routes...

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Add a new product
app.post('/api/products', async (req, res) => {
  const { name, price, category, subCategory, sku, description, image } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (name, price, category, sub_category, sku, description, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, price, category, subCategory, sku, description, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Error adding product' });
  }
});

// Update a product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, category, subCategory, sku, description, image, disabled } = req.body;
  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, price = $2, category = $3, sub_category = $4, sku = $5, description = $6, image = $7, disabled = $8 WHERE id = $9 RETURNING *',
      [name, price, category, subCategory, sku, description, image, disabled, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Toggle product status
app.patch('/api/products/:id/toggle', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE products SET disabled = NOT disabled WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error toggling product status:', error);
    res.status(500).json({ message: 'Error toggling product status' });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT category FROM products');
    res.json(result.rows.map(row => row.category));
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// Get sub-categories for a specific category
app.get('/api/categories/:category/subcategories', async (req, res) => {
  const { category } = req.params;
  try {
    const result = await pool.query('SELECT DISTINCT sub_category FROM products WHERE category = $1', [category]);
    res.json(result.rows.map(row => row.sub_category));
  } catch (error) {
    console.error('Error fetching sub-categories:', error);
    res.status(500).json({ message: 'Error fetching sub-categories' });
  }
});

// Add a new sub-category
app.post('/api/categories/:category/subcategories', async (req, res) => {
  const { category } = req.params;
  const { subCategory } = req.body;
  try {
    // We'll just insert a dummy product with the new sub-category to avoid creating a separate table
    const result = await pool.query(
      'INSERT INTO products (name, price, category, sub_category, sku, description, image, disabled) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING sub_category',
      ['Dummy Product', 0, category, subCategory, 'DUMMY-SKU', 'Dummy description', '', true]
    );
    res.status(201).json({ subCategory: result.rows[0].sub_category });
  } catch (error) {
    console.error('Error adding sub-category:', error);
    res.status(500).json({ message: 'Error adding sub-category' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});