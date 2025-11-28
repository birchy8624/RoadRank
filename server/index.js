const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const fs = require('fs');
const path = require('path');
const db = require('./db');

const initDb = async () => {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'db', 'init.sql')).toString();
    await db.query(sql);
    console.log('Database initialized successfully.');
  } catch (err) {
    console.error('Error initializing database:', err.message);
  }
};

app.get('/api/roads', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM roads');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/api/roads', async (req, res) => {
  try {
    const { path, twistiness, surface_condition, fun_factor, scenery, visibility } = req.body;

    // Validate ratings
    const ratings = [twistiness, surface_condition, fun_factor, scenery, visibility];
    for (const rating of ratings) {
      if (rating < 1 || rating > 5) {
        return res.status(400).send('Invalid rating value. Ratings must be between 1 and 5.');
      }
    }

    const newRoad = await db.query(
      'INSERT INTO roads (path, twistiness, surface_condition, fun_factor, scenery, visibility) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [JSON.stringify(path), twistiness, surface_condition, fun_factor, scenery, visibility]
    );
    res.json(newRoad.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

const axios = require('axios');

app.post('/api/snap-to-road', async (req, res) => {
  try {
    const { path } = req.body;
    const pathString = path.map((p) => `${p.lat},${p.lng}`).join('|');
    const response = await axios.get(
      `https://roads.googleapis.com/v1/snapToRoads?path=${pathString}&interpolate=true&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

initDb();

module.exports = app;
