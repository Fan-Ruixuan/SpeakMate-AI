# SpeakMate-AI
AI English Oral Coach | 七牛云暑期实训·AI英语口语陪练全栈项目

## 项目简介
基于Web全栈实现AI实景口语练习，八大核心功能：
1. 多场景AI对话：面试/点餐/会议三类实景角色对话
2. WebRTC麦克风实时录音
3. ASR语音转写：音频→英文文本
4. LLM大模型AI实时英文对话
5. 发音智能评测与打分
6. 实时语法纠错与用词优化
7. 智能生词本：自动归集易错词汇
8. 练习数据可视化报表与历史复盘

## 技术栈
前端：React + TypeScript + Ant Design + Axios + ECharts + WebRTC
后端：Node.js + Express + SQLite3
第三方服务：ASR语音识别API、LLM大模型对话接口、英文发音评测接口

## 前置环境要求
项目运行统一环境标准，规避版本异常
Node.js ≥ 16.14.0（前后端共用运行环境）
npm ≥ 8.5.0

## 第三方依赖清单
### 后端
express：Web服务框架
cors：跨域处理
sqlite3：嵌入式数据库

### 前端
react、typescript、antd、axios、echarts、react-router-dom

### 第三方API
ASR语音转写API、LLM对话API、英文发音评测API

## 目录说明
- frontend：前端React项目
  .env.development：前端开发环境接口配置（纳入版本管控）
- backend：Node后端服务
  data.db：SQLite 自动生成数据库文件
- docs：接口文档、项目设计文档

## 启动方式
### 后端启动
cd backend 
npm install
node app.js
- 后端默认监听：http://localhost:3000，自动生成 data.db 数据库文件

### 前端启动
cd frontend
npm install
npm run dev
- 前端默认访问：http://localhost:5173，接口自动指向后端 3000 端口

## 项目迭代记录
### PR1 | 项目仓库初始化 feat/init-project
> PR标题：feat: init repo, create dir structure & base readme
1. **功能描述**：创建frontend/backend/docs三级工程目录；编写基础README，明确产品定位、技术栈、目录结构。
2. **实现思路**：前后端目录隔离，遵循工程化规范，便于后续按模块迭代开发。
3. **测试方式**：克隆仓库后目录完整，README可正常查看。
4. **补充**：无第三方依赖。

### PR2 | 后端工程初始化 feat/backend-init
> PR标题：feat: backend init, db schema & global middleware
1. **功能描述**：初始化Node后端，安装依赖，搭建MVC架构，创建用户/场景/练习记录/生词本4张表，封装跨域与全局异常中间件。
2. **实现思路**：采用Controller-Service-Model分层，SQLite单文件数据库，轻量化、易部署。
3. **测试方式**：node app.js可正常启动，自动生成data.db，服务监听3000端口。
4. **补充**：新增依赖express、cors、sqlite3。

### PR3 | 前端工程初始化 feat/frontend-init
> PR标题：feat: frontend init vite+react+ts base project
1. **功能描述**：使用 Vite 初始化 React+TS 前端工程，搭建 src 目录结构，安装核心依赖，封装 axios 请求拦截。
2. **实现思路**：前后端分离架构，统一请求封装对接后端 3000 端口，路由模块化开发。
3. **测试方式**：进入 frontend 执行 npm run dev，5173 端口正常启动无报错。
4. **补充**：调整 gitignore 允许追踪 .env.development，更新 README 前端启动说明。

### PR4 | 登录与场景模块 feat/login-scene
> PR标题：feat: add user login and scene list API
1. **功能描述**：新增账号登录校验，登录后进入场景选择主页，自动加载全部口语练习场景数据。
2. **实现思路**：沿用项目已有的分层代码结构，复用现有登录相关后端能力，补充场景全套接口；前端配置页面路由，完成登录页、场景首页页面渲染与接口对接。
3. **测试方式**：启动前后端项目，输入账号密码可正常登录并跳转场景页，所有场景信息正常展示。
4. **补充**：无新增第三方包依赖，优化前端TS类型，修复页面代码报错。

### PR5 | ASR 语音转写接口 feat/asr-api
> PR标题：feat: backend ASR speech-to-text API encapsulation
1. **功能描述**：接收音频并完成英文语音转文本，返回标准格式识别结果。
2. **实现思路**：基于 MVC 架构，统一异常处理，对接第三方 ASR 服务。
3. **测试方式**：Postman 上传音频调用接口可正常返回文本。
4. **补充**：接入 ASR 语音识别 API，无数据库依赖。

### PR6 | 前端 WebRTC 麦克风录音组件 feat/frontend-mic-recorder
> PR标题：feat: frontend mic recording component (WebRTC)
1. **功能描述**：实现浏览器麦克风录音功能，生成标准音频文件供 ASR 接口使用；补全首页三大场景（面试/点餐/会议）渲染逻辑。
2. **实现思路**：使用原生 WebRTC MediaRecorder 音频采集，状态机管理录音状态，优化首页场景渲染。
3. **测试方式**：点击录音按钮可正常授权、启停录音，三大场景卡片正常展示。
4. **补充**：纯前端迭代，对接 PR5 ASR 接口。

### PR8 | 前端聊天对话面板 feat/frontend-chat-panel
> PR标题：feat: frontend chat message panel
1. **功能描述**：实现对话气泡布局，用户消息右侧蓝色，AI 消息左侧白色，支持文本和录音两种输入方式。
2. **实现思路**：React 状态管理对话列表，useRef 实现自动滚动，气泡圆角差异化设计。
3. **测试方式**：输入消息按 Enter 发送，消息正常显示，列表自动滚动到底部。
4. **补充**：纯前端迭代，后续对接发音评测和语法纠错能力。

### PR9 | 发音智能评测与打分 feat/backend-pronunciation-score-api
> PR标题：feat: backend pronunciation evaluation & scoring API
1. **功能描述**：实现发音评测功能，返回总分、流利度、准确度、完整度四维评分及改进建议；前端集成评测结果展示。
2. **实现思路**：后端 MVC 分层架构，multer 处理音频上传；前端封装 TypeScript 类型安全的评测 API。
3. **测试方式**：点击场景卡片选择练习内容，录音后自动触发评测，页面展示四维评分进度条。
4. **补充**：修复场景卡片点击无响应、评测结果完整度缺失等问题；新增依赖 multer。

### PR10 | 前端发音分数弹窗 feat/pronunciation-score-popup
> PR标题：feat: frontend pronunciation score popup
1. **功能描述**：录音完成后自动弹出评测结果弹窗，展示总分、分项得分、错误音标高亮及改进建议。
2. **实现思路**：使用 Ant Design Modal 构建弹窗，总分根据分数变色（绿色优秀/黄色良好/红色需改进），Progress 组件展示分项得分。
3. **测试方式**：选择场景，录音完成后自动弹出评测结果弹窗，展示总分、分项得分、错误音标高亮及改进建议。
4. **补充**：同步更新首页评测结果展示区域的错误音标样式；修复图标导入问题。

### PR11 | 后端语法与用词纠错接口 feat/grammar-correction-api
> PR标题：feat: backend grammar error correction & wording optimization
1. **功能描述**：对用户英文句子进行语法检查，返回错误类型（语法/拼写/用词/标点）与修改建议；前端在聊天面板自动展示纠错结果。
2. **实现思路**：后端 MVC 分层架构，正则表达式模拟错误检测，给出建议；前端封装 TypeScript 类型安全的评测 API。
3. **测试方式**：输入包含语法错误的英文（例："i am very happy"），发送后自动展示纠错结果卡片。
4. **补充**：修复后端路由注册问题；扩展 ChatMessage 类型支持 system 消息类型。

### PR12 | 前端纠错悬浮提示 feat/grammar-error-hover-tooltip
> PR标题：feat: frontend grammar error hover tooltip
1. **功能描述**：用户消息悬浮展示错误说明与优化建议，点击消息气泡右上角图标查看详细纠错信息。
2. **实现思路**：创建 GrammarTooltip 组件，使用 Ant Design Tooltip 实现悬浮提示，添加淡入动画效果。
3. **测试方式**：输入包含语法错误的英文，发送后消息气泡右上角显示红色警告图标，悬浮查看纠错详情。
4. **补充**：修复图标导入问题（AlertCircleOutlined 替换为 WarningOutlined）；添加逐项动画和悬停交互效果。

### PR13 | 后端练习报告统计接口 feat/practice-report-api
> PR标题：feat: backend practice report & statistics API
1. **功能描述**：提供练习报告统计接口，支持获取汇总数据（练习天数、会话数、对话数）、平均分、错误分布、词汇频率、周趋势等图表可用数据结构。
2. **实现思路**：创建 practiceReportController 控制器，封装 getPracticeReport 和 getPracticeHistory 方法，返回图表友好的结构化数据。
3. **测试方式**：访问 GET /api/report 返回完整练习报告；访问 GET /api/report/history?limit=5 返回练习历史记录。
4. **补充**：修复端口占用问题，确保服务正常启动；返回数据包含 summary、averages、recentPerformance、errorDistribution、wordFrequency、weeklyTrend 等字段。
