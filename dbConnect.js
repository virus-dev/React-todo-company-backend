const mysql = require('mysql2')

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "floorsbd",
    password: "admin123"
})

module.exports = conn