const mysql = require('mysql2');
require('dotenv').config();

// Parse JawsDB URL if on Heroku
let dbConfig;
if (process.env.JAWSDB_URL) {
    const url = require('url');
    const dbUrl = url.parse(process.env.JAWSDB_URL);
    const dbAuth = dbUrl.auth ? dbUrl.auth.split(':') : [];
    
    dbConfig = {
        host: dbUrl.hostname,
        user: dbAuth[0],
        password: dbAuth[1],
        database: dbUrl.pathname ? dbUrl.pathname.substring(1) : undefined,
        port: dbUrl.port || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };
} else {
    // Local development
    dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };
}

const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
    } else {
        console.log('✅ Database connected successfully');
        connection.release();
    }
});

module.exports = promisePool;