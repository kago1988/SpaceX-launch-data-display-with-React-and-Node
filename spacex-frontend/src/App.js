import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(false);

  const styles = {
    background: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'black', 
      backgroundImage: 'url("/background.jpg")',
      backgroundSize: 'contain', 
      backgroundPosition: 'center center', 
      backgroundRepeat: 'no-repeat', 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlay: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)', 
      padding: '20px',
    },
    title: {
      fontSize: '36px',
      color: 'white',
      marginBottom: '20px',
    },
    button: {
      padding: '10px 20px',
      fontSize: '18px',
      color: 'white',
      backgroundColor: '#007bff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginBottom: '20px',
    },
    tableContainer: {
      width: '90vw', 
      maxHeight: '400px', 
      overflowY: 'auto', 
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '10px',
      border: '1px solid #ccc',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    thTd: {
      border: '1px solid #ddd',
      padding: '15px',
      color: 'white',
      textAlign: 'left',
    },
    whiteText: {
      color: 'white',
      fontSize: '20px',
    },
  };

  const fetchLaunchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/launches');
      setLaunches(response.data);
    } catch (error) {
      console.error('Error fetching launch data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.overlay}>
        <h1 style={styles.title}>SpaceX Launch Data</h1>
        <button onClick={fetchLaunchData} disabled={loading} style={styles.button}>
          {loading ? 'Loading...' : 'Load Data'}
        </button>

        {launches.length > 0 ? (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.thTd}>ID</th>
                  <th style={styles.thTd}>Mission Name</th>
                  <th style={styles.thTd}>Launch Date</th>
                  <th style={styles.thTd}>Rocket Name</th>
                  <th style={styles.thTd}>Success</th>
                </tr>
              </thead>
              <tbody>
                {launches.map((launch) => (
                  <tr key={launch.id}>
                    <td style={styles.thTd}>{launch.id}</td>
                    <td style={styles.thTd}>{launch.mission_name}</td>
                    <td style={styles.thTd}>{new Date(launch.launch_date).toLocaleDateString()}</td>
                    <td style={styles.thTd}>{launch.rocket_name}</td>
                    <td style={styles.thTd}>{launch.launch_success ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && <p style={styles.whiteText}>No data loaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;
