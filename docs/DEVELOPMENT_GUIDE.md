# SpeakMate AI - 开发说明文档

## 目录

1. [开发环境搭建](#1-开发环境搭建)
2. [项目运行](#2-项目运行)
3. [代码规范](#3-代码规范)
4. [开发流程](#4-开发流程)
5. [调试技巧](#5-调试技巧)
6. [常见问题](#6-常见问题)
7. [数据库操作](#7-数据库操作)
8. [部署指南](#8-部署指南)

---

## 1. 开发环境搭建

### 1.1 系统要求

| 依赖 | 版本要求 | 说明 |
|-----|---------|------|
| Node.js | >= 18.x | 运行环境 |
| npm | >= 9.x | 包管理器 |
| Git | >= 2.x | 版本控制 |

### 1.2 安装步骤

#### 1.2.1 安装 Node.js

**Windows 用户**：
- 访问 [Node.js 官网](https://nodejs.org/) 下载 LTS 版本
- 运行安装程序，勾选 "Add to PATH"

**验证安装**：
```bash
node -v   # 应显示 v18.x.x 或更高版本
npm -v    # 应显示 9.x.x 或更高版本
```

#### 1.2.2 克隆项目

```bash
git clone <repository-url>
cd SpeakMate-AI
```

#### 1.2.3 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

---

## 2. 项目运行

### 2.1 启动后端服务

```bash
cd backend
node app.js
```

**预期输出**：
```
Pronunciation routes registered: [
  { path: '/test', methods: [Object: null prototype] { get: true } },
  { path: '/evaluate', methods: [Object: null prototype] { post: true } }
]
Grammar routes registered: [...]
Practice report routes registered: [...]
Vocabulary routes registered: [...]
ASR routes registered: [...]
数据库初始化完成
Server running on http://localhost:3000
```

### 2.2 启动前端开发服务器

```bash
cd frontend
npm run dev
```

**预期输出**：
```
VITE v6.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 2.3 访问应用

打开浏览器访问 `http://localhost:5173`

---

## 3. 代码规范

### 3.1 命名规范

| 类型 | 规范 | 示例 |
|-----|------|-----|
| 文件命名 | 小写字母 + 连字符 | `practice-report.tsx` |
| 变量命名 | 驼峰命名法 | `userName`, `isRecording` |
| 函数命名 | 驼峰命名法 | `getUserInfo`, `handleSubmit` |
| 类命名 | 帕斯卡命名法 | `UserService`, `Microphone` |
| 常量命名 | 全大写 + 下划线 | `MAX_RETRY`, `API_BASE_URL` |
| 数据库表名单数 | 小写 | `user`, `record`, `wordbook` |

### 3.2 API 响应规范

所有接口统一响应格式：

**成功响应**：
```json
{
  "code": 200,
  "msg": "success",
  "data": {}
}
```

**错误响应**：
```json
{
  "code": 500,
  "msg": "error message",
  "data": null
}
```

**工具函数**：`backend/utils/result.js`
```javascript
const success = (data, msg = 'success') => ({ code: 200, msg, data });
const fail = (msg, data = null) => ({ code: 500, msg, data });
```

### 3.3 数据库查询规范

**使用 Promise 封装数据库操作**：

```javascript
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
```

### 3.4 文件上传规范

使用 Multer 处理文件上传：

```javascript
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('audio'), controller.handler);
```

---

## 4. 开发流程

### 4.1 分支管理

| 分支 | 用途 |
|-----|------|
| main | 主分支，稳定版本 |
| develop | 开发分支，集成所有功能 |
| feature/* | 功能分支，开发新功能 |
| bugfix/* | 修复分支，修复 Bug |

### 4.2 开发步骤

1. **创建功能分支**：
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **开发功能**：
   - 修改代码
   - 添加测试（如果需要）
   - 确保 ESLint 检查通过

3. **提交代码**：
   ```bash
   git add .
   git commit -m "feat: 添加新功能描述"
   ```

4. **推送分支**：
   ```bash
   git push origin feature/my-new-feature
   ```

5. **创建 Pull Request**：
   - 将 feature 分支合并到 develop 分支
   - 等待代码审查

### 4.3 Git 提交规范

| 类型 | 说明 |
|-----|------|
| feat | 新增功能 |
| fix | 修复 Bug |
| docs | 文档更新 |
| style | 代码格式调整 |
| refactor | 代码重构 |
| test | 测试相关 |
| chore | 构建/工具更新 |

**示例**：
```bash
git commit -m "feat: 添加语音识别功能"
git commit -m "fix: 修复发音评测接口错误"
git commit -m "docs: 更新 API 文档"
```

---

## 5. 调试技巧

### 5.1 后端调试

#### 5.1.1 查看服务器日志

服务器启动后会输出路由注册信息和请求日志：
```bash
Server running on http://localhost:3000
Generating practice report for user: default
```

#### 5.1.2 添加调试日志

在控制器中添加 `console.log`：
```javascript
async function generatePracticeReport(userId) {
  console.log('DEBUG - userId:', userId);
  // ...
}
```

#### 5.1.3 使用 Postman 测试接口

1. 打开 Postman
2. 设置请求方法和 URL
3. 添加请求体（如 JSON 或 Form Data）
4. 发送请求并查看响应

### 5.2 前端调试

#### 5.2.1 使用浏览器开发者工具

1. 按 `F12` 打开开发者工具
2. **Console** 面板：查看日志和错误
3. **Network** 面板：查看 API 请求和响应
4. **Sources** 面板：设置断点调试

#### 5.2.2 添加调试日志

```typescript
const fetchReport = async () => {
  console.log('Fetching report...');
  try {
    const res = await fetch('/api/report');
    console.log('Response:', res);
    // ...
  } catch (err) {
    console.error('Error:', err);
  }
};
```

### 5.3 数据库调试

#### 5.3.1 查看数据库内容

创建测试脚本 `test_db.js`：
```javascript
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/data.db');

db.all('SELECT * FROM record', (err, rows) => {
  console.log('Records:', rows);
  db.close();
});
```

运行：
```bash
node test_db.js
```

---

## 6. 常见问题

### 6.1 端口占用问题

**问题**：`Error: listen EADDRINUSE: address already in use :::3000`

**解决方案**：
```bash
# Windows
netstat -ano | findstr "3000"
taskkill /F /PID <PID>

# 重启服务
node app.js
```

### 6.2 跨域问题

**问题**：`Access-Control-Allow-Origin` 错误

**解决方案**：
- 确保后端 `corsMid.js` 配置正确
- 确保前端使用相对路径调用 API（如 `/api/report` 而不是 `http://localhost:3000/api/report`）

### 6.3 音频录制问题

**问题**：麦克风权限被拒绝

**解决方案**：
1. 检查浏览器麦克风权限设置
2. 在 HTTPS 环境或 localhost 下测试
3. 使用 Chrome 浏览器（兼容性更好）

### 6.4 数据库连接问题

**问题**：数据库文件不存在

**解决方案**：
- 确保 `backend/db/data.db` 文件存在
- 运行 `node app.js` 会自动初始化数据库

### 6.5 路由未注册问题

**问题**：请求返回 404

**解决方案**：
- 检查 `backend/app.js` 中是否正确注册了路由
- 确保路由注册顺序正确
- 查看服务器启动日志确认路由已注册

---

## 7. 数据库操作

### 7.1 数据库初始化

启动后端服务时会自动执行 `initDB()` 函数，创建必要的表：
- `user` - 用户表
- `scene` - 场景表
- `record` - 练习记录表
- `wordbook` - 生词本表

### 7.2 手动执行 SQL

```bash
# 进入 SQLite 命令行
sqlite3 backend/db/data.db

# 查看所有表
.tables

# 查询数据
SELECT * FROM record;

# 退出
.quit
```

### 7.3 数据备份

```bash
# 备份数据库
sqlite3 backend/db/data.db ".backup backup.db"

# 恢复数据库
sqlite3 backend/db/data.db ".restore backup.db"
```

### 7.4 表结构

**user 表**：
```sql
CREATE TABLE user (
  uid INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  pwd TEXT NOT NULL,
  createtime DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

**record 表**：
```sql
CREATE TABLE record (
  rid INTEGER PRIMARY KEY AUTOINCREMENT,
  uid INTEGER,
  scene_id INTEGER,
  score REAL,
  createtime DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

**wordbook 表**：
```sql
CREATE TABLE wordbook (
  wid INTEGER PRIMARY KEY AUTOINCREMENT,
  uid INTEGER,
  word TEXT,
  phonetic TEXT,
  wrong_sent TEXT,
  count INTEGER DEFAULT 1,
  add_time DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

---

## 8. 部署指南

### 8.1 前端构建

```bash
cd frontend
npm run build
```

构建产物位于 `frontend/dist` 目录。

### 8.2 后端部署

```bash
# 使用 PM2 管理进程
npm install -g pm2

cd backend
pm2 start app.js --name speakmate-backend

# 查看日志
pm2 logs speakmate-backend

# 停止服务
pm2 stop speakmate-backend
```

### 8.3 Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 附录：API 快速参考

### 用户接口
- `POST /api/user/register` - 用户注册
- `POST /api/user/login` - 用户登录

### 场景接口
- `GET /api/scene/list` - 获取场景列表

### 发音接口
- `GET /api/pronunciation/test` - 测试接口
- `POST /api/pronunciation/evaluate` - 发音评测

### 语法接口
- `POST /api/grammar/correct` - 语法纠错

### ASR 接口
- `POST /api/asr/recognize` - 语音识别

### 报告接口
- `GET /api/report` - 获取练习报告
- `GET /api/report/history` - 获取练习历史

### 词汇接口
- `GET /api/vocabulary` - 获取词汇列表
- `POST /api/vocabulary` - 添加词汇
- `DELETE /api/vocabulary/:id` - 删除词汇
- `POST /api/vocabulary/collect` - 收藏词汇
- `GET /api/vocabulary/stats` - 获取词汇统计

---

## 附录：常用命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev          # 前端
node app.js          # 后端

# 生产构建
npm run build        # 前端

# PM2 管理
pm2 start app.js     # 启动
pm2 stop all         # 停止所有
pm2 restart all       # 重启所有
pm2 logs             # 查看日志
```
