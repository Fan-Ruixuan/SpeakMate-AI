const { success, fail } = require('../utils/result');
const userService = require('../services/userService');

exports.login = async (req, res) => {
  try {
    const { username, pwd } = req.body;
    const data = await userService.login(username, pwd);
    res.json(success(data));
  } catch (e) {
    res.json(fail(e.message));
  }
};

exports.register = async (req, res) => {
  try {
    const { username, pwd } = req.body;
    await userService.register(username, pwd);
    res.json(success(null, '注册成功'));
  } catch (e) {
    res.json(fail(e.message));
  }
};