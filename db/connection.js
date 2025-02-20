const Pool = require("pg").Pool;
require("dotenv").config();

// const pool = new Pool({
//     user: "postgres",
//     host: "localhost",
//     database: "kaquiz",
//     password: "admin",
//     port: 5432
// });

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});

module.exports = pool;