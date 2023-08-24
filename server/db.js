// db.js
const mysql = require('mysql');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Brand@123',
  database: 'resume_app'
};

const pool = mysql.createPool(dbConfig);

module.exports = {
  query: (query, params, callback) => {
    pool.query(query, params, callback);
  },
  close: () => {
    pool.end();
  }
};
