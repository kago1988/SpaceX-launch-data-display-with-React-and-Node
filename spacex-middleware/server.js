const express = require('express');
const axios = require('axios');
const sqlite3 = require('better-sqlite3');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());

const db = new sqlite3('spacex_data.db');

db.prepare(`
  CREATE TABLE IF NOT EXISTS launches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mission_name TEXT,
    launch_date TEXT,
    rocket_name TEXT,
    launch_success BOOLEAN
  )
`).run();

const fetchAndStoreData = async () => {
  try {
    const response = await axios.get('https://api.spacexdata.com/v4/launches');
    const launches = response.data.slice(0, 10); 

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

app.get('/launches', (req, res) => {
  try {
    const launches = db.prepare('SELECT * FROM launches').all();
    res.json(launches);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving data from database' });
  }
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await fetchAndStoreData();
});
