const { Pool } = require('pg');

// Enable SSL for external connections (Render requires SSL)
const isExternalConnection = process.env.DATABASE_URL?.includes('render.com');
const useSSL = process.env.NODE_ENV === 'production' || isExternalConnection;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: useSSL ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
    console.error('Unexpected database error:', err);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};
