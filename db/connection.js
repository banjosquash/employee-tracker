const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Brayden1',
    database: 'employee_tracker'
});

module.exports = db