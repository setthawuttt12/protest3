const mysql = require('mysql2')
const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'mu',

})

module.exports = pool.promise()