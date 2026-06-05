const success = (data = null, msg = 'success') => {
  return { code: 200, msg, data };
};

const fail = (msg = 'error', code = 500) => {
  return { code, msg };
};

module.exports = { success, fail };