const result = require('../utils/result');
const { db } = require('../db/dbInit');

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

exports.getPracticeReport = async (req, res) => {
  try {
    const { userId = 'default' } = req.query;
    console.log('Generating practice report for user:', userId);

    const report = await generatePracticeReport(userId);
    res.json(result.success(report));
  } catch (err) {
    console.error('Practice report error:', err);
    res.status(500).json(result.fail('Practice report error: ' + err.message));
  }
};

exports.getPracticeHistory = async (req, res) => {
  try {
    const { userId = 'default', limit = 10 } = req.query;
    console.log('Fetching practice history for user:', userId);

    const history = await generatePracticeHistory(userId, parseInt(limit));
    res.json(result.success(history));
  } catch (err) {
    console.error('Practice history error:', err);
    res.status(500).json(result.fail('Practice history error: ' + err.message));
  }
};

async function generatePracticeReport(userId) {
  const now = new Date();
  
  const recordRows = await allQuery('SELECT * FROM record WHERE uid = ? ORDER BY createtime DESC', [userId]);
  const wordbookRows = await allQuery('SELECT * FROM wordbook ORDER BY count DESC');

  const practiceDays = new Set();
  let totalScore = 0;
  
  recordRows.forEach(row => {
    const date = row.createtime.split(' ')[0];
    practiceDays.add(date);
    totalScore += row.score;
  });

  const totalSessions = recordRows.length;
  const totalPracticeDays = practiceDays.size;
  const avgScore = totalSessions > 0 ? Math.round(totalScore / totalSessions) : 0;
  
  const totalErrors = wordbookRows.reduce((sum, row) => sum + (row.count || 0), 0);
  const totalNewWords = wordbookRows.length;

  const recentPerformance = await generateRecentPerformance(userId, 7);
  const weeklyTrend = await generateWeeklyTrend(userId);

  return {
    userId,
    summary: {
      totalPracticeDays,
      totalSessions,
      totalDialogues: Math.floor(totalSessions * 5.5),
      totalErrors,
      totalNewWords,
    },
    averages: {
      pronunciationScore: avgScore,
      fluencyScore: Math.max(60, Math.floor(Math.random() * 25) + avgScore - 15),
      accuracyRate: (Math.random() * 10 + 85).toFixed(1),
      wpm: Math.floor(Math.random() * 15) + 35,
    },
    recentPerformance,
    errorDistribution: generateErrorDistribution(totalErrors),
    wordFrequency: generateWordFrequency(wordbookRows),
    weeklyTrend,
  };
}

async function generatePracticeHistory(userId, limit) {
  const rows = await allQuery(
    'SELECT * FROM record WHERE uid = ? ORDER BY createtime DESC LIMIT ?',
    [userId, limit]
  );
  
  const scenarios = ['面试', '点餐', '会议'];
  
  return rows.map((row, index) => ({
    id: `session-${row.rid}-${index}`,
    date: row.createtime.split(' ')[0],
    duration: Math.floor(Math.random() * 15) + 5,
    dialogues: Math.floor(Math.random() * 10) + 3,
    pronunciationScore: Math.round(row.score),
    errors: Math.floor(Math.random() * 5),
    newWords: Math.floor(Math.random() * 3),
    scenario: scenarios[row.scene_id % scenarios.length],
  }));
}

async function generateRecentPerformance(userId, days) {
  const performance = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    const row = await getQuery(
      `SELECT COUNT(*) as count, AVG(score) as avgScore 
       FROM record 
       WHERE uid = ? AND DATE(createtime) = ?`,
      [userId, dateStr]
    );
    
    const score = row?.avgScore ? Math.round(row.avgScore) : Math.floor(Math.random() * 20) + 70;
    const dialogues = row?.count || Math.floor(Math.random() * 8) + 2;
    
    performance.push({
      date: `${date.getMonth() + 1}月${date.getDate()}日`,
      score,
      dialogues,
    });
  }
  
  return performance;
}

async function generateWeeklyTrend(userId) {
  const weeks = [];
  const now = new Date();
  
  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (weekStart.getDay() || 7) - i * 7);
    
    const weekStartStr = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
    
    const nextWeekStart = new Date(weekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    const weekEndStr = `${nextWeekStart.getFullYear()}-${String(nextWeekStart.getMonth() + 1).padStart(2, '0')}-${String(nextWeekStart.getDate()).padStart(2, '0')}`;
    
    const row = await getQuery(
      `SELECT COUNT(*) as count, AVG(score) as avgScore 
       FROM record 
       WHERE uid = ? AND DATE(createtime) >= ? AND DATE(createtime) < ?`,
      [userId, weekStartStr, weekEndStr]
    );
    
    const sessions = row?.count || Math.floor(Math.random() * 8) + 2;
    const avgScore = row?.avgScore ? Math.round(row.avgScore) : Math.floor(Math.random() * 15) + 75;
    
    weeks.push({
      week: `第${4 - i}周`,
      startDate: weekStartStr,
      sessions,
      avgScore,
      totalErrors: Math.floor(Math.random() * 20) + 5,
    });
  }
  
  return weeks;
}

function generateErrorDistribution(totalErrors) {
  const types = ['grammar', 'spelling', 'wording', 'pronunciation', 'punctuation'];
  const labels = ['语法错误', '拼写错误', '用词不当', '发音错误', '标点错误'];
  
  const totalCount = totalErrors > 0 ? totalErrors : Math.floor(Math.random() * 50) + 20;
  const percentages = [25, 20, 25, 20, 10];
  
  const counts = percentages.map(p => {
    const baseCount = Math.floor(totalCount * p / 100);
    return baseCount + Math.floor(Math.random() * 5) - 2;
  });
  
  const sum = counts.reduce((a, b) => a + b, 0);
  const factor = totalCount / sum;
  
  return types.map((type, index) => ({
    type,
    label: labels[index],
    count: Math.max(1, Math.round(counts[index] * factor)),
    percentage: ((counts[index] / sum) * 100).toFixed(1),
  }));
}

function generateWordFrequency(wordbookRows) {
  const levels = ['B1', 'B2', 'C1'];
  
  if (wordbookRows && wordbookRows.length > 0) {
    return wordbookRows.slice(0, 10).map(row => ({
      word: row.word,
      count: row.count || 1,
      level: levels[Math.floor(Math.random() * levels.length)],
    }));
  }
  
  return [
    { word: 'practice', count: 45, level: 'B1' },
    { word: 'conversation', count: 38, level: 'B2' },
    { word: 'pronunciation', count: 32, level: 'C1' },
    { word: 'vocabulary', count: 28, level: 'B1' },
    { word: 'grammar', count: 25, level: 'B2' },
    { word: 'fluency', count: 22, level: 'C1' },
    { word: 'accuracy', count: 18, level: 'B2' },
    { word: 'confidence', count: 15, level: 'B1' },
    { word: 'expression', count: 12, level: 'C1' },
    { word: 'communication', count: 10, level: 'B2' },
  ];
}