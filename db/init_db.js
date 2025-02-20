const pool = require("./connection");
const queries = require('./queries');

const createTables = async () => {
  try {
    pool.query(queries.createUsersTable());
    pool.query(queries.createLocationsTable());
    pool.query(queries.createInvitesTable());
    console.log("Tables created successfully");
  } catch (err) {
    console.error("ERROR Error creating tables:", err);
  }
};

module.exports = {
  createTables
}
