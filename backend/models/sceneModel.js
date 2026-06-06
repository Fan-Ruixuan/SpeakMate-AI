// backend/models/sceneModel.js
const { db } = require('../db/dbInit');
const getSceneList = () => {
  return new Promise((resolve) => {
    db.all(`SELECT * FROM scene`, [], (err, rows) => resolve(rows));
  });
};
module.exports = { getSceneList };