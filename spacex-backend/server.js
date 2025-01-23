const express = require('express');
const axios = require('axios');
const sqlite3 = require('better-sqlite3');
const cors = require('cors');

// Initialize Express app
const app = express();
const PORT = 4000;

// Enable CORS for all routes
app.use(cors());

// Set up SQLite database
const db = new sqlite3('spacex_data.db');

// Create a table to store SpaceX data
db.prepare(`
  CREATE TABLE IF NOT EXISTS launches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mission_name TEXT,
    launch_date TEXT,
    rocket_name TEXT,
    launch_success BOOLEAN
  )
`).run();

// Function to fetch data from SpaceX API and store in the database
const fetchAndStoreData = async () => {
  try {
    const response = await axios.get('https://api.spacexdata.com/v4/launches');
    const launches = response.data.slice(0, 10); // Get 10 records

    const insert = db.prepare(`
      INSERT INTO launches (mission_name, launch_date, rocket_name, launch_success)
      VALUES (?, ?, ?, ?)
    `);

    launches.forEach((launch) => {
      insert.run(
        launch.name,
        launch.date_utc,
        launch.rocket,
        launch.success ? 1 : 0
      );
    });

    console.log('Successfully inserted 10 SpaceX launch records into the database.');
  } catch (error) {
    console.error('Error fetching SpaceX data:', error.message);
  }
};

// Endpoint to view stored SpaceX data
app.get('/launches', (req, res) => {
  try {
    const launches = db.prepare('SELECT * FROM launches').all();
    res.json(launches);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving data from database' });
  }
});

// Start the server and fetch data
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await fetchAndStoreData();
});
