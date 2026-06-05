const { db } = require('../db/dbInit');

exports.login = (username, pwd) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM user WHERE username=? AND pwd=?', [username, pwd], (err, row) => {
      if (err) return reject(err);
      if (!row) return reject(new Error('账号或密码错误'));
      resolve(row);
    });
  });
};

exports.register = (username, pwd) => {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO user (username, pwd) VALUES (?,?)', [username, pwd], function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
};