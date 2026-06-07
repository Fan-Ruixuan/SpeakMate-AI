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
const pronunciationRouter = require('./routes/pronunciationRoute');
app.use('/api/pronunciation', pronunciationRouter);
console.log('Pronunciation routes registered:', pronunciationRouter.stack.map(l => ({path: l.route?.path, methods: l.route?.methods})));

const grammarController = require('./controllers/grammarController');
const grammarRouter = express.Router();
grammarRouter.post('/correct', grammarController.correctGrammar);
app.use('/api/grammar', grammarRouter);
console.log('Grammar routes registered:', grammarRouter.stack.map(l => ({path: l.route?.path, methods: l.route?.methods})));

const practiceReportRouter = require('./routes/practiceReportRoute');
app.use('/api/report', practiceReportRouter);
console.log('Practice report routes registered:', practiceReportRouter.stack.map(l => ({path: l.route?.path, methods: l.route?.methods})));

const vocabularyRouter = require('./routes/vocabularyRoute');
app.use('/api/vocabulary', vocabularyRouter);
console.log('Vocabulary routes registered:', vocabularyRouter.stack.map(l => ({path: l.route?.path, methods: l.route?.methods})));

const routes = require('./routes');
app.use('/api', routes);

// 异常中间件
app.use(errorMiddleware);

// 初始化数据库（建表）
initDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});