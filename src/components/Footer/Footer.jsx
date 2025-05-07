// src/components/Footer/Footer.jsx
import React from 'react';

const Footer = ({ isReady }) => {
  return (
    <div style={styles.container}>
      <div style={styles.right}>
        <button disabled={!isReady} style={styles.button}>Apply Changes</button>
        <button disabled={!isReady} style={styles.button}>Save Config</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: 'auto',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'flex-end',
    borderTop: '1px solid #333',
  },
  right: {
    display: 'flex',
    gap: '1rem',
  },
  button: {
    padding: '0.5rem 1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  }
};

export default Footer;
