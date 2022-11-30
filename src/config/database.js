require("dotenv").config();
const { DB_HOST_DEV, DB_USER_DEV, DB_PASS_DEV, DB_NAME_DEV, DB_PORT } =
  process.env;

const { Pool } = require("pg");

const db = new Pool({
  host: DB_HOST_DEV,
  user: DB_USER_DEV,
  database: DB_NAME_DEV,
  password: DB_PASS_DEV,
  port: DB_PORT,
});

module.exports = db;
