const express = require('express');
const cors = require('./middlewares/corsMid');
const errorMiddleware = require('./middlewares/errMid');
const { initDB } = require('./db/dbInit');

const app = express();
const PORT = 3000;

// 中间件
app.use(express.json());
app.use(cors);

// 路由顺序修复
app.use('/api/user', require('./routes/userRoute'));
app.use('/api/scene', require('./routes/sceneRoute'));

// 发音评测路由
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const pronunciationRouter = express.Router();
pronunciationRouter.get('/test', (req, res) => {
  console.log('Pronunciation test route hit');
  res.json({ code: 200, msg: 'test success' });
});
pronunciationRouter.post('/evaluate', upload.single('audio'), (req, res) => {
  const referenceText = req.body.referenceText;
  if (!referenceText) {
    return res.json({ code: 400, msg: 'Reference text is required' });
  }
  // 模拟发音评测
  const words = referenceText.toLowerCase().split(/\s+/);
  const totalScore = Math.floor(Math.random() * 30) + 70;
  const fluency = Math.floor(Math.random() * 20) + 80;
  const accuracy = Math.floor(Math.random() * 25) + 75;
  const phonemeErrors = [];
  for (let i = 0; i < Math.floor(Math.random() * 3); i++) {
    const word = words[Math.floor(Math.random() * words.length)] || 'word';
    phonemeErrors.push({ word, targetPhoneme: 'aeiou', actualPhoneme: 'ei', position: i + 1 });
  }
  const suggestion = totalScore >= 90 ? 'Excellent pronunciation!' : 
                     totalScore >= 80 ? 'Good job, practice more!' : 
                     'Keep practicing!';
  res.json({ 
    code: 200, 
    msg: 'success', 
    data: { 
      totalScore, 
      fluency, 
      accuracy,
      completeness: Math.min(100, Math.floor((words.length - phonemeErrors.length) / words.length * 100)),
      phonemeErrors, 
      suggestion, 
      referenceText 
    } 
  });
});
app.use('/api/pronunciation', pronunciationRouter);
console.log('Pronunciation routes registered:', pronunciationRouter.stack.map(l => ({path: l.route?.path, methods: l.route?.methods})));

const grammarController = require('./controllers/grammarController');
const grammarRouter = express.Router();
grammarRouter.post('/correct', grammarController.correctGrammar);
app.use('/api/grammar', grammarRouter);
console.log('Grammar routes registered:', grammarRouter.stack.map(l => ({path: l.route?.path, methods: l.route?.methods})));

const routes = require('./routes');
app.use('/api', routes);

// 异常中间件
app.use(errorMiddleware);

// 初始化数据库（建表）
initDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});