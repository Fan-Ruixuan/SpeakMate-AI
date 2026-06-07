const result = require('../utils/result');

exports.getPracticeReport = async (req, res) => {
  try {
    const { userId = 'default' } = req.query;
    
    console.log('Generating practice report for user:', userId);

    const report = generatePracticeReport(userId);

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

    const history = generatePracticeHistory(userId, parseInt(limit));

    res.json(result.success(history));
  } catch (err) {
    console.error('Practice history error:', err);
    res.status(500).json(result.fail('Practice history error: ' + err.message));
  }
};

function generatePracticeReport(userId) {
  const totalPracticeDays = Math.floor(Math.random() * 30) + 5;
  const totalSessions = totalPracticeDays * (Math.floor(Math.random() * 3) + 1);
  const totalDialogues = totalSessions * (Math.floor(Math.random() * 10) + 5);
  
  return {
    userId,
    summary: {
      totalPracticeDays,
      totalSessions,
      totalDialogues,
      totalErrors: Math.floor(totalDialogues * 0.15),
      totalNewWords: Math.floor(totalDialogues * 0.08),
    },
    averages: {
      pronunciationScore: Math.floor(Math.random() * 20) + 75,
      fluencyScore: Math.floor(Math.random() * 25) + 70,
      accuracyRate: (Math.random() * 15 + 80).toFixed(1),
      wpm: Math.floor(Math.random() * 15) + 35,
    },
    recentPerformance: generateRecentPerformance(7),
    errorDistribution: generateErrorDistribution(),
    wordFrequency: generateWordFrequency(),
    weeklyTrend: generateWeeklyTrend(),
  };
}

function generatePracticeHistory(userId, limit) {
  const history = [];
  const now = new Date();
  
  for (let i = 0; i < limit; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    history.push({
      id: `session-${Date.now()}-${i}`,
      date: date.toISOString().split('T')[0],
      duration: Math.floor(Math.random() * 15) + 5,
      dialogues: Math.floor(Math.random() * 10) + 3,
      pronunciationScore: Math.floor(Math.random() * 20) + 70,
      errors: Math.floor(Math.random() * 5),
      newWords: Math.floor(Math.random() * 3),
      scenario: ['面试', '点餐', '会议'][Math.floor(Math.random() * 3)],
    });
  }
  
  return history;
}

function generateRecentPerformance(days) {
  const performance = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    performance.push({
      date: `${date.getMonth() + 1}月${date.getDate()}日`,
      score: Math.floor(Math.random() * 20) + 75,
      dialogues: Math.floor(Math.random() * 8) + 4,
    });
  }
  
  return performance;
}

function generateErrorDistribution() {
  const types = ['grammar', 'spelling', 'wording', 'pronunciation', 'punctuation'];
  const labels = ['语法错误', '拼写错误', '用词不当', '发音错误', '标点错误'];
  
  return types.map((type, index) => ({
    type,
    label: labels[index],
    count: Math.floor(Math.random() * 30) + 5,
    percentage: ((Math.random() * 20) + 10).toFixed(1),
  }));
}

function generateWordFrequency() {
  const words = [
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
  
  return words;
}

function generateWeeklyTrend() {
  const weeks = [];
  const now = new Date();
  
  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (weekStart.getDay() || 7) - i * 7);
    
    weeks.push({
      week: `第${4 - i}周`,
      startDate: weekStart.toISOString().split('T')[0],
      sessions: Math.floor(Math.random() * 8) + 5,
      avgScore: Math.floor(Math.random() * 15) + 75,
      totalErrors: Math.floor(Math.random() * 20) + 10,
    });
  }
  
  return weeks;
}