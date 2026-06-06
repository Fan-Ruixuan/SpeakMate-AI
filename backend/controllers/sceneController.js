const { success } = require('../utils/result');
const sceneModel = require('../models/sceneModel');

const getList = async (req, res) => {
  const list = await sceneModel.getSceneList();
  res.json(success(list));
};
module.exports = { getList };