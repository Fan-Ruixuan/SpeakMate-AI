const express = require('express');
const cors = require('./middlewares/corsMid');
const errorMiddleware = require('./middlewares/errMid');
const { initDB } = require('./db/dbInit');
const routes = require('./routes');

const app = express();
const PORT = 3000;

// 中间件
app.use(express.json());
app.use(cors);

// 路由
app.use('/api', routes);
app.use('/api/user', require('./routes/userRoute'));
app.use('/api/scene', require('./routes/sceneRoute'));

// 全局异常
app.use(errorMiddleware);

// 初始化数据库
initDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});