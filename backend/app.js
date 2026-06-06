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
app.use('/api/pronunciation', require('./routes/pronunciationRoute'));
const routes = require('./routes');
app.use('/api', routes);

// 异常中间件
app.use(errorMiddleware);

// 初始化数据库（建表）
initDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});