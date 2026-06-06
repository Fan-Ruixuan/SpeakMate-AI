// backend/models/userModel.js
const { db } = require('../db/dbInit');
const login = (username, pwd) => {
  return new Promise((resolve) => {
    db.get(`SELECT * FROM user WHERE username = ? AND pwd = ?`,
    [username, pwd], (err, row) => resolve(row));
  });
};
module.exports = { login };