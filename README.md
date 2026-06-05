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

## 第三方依赖清单
### 后端
express：Web服务框架
cors：跨域处理
sqlite3：嵌入式数据库

### 前端
react、typescript、ant-design、axios、echarts

### 第三方API
ASR语音转写API、LLM对话API、英文发音评测API

## 目录说明
- frontend：前端React项目
- backend：Node后端服务
- docs：接口文档、项目设计文档

## 启动方式
# 后端启动
cd backend && npm install && node app.js

# 前端启动（待开发）
cd frontend && npm install && npm start

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