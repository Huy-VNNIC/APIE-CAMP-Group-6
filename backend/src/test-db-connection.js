require('dotenv').config();
const { Pool } = require('pg');

async function testConnection() {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: false
  });

  try {
    console.log('=== Database Connection Test ===');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`User: ${process.env.DB_USER}`);
    
    const res = await pool.query('SELECT NOW()');
    console.log('Connection successful!');
    console.log('Current timestamp from DB:', res.rows[0].now);
    
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\nAvailable tables:');
    tablesRes.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });

    // Check sample user
    const usersRes = await pool.query('SELECT username, email, role FROM users');
    console.log('\nUser list:');
    usersRes.rows.forEach(user => {
      console.log(`- ${user.username} (${user.email}): ${user.role}`);
    });
    
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    await pool.end();
  }
}

testConnection();
