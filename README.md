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
> PR 标题：feat: frontend init vite+react+ts base project
1. 功能描述：使用 Vite 初始化 React+TS 前端工程，搭建 src 目录结构，安装核心依赖，封装 axios 请求拦截，配置开发环境变量。
2. 实现思路：前后端分离架构，统一请求封装对接后端 3000 端口，路由模块化开发。
3. 测试方式：进入 frontend 执行 npm run dev，5173 端口正常启动无报错。
4. 补充：调整 gitignore 允许追踪 .env.development，更新 README 前端启动说明。

### PR4 | 登录与场景模块 feat/login-scene
> PR标题：feat: add user login and scene list API
1. **功能描述**：新增账号登录校验，登录后进入场景选择主页，自动加载全部口语练习场景数据。
2. **实现思路**：沿用项目已有的分层代码结构，复用现有登录相关后端能力，补充场景全套接口；前端配置页面路由，完成登录页、场景首页页面渲染与接口对接。
3. **测试方式**：启动前后端项目，输入账号密码可正常登录并跳转场景页，所有场景信息正常展示。
4. **补充**：无新增第三方包依赖，优化前端TS类型，修复页面代码报错。