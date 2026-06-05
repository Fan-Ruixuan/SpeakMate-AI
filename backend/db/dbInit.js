const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(dbPath);

// 初始化四张表
function initDB() {
  db.serialize(() => {
    // 用户表
    db.run(`
      CREATE TABLE IF NOT EXISTS user (
        uid INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        pwd TEXT NOT NULL,
        createtime DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 场景表
    db.run(`
      CREATE TABLE IF NOT EXISTS scene (
        sid INTEGER PRIMARY KEY AUTOINCREMENT,
        scene_name TEXT NOT NULL,
        prompt TEXT NOT NULL
      )
    `);

    // 练习记录表
    db.run(`
      CREATE TABLE IF NOT EXISTS record (
        rid INTEGER PRIMARY KEY AUTOINCREMENT,
        uid INTEGER,
        scene_id INTEGER,
        score REAL,
        createtime DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 生词本
    db.run(`
      CREATE TABLE IF NOT EXISTS wordbook (
        wid INTEGER PRIMARY KEY AUTOINCREMENT,
        uid INTEGER,
        word TEXT,
        phonetic TEXT,
        wrong_sent TEXT,
        count INTEGER DEFAULT 1,
        add_time DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });

  console.log('数据库初始化完成');
}

module.exports = { db, initDB };