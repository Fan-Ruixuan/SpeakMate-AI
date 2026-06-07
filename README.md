# SpeakMate-AI
AI English Oral Coach | 七牛云暑期实训·AI英语口语陪练全栈项目

## 文档目录
1. [项目DEMO视频链接](#项目demo视频链接)
2. [完整开发迭代PR记录](#完整开发迭代pr记录)
3. [项目简介](#项目简介)
4. [演示账号信息](#演示账号信息)
5. [典型场景模拟演示用例](#典型场景模拟演示用例)
6. [技术栈](#技术栈)
7. [前置环境要求](#前置环境要求)
8. [第三方依赖清单](#第三方依赖清单)
9. [工程目录说明](#工程目录说明)
10. [启动方式](#启动方式)
11. [项目迭代记录](#项目迭代记录--简化版易懂)

## 项目DEMO视频链接
https://www.bilibili.com/video/BV1j6Et6sEnF/

## 完整开发迭代PR记录
https://github.com/Fan-Ruixuan/SpeakMate-AI/pulls?q=is%3Apr+is%3Aclosed

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

> 工程设计说明：本项目以**前端工程化、组件设计、前后端联调、数据流转**为核心实践目标。语音识别、对话应答、语法纠错模块采用**轻量化模拟方案**（正则匹配+固定模板）完成全链路演示，保证整体流程完整可运行，聚焦展示分层架构、接口封装、组件复用、状态管理与数据联动能力。

## 演示账号信息
测试账号：wang
登录密码：123456

说明：本账号为固定演示账号，可完整体验对话交互、语音录音、发音评测、语法纠错、数据可视化、生词本全部模块。语音录音可正常调用浏览器麦克风权限，录音反馈、文字对话回复、语法纠错均为预设典型场景演示，整套交互逻辑、界面组件、数据同步逻辑均自主开发实现。

## 典型场景模拟演示用例
### 对话回复
1. 用户文字输入信息
   用户（右侧蓝色气泡）--> 自定义输入内容
   机器人（左侧白色气泡）--> 返回固定模板：`You typed: [输入内容]. This is a great practice!`

2. 用户录音输入
   用户侧自动展示固定转写文本：`Hello, this is standard ASR output`
   机器人 --> 返回固定模板：`I understand you said: "Hello, this is standard ASR output". Would you like to practice more?`

### 语法纠错
1. 语法错误： i am very happy
2. 拼写错误： recieve
3. 用词不当： very good job
4. 标点错误： wow .
5. 错误组合： i recieve very good .

## 技术栈
前端：React + TypeScript + Ant Design + Axios + ECharts + WebRTC
后端：Node.js + Express + SQLite3
第三方服务：ASR语音识别API、LLM大模型对话接口、英文发音评测接口

## 前置环境要求
项目运行统一环境标准，规避版本兼容问题
Node.js ≥ 16.14.0（前后端共用运行环境）
npm ≥ 8.5.0

## 第三方依赖清单
### 后端依赖
- express：Web 服务框架，搭建 HTTP 接口服务
- cors：跨域资源共享处理
- sqlite3：嵌入式轻量数据库，数据持久化
- multer：处理音频文件上传请求

### 前端
react、typescript、antd、axios、echarts、react-router-dom

### 第三方API
ASR语音转写API、LLM对话API、英文发音评测API

> 说明：本项目基于以上开源框架与第三方API搭建基础能力，页面组件、业务逻辑、交互逻辑、数据联动、错误检测规则均为自主开发实现。

## 工程目录说明
- frontend：前端 React + TS 工程
  - .env.development：开发环境接口地址配置，纳入版本管控
- backend：Node.js 后端服务工程
  - data.db：SQLite 自动生成本地数据库文件
- docs：
  - API_DOCUMENTATION.md  接口文档：包含所有后端接口的详细说明、异常接口与问题修复记录。
  - PROJECT_DESIGN.md  项目设计文档：对项目架构、模块设计、数据库设计等进行详细说明。
  - DEVELOPMENT_GUIDE.md  开发说明：涵盖环境搭建、项目启动、代码规范、Git版本流程、调试与部署指南。

## 启动方式
### 后端启动
cd backend 
npm install
node app.js
- 后端默认监听：http://localhost:3000
- 首次启用自动生成 data.db 数据库文件

### 前端启动
cd frontend
npm install
npm run dev
- 前端默认访问：http://localhost:5173
- 接口默认自动指向后端 3000 端口

## 项目迭代记录--简化版易懂
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

### PR7 | 音频上传与ASR语音转写全链路 feat/frontend-asr-upload
> PR标题：feat: upload audio and access ASR transcription
1. **功能描述**：打通录音文件上传与ASR识别完整链路，修复跨域、录音卡死、接口命名不一致等历史问题。
2. **实现思路**：使用原生Fetch上传音频，multer处理文件，规范编码并增加超时容错。
3. **测试方式**：前后端启动后录音可正常识别，多次连续录音无卡死，TS校验无告警。
4. **补充**：统一前后端音频接口命名，LLM场景对话逻辑整合至PR8聊天面板。


### PR8 | 前端聊天对话面板 feat/frontend-chat-panel
> PR标题：feat: frontend chat message panel
1. **功能描述**：实现区分用户与AI的对话气泡布局，支持文本、录音两种消息输入，展示PR7输出的ASR识别文本，并模拟渲染AI对话对话回复内容。
2. **实现思路**：React状态管理对话列表，useRef实现滚动到底，差异化气泡样式区分消息方。
3. **测试方式**：输入消息回车发送，消息正常渲染，列表自动滚动至最新内容。
4. **补充**：承接PR7音频识别结果，仅前端模拟LLM对话交互、无后端改动，整合LLM场景对话逻辑，为后续评测、纠错提供展示载体。

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

### PR14 | 前端练习报告 + ECharts 可视化 feat/frontend-practice-echarts-dashboard
> PR标题：feat: frontend practice report dashboard with ECharts
1. **功能描述**：前端展示练习报告，使用 ECharts 实现折线图、柱状图、饼图等可视化图表，展示历史练习记录、分数趋势、错误统计。
2. **实现思路**：创建 PracticeReport 页面组件，对接后端 /api/report API；使用 echarts 初始化折线图（最近7天趋势）、柱状图（周趋势）、饼图（错误分布）。
3. **测试方式**：访问 /report 页面，验证汇总数据卡片、3个图表正常渲染，数据与后端接口一致。
4. **补充**：修复路由注册问题，添加 /report 路由；图表支持响应式自适应窗口大小。

### PR15 | 智能生词本 + 全项目收尾优化 feat/full-vocabulary-book-module
> PR标题：feat: full vocabulary book module & chore: overall optimization and bug fix
1. **功能描述**：
  (1)核心功能：
     - 实现智能生词本模块，支持纠错自动归集生词、手动增删、高频词汇统计；
  (2)收尾优化（chore 细节打磨）：
     - 优化发音评测逻辑，清理冗余路由；
     - 整改语法提示组件，消除重复内容；
     - 修复纠错卡片错误数量与建议不匹配问题，新增卡片展开 / 收起交互；
     - 修复 ECharts 折线图数据点位与数值错位问题；
     - 补全测评报告模块数据联动，完成全模块数据同步；
     - 统一交互样式、修复各类细节 UI 与逻辑问题。
2. **实现思路**
  (1)生词本：后端多接口联动，语法纠错逻辑自动调用生词归集能力；前端封装列表、弹窗、统计卡片组件；
  (2)优化项：针对线上体验问题迭代，统一全局数据联动规则，保证页面、图表、报表数据完全同步，优化交互体验与界面细节。
3. **测试方式**
  (1)生词本：页面访问、生词自动收集、手动操作功能正常；
  (2)优化项：所有交互、图表、卡片、数据联动运行正常，无错位、重复、逻辑异常问题。
4. **补充**
  修复 Ant Design 组件废弃属性告警；
  首页统一补充生词本、练习报告导航入口；
  本次迭代完成项目全部功能开发、Bug 修复、体验优化与数据联调，项目整体闭环。

