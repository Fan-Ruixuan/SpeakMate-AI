const { db } = require('../db/dbInit');

const runQuery = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });

const getQuery = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

const parseUserId = (userId) => {
  const id = parseInt(userId, 10);
  return Number.isNaN(id) ? 1 : id;
};

exports.collectWord = async (userId, word, wrongSent = '') => {
  const uid = parseUserId(userId);
  const normalizedWord = word.trim().toLowerCase();

  if (!normalizedWord) {
    return null;
  }

  const existing = await getQuery(
    'SELECT * FROM wordbook WHERE uid = ? AND word = ?',
    [uid, normalizedWord]
  );

  if (existing) {
    await runQuery(
      'UPDATE wordbook SET count = count + 1, wrong_sent = ? WHERE wid = ?',
      [wrongSent || existing.wrong_sent, existing.wid]
    );
    const updated = await getQuery('SELECT * FROM wordbook WHERE wid = ?', [
      existing.wid,
    ]);
    return { ...updated, isNew: false };
  }

  const insertResult = await runQuery(
    'INSERT INTO wordbook (uid, word, phonetic, wrong_sent, count) VALUES (?, ?, ?, ?, 1)',
    [uid, normalizedWord, '', wrongSent]
  );

  const row = await getQuery('SELECT * FROM wordbook WHERE wid = ?', [
    insertResult.lastID,
  ]);

  return { ...row, isNew: true };
};
