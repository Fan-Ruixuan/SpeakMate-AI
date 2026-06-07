const result = require('../utils/result');
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

const allQuery = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

const parseUserId = (userId) => {
  const id = parseInt(userId, 10);
  return Number.isNaN(id) ? 1 : id;
};

const mapRow = (row) => ({
  id: row.wid,
  word: row.word,
  phonetic: row.phonetic || '',
  wrongSentence: row.wrong_sent || '',
  errorCount: row.count,
  addedAt: row.add_time,
});

exports.getVocabularyList = async (req, res) => {
  try {
    const { userId = '1', page = 1, limit = 10 } = req.query;
    const uid = parseUserId(userId);
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;

    const countRow = await getQuery(
      'SELECT COUNT(*) AS total FROM wordbook WHERE uid = ?',
      [uid]
    );

    const rows = await allQuery(
      `SELECT * FROM wordbook
       WHERE uid = ?
       ORDER BY count DESC, add_time DESC
       LIMIT ? OFFSET ?`,
      [uid, limitNum, offset]
    );

    res.json(
      result.success({
        list: rows.map(mapRow),
        total: countRow?.total || 0,
        page: pageNum,
        limit: limitNum,
      })
    );
  } catch (err) {
    console.error('Vocabulary list error:', err);
    res.status(500).json(result.fail('Vocabulary list error: ' + err.message));
  }
};

exports.addVocabulary = async (req, res) => {
  try {
    const { word, phonetic = '', wrongSent = '', userId = '1' } = req.body;

    if (!word || !word.trim()) {
      return res.json(result.fail('Word is required'));
    }

    const uid = parseUserId(userId);
    const normalizedWord = word.trim().toLowerCase();

    const existing = await getQuery(
      'SELECT * FROM wordbook WHERE uid = ? AND word = ?',
      [uid, normalizedWord]
    );

    if (existing) {
      return res.json(result.fail('Word already exists in vocabulary book'));
    }

    const insertResult = await runQuery(
      'INSERT INTO wordbook (uid, word, phonetic, wrong_sent, count) VALUES (?, ?, ?, ?, 1)',
      [uid, normalizedWord, phonetic, wrongSent]
    );

    const row = await getQuery('SELECT * FROM wordbook WHERE wid = ?', [
      insertResult.lastID,
    ]);

    res.json(result.success(mapRow(row)));
  } catch (err) {
    console.error('Add vocabulary error:', err);
    res.status(500).json(result.fail('Add vocabulary error: ' + err.message));
  }
};

exports.collectVocabulary = async (req, res) => {
  try {
    const { word, wrongSent = '', userId = '1' } = req.body;

    if (!word || !word.trim()) {
      return res.json(result.fail('Word is required'));
    }

    const uid = parseUserId(userId);
    const normalizedWord = word.trim().toLowerCase();

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
      return res.json(result.success({ ...mapRow(updated), isNew: false }));
    }

    const insertResult = await runQuery(
      'INSERT INTO wordbook (uid, word, phonetic, wrong_sent, count) VALUES (?, ?, ?, ?, 1)',
      [uid, normalizedWord, '', wrongSent]
    );

    const row = await getQuery('SELECT * FROM wordbook WHERE wid = ?', [
      insertResult.lastID,
    ]);

    res.json(result.success({ ...mapRow(row), isNew: true }));
  } catch (err) {
    console.error('Collect vocabulary error:', err);
    res.status(500).json(result.fail('Collect vocabulary error: ' + err.message));
  }
};

exports.deleteVocabulary = async (req, res) => {
  try {
    const { id } = req.params;
    const wid = parseInt(id, 10);

    if (Number.isNaN(wid)) {
      return res.json(result.fail('Invalid vocabulary id'));
    }

    const deleteResult = await runQuery('DELETE FROM wordbook WHERE wid = ?', [
      wid,
    ]);

    if (deleteResult.changes === 0) {
      return res.json(result.fail('Vocabulary not found'));
    }

    res.json(result.success({ id: wid, message: 'Vocabulary deleted' }));
  } catch (err) {
    console.error('Delete vocabulary error:', err);
    res.status(500).json(result.fail('Delete vocabulary error: ' + err.message));
  }
};

exports.getErrorStats = async (req, res) => {
  try {
    const { userId = '1' } = req.query;
    const uid = parseUserId(userId);

    const countRow = await getQuery(
      `SELECT COUNT(*) AS totalWords, COALESCE(SUM(count), 0) AS totalErrors
       FROM wordbook WHERE uid = ?`,
      [uid]
    );

    const topErrorWords = await allQuery(
      `SELECT word, count AS errors, phonetic
       FROM wordbook
       WHERE uid = ?
       ORDER BY count DESC
       LIMIT 5`,
      [uid]
    );

    res.json(
      result.success({
        totalWords: countRow?.totalWords || 0,
        totalErrors: countRow?.totalErrors || 0,
        topErrorWords: topErrorWords.map((item) => ({
          word: item.word,
          errors: item.errors,
          phonetic: item.phonetic || '',
        })),
      })
    );
  } catch (err) {
    console.error('Error stats error:', err);
    res.status(500).json(result.fail('Error stats error: ' + err.message));
  }
};
