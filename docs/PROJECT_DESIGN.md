# SpeakMate AI - 项目设计文档

## 1. 项目概述

### 1.1 项目简介

SpeakMate AI 是一款面向英语口语学习者的智能练习辅助系统，通过语音识别、发音评测和语法纠错等功能，帮助用户提升英语口语能力。

### 1.2 核心功能

| 功能模块 | 功能描述 |
|---------|---------|
| 用户管理 | 用户注册、登录 |
| 场景练习 | 提供多种口语练习场景（面试、点餐、会议等）|
| 语音识别 | 将用户语音转换为文字（ASR）|
| 发音评测 | 评估发音准确度、流利度、完整度 |
| 语法纠错 | 检测并纠正语法错误，提供改进建议 |
| 练习报告 | 展示学习进度、趋势分析、错误统计 |
| 生词本 | 管理学习过程中遇到的生词，自动收集错误词汇 |

### 1.3 技术栈

| 分类 | 技术 | 版本 |
|-----|------|-----|
| 前端框架 | React | 18.x |
| 前端语言 | TypeScript | 5.x |
| 构建工具 | Vite | 6.x |
| UI组件 | Ant Design | 5.x |
| 图表库 | ECharts | 5.x |
| 后端框架 | Express.js | 4.x |
| 数据库 | SQLite | 3.x |
| 文件上传 | Multer | - |

---

## 2. 架构设计

### 2.1 系统架构图

```
┌─────────────────────────────────────────────────────────────────────┐
│                        前端层 (Frontend)                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │  登录/注册   │  │  练习页面   │  │  报告页面   │  │  生词本     │ │
│  │ LoginPage   │  │ ChatPanel   │  │PracticeReport│  │Vocabulary  │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘ │
│         │                │                │                 │       │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐ │
│  │ 麦克风组件  │  │ 语法提示组件 │  │ 成绩弹窗    │  │ 词汇管理    │ │
│  │ Microphone  │  │GrammarTooltip│  │Pronunciation│  │WordManager │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘ │
└─────────┼────────────────┼────────────────┼─────────────────┼───────┘
          │                │                │                 │
┌─────────▼────────────────▼────────────────▼─────────────────▼───────┐
│                    Vite 开发服务器代理                               │
│         /api/*  →  http://localhost:3000/api/*                      │
└─────────────────────────────────────────────────────────────────────┘
          │                │                │                 │
┌─────────▼────────────────▼────────────────▼─────────────────▼───────┐
│                        后端层 (Backend)                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ ASR控制器   │  │ 发音控制器  │  │ 语法控制器  │  │ 词汇控制器   │ │
│  │ asrController│ │pronunciation│  │grammar      │  │vocabulary   │ │
│  └─────────────┘  │Controller   │  │Controller   │  │Controller   │ │
│                   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘ │
│  ┌─────────────┐         │                │                 │       │
│  │报告控制器   │  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐ │
│  │practice     │  │ 场景控制器  │  │ 用户控制器  │  │ 词汇服务    │ │
│  │Report       │  │scene        │  │user         │  │vocabulary   │ │
│  │Controller   │  │Controller   │  │Controller   │  │Service      │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                                    │
│  ┌─────────────┐                                                   │
│  │ 用户服务    │                                                   │
│  │userService │                                                   │
│  └─────────────┘                                                   │
└─────────────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────────┐
│                        数据层 (Database)                            │
│              ┌───────────────────────────────┐                      │
│              │     SQLite Database (data.db) │                      │
│              │  user | scene | record |      │                      │
│              │  wordbook                     │                      │
│              └───────────────────────────────┘                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 目录结构

```
SpeakMate-AI/
├── backend/                         # 后端代码
│   ├── controllers/                  # 控制器层
│   │   ├── asrController.js         # 语音识别控制器
│   │   ├── grammarController.js      # 语法纠错控制器
│   │   ├── practiceReportController.js # 练习报告控制器
│   │   ├── pronunciationController.js # 发音评测控制器
│   │   ├── sceneController.js       # 场景控制器
│   │   ├── userController.js        # 用户控制器
│   │   └── vocabularyController.js  # 词汇控制器
│   ├── services/                     # 服务层
│   │   ├── userService.js           # 用户服务
│   │   └── vocabularyService.js     # 词汇服务
│   ├── models/                       # 数据模型层
│   │   ├── sceneModel.js            # 场景模型
│   │   └── userModel.js             # 用户模型
│   ├── routes/                       # 路由配置
│   │   ├── asrRoute.js              # ASR路由
│   │   ├── grammarRoute.js           # 语法路由
│   │   ├── index.js                 # 路由汇总
│   │   ├── practiceReportRoute.js   # 报告路由
│   │   ├── pronunciationRoute.js     # 发音路由
│   │   ├── sceneRoute.js             # 场景路由
│   │   ├── userRoute.js             # 用户路由
│   │   └── vocabularyRoute.js        # 词汇路由
│   ├── middlewares/                   # 中间件
│   │   ├── corsMid.js               # CORS跨域中间件
│   │   └── errMid.js                # 错误处理中间件
│   ├── db/                           # 数据库
│   │   ├── data.db                  # SQLite数据库文件
│   │   └── dbInit.js                # 数据库初始化
│   ├── utils/                        # 工具函数
│   │   └── result.js                # 统一响应格式
│   ├── app.js                        # 应用入口
│   └── package.json                  # 依赖配置
├── frontend/                         # 前端代码
│   ├── src/
│   │   ├── components/               # 通用组件
│   │   │   ├── ChatPanel.tsx       # 聊天面板
│   │   │   ├── GrammarTooltip.tsx   # 语法提示
│   │   │   ├── Microphone.tsx       # 麦克风录音
│   │   │   └── PronunciationScorePopup.tsx # 发音成绩弹窗
│   │   ├── pages/                   # 页面组件
│   │   │   ├── HomePage.tsx        # 首页
│   │   │   ├── LoginPage.tsx        # 登录注册页
│   │   │   ├── PracticeReport.tsx   # 练习报告
│   │   │   └── VocabularyPage.tsx  # 生词本页面
│   │   ├── api/                     # API封装
│   │   │   ├── grammar.ts           # 语法API
│   │   │   ├── pronunciation.ts     # 发音API
│   │   │   ├── scene.ts             # 场景API
│   │   │   ├── user.ts             # 用户API
│   │   │   └── vocabulary.ts       # 词汇API
│   │   ├── router/                  # 路由配置
│   │   │   └── index.tsx           # 路由定义
│   │   ├── types/                   # TypeScript类型定义
│   │   │   └── api.ts              # API类型定义
│   │   ├── utils/                   # 工具函数
│   │   │   └── request.ts         # Axios封装
│   │   ├── App.tsx                 # 根组件
│   │   └── main.tsx                # 入口文件
│   ├── index.html                   # HTML入口
│   ├── vite.config.ts              # Vite配置
│   └── package.json                 # 依赖配置
└── docs/                            # 项目文档
    ├── API_DOCUMENTATION.md         # API接口文档
    ├── DEVELOPMENT_GUIDE.md        # 开发说明文档
    └── PROJECT_DESIGN.md           # 项目设计文档
```

---

## 3. 数据库设计

### 3.1 数据库初始化

数据库使用 SQLite，在后端启动时自动创建表结构。

**初始化文件**: `backend/db/dbInit.js`

### 3.2 数据库表结构

#### 3.2.1 user 表（用户表）

| 字段名 | 类型 | 约束 | 说明 |
|-------|------|-----|------|
| uid | INTEGER | PRIMARY KEY AUTOINCREMENT | 用户ID，自增主键 |
| username | TEXT | UNIQUE NOT NULL | 用户名，唯一 |
| pwd | TEXT | NOT NULL | 密码 |
| createtime | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**SQL定义**:
```sql
CREATE TABLE IF NOT EXISTS user (
  uid INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  pwd TEXT NOT NULL,
  createtime DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### 3.2.2 scene 表（场景表）

| 字段名 | 类型 | 约束 | 说明 |
|-------|------|-----|------|
| sid | INTEGER | PRIMARY KEY AUTOINCREMENT | 场景ID，自增主键 |
| scene_name | TEXT | NOT NULL | 场景名称 |
| prompt | TEXT | NOT NULL | 场景提示内容 |

**SQL定义**:
```sql
CREATE TABLE IF NOT EXISTS scene (
  sid INTEGER PRIMARY KEY AUTOINCREMENT,
  scene_name TEXT NOT NULL,
  prompt TEXT NOT NULL
)
```

#### 3.2.3 record 表（练习记录表）

| 字段名 | 类型 | 约束 | 说明 |
|-------|------|-----|------|
| rid | INTEGER | PRIMARY KEY AUTOINCREMENT | 记录ID，自增主键 |
| uid | INTEGER | | 用户ID |
| scene_id | INTEGER | | 场景ID |
| score | REAL | | 练习得分 |
| createtime | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**SQL定义**:
```sql
CREATE TABLE IF NOT EXISTS record (
  rid INTEGER PRIMARY KEY AUTOINCREMENT,
  uid INTEGER,
  scene_id INTEGER,
  score REAL,
  createtime DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### 3.2.4 wordbook 表（生词本表）

| 字段名 | 类型 | 约束 | 说明 |
|-------|------|-----|------|
| wid | INTEGER | PRIMARY KEY AUTOINCREMENT | 生词ID，自增主键 |
| uid | INTEGER | | 用户ID |
| word | TEXT | | 单词 |
| phonetic | TEXT | | 音标 |
| wrong_sent | TEXT | | 错误句子 |
| count | INTEGER | DEFAULT 1 | 错误次数 |
| add_time | DATETIME | DEFAULT CURRENT_TIMESTAMP | 添加时间 |

**SQL定义**:
```sql
CREATE TABLE IF NOT EXISTS wordbook (
  wid INTEGER PRIMARY KEY AUTOINCREMENT,
  uid INTEGER,
  word TEXT,
  phonetic TEXT,
  wrong_sent TEXT,
  count INTEGER DEFAULT 1,
  add_time DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### 3.3 数据库关系图

```
┌─────────────┐         ┌─────────────┐
│    user     │         │   scene    │
├─────────────┤         ├─────────────┤
│ uid (PK)    │◄───────┐│ sid (PK)    │
│ username    │        │ │ scene_name │
│ pwd         │        │ │ prompt     │
│ createtime  │        │ └─────────────┘
└─────────────┘        │       ▲
        │               │       │
        │               │       │
        ▼               │       │
┌─────────────┐         │       │
│   record    │         │       │
├─────────────┤         │       │
│ rid (PK)    │         │       │
│ uid (FK)────┼─────────┘       │
│ scene_id(FK)┼──────────────►─┘
│ score       │
│ createtime  │
└─────────────┘

┌─────────────┐
│  wordbook   │
├─────────────┤
│ wid (PK)    │
│ uid (FK)────┼─────► user.uid
│ word        │
│ phonetic    │
│ wrong_sent  │
│ count       │
│ add_time    │
└─────────────┘
```

---

## 4. 核心功能实现

### 4.1 语音识别（ASR）

**路由**: `POST /api/asr/recognize`

**流程**:
1. 接收前端上传的音频文件（webm格式）
2. 使用 Multer 中间件处理文件上传
3. 返回识别结果

**控制器**: `backend/controllers/asrController.js`

### 4.2 发音评测

**路由**: `POST /api/pronunciation/evaluate`

**流程**:
1. 接收音频文件和参考文本
2. 使用正则表达式模拟音素错误检测
3. 计算总分、流利度、准确度、完整度
4. 生成音素错误列表和改进建议

**控制器**: `backend/controllers/pronunciationController.js`

### 4.3 语法纠错

**路由**: `POST /api/grammar/correct`

**支持的错误类型**:
- grammar: 语法错误（如主谓一致、第三人称单数）
- spelling: 拼写错误（如 receive 的 i/e 顺序）
- wording: 用词不当（如 very good → excellent）
- punctuation: 标点错误（如空格+句号）

**控制器**: `backend/controllers/grammarController.js`

### 4.4 练习报告

**路由**: `GET /api/report`

**报告内容**:
- summary: 练习概览（天数、会话数、对话数、错误数、生词数）
- averages: 平均指标（发音、流利度、准确率、WPM）
- recentPerformance: 近7天表现趋势
- errorDistribution: 错误类型分布
- wordFrequency: 高频生词
- weeklyTrend: 周趋势分析

**控制器**: `backend/controllers/practiceReportController.js`

### 4.5 生词本

**路由**:
- `GET /api/vocabulary` - 获取词汇列表
- `POST /api/vocabulary` - 添加词汇
- `DELETE /api/vocabulary/:id` - 删除词汇
- `POST /api/vocabulary/collect` - 收藏词汇（自动+1）
- `GET /api/vocabulary/stats` - 获取统计信息

**特性**:
- 自动收集语法纠错中的错误词汇
- 记录错误次数和错误句子
- 支持分页查询

**控制器**: `backend/controllers/vocabularyController.js`

---

## 5. 安全设计

### 5.1 CORS 跨域配置

**文件**: `backend/middlewares/corsMid.js`

```javascript
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
res.header('Access-Control-Allow-Headers', 'Content-Type');
```

### 5.2 输入验证

- 所有接口必填参数进行空值检查
- 词汇添加检查重复（单词已存在返回错误）
- ID参数进行类型转换和NaN检查
- SQL注入防护（使用参数化查询）

### 5.3 错误处理

- 全局错误中间件捕获异常
- 统一错误响应格式 `{ code, msg, data }`
- 控制台详细错误日志记录
- 避免敏感信息泄露

---

## 6. 前端代理配置

**文件**: `frontend/vite.config.ts`

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

**环境变量**: `frontend/.env.development`

```
VITE_API_BASE_URL=http://localhost:3000
```

---

## 7. 代码规范

### 7.1 命名规范

| 类型 | 规范 | 示例 |
|-----|------|-----|
| 文件命名 | 小写字母 + 连字符 | `practice-report.tsx` |
| 变量命名 | 驼峰命名法 | `userName`, `isRecording` |
| 函数命名 | 驼峰命名法 | `getUserInfo`, `handleSubmit` |
| 类命名 | 帕斯卡命名法 | `UserService`, `Microphone` |
| 常量命名 | 全大写 + 下划线 | `MAX_RETRY`, `API_BASE_URL` |
| 数据库表名单数 | 小写 | `user`, `record`, `wordbook` |

### 7.2 代码风格

- 使用 2 空格缩进
- 语句结尾必须加分号
- 花括号 `{` 与语句同行
- 每行代码不超过 120 字符

### 7.3 API 响应格式

**成功响应**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {}
}
```

**错误响应**:
```json
{
  "code": 500,
  "msg": "error message",
  "data": null
}
```

---

## 8. 版本历史

| 版本 | 日期 | 说明 |
|-----|------|-----|
| v1.0.0 | 2026-06 | 初始版本，完成核心功能 |
