# SpeakMate-AI
AI English Oral Coach | 七牛云暑期实训·AI英语口语陪练全栈项目
## 项目简介
基于Web全栈实现AI实景口语练习，支持多场景对话、WebRTC录音、ASR语音转写、AI实时对话、发音打分、语法纠错、智能生词本、练习数据报表八大功能。
## 技术栈
前端：React + TypeScript + Ant Design + Axios + ECharts + WebRTC
后端：Node.js + Express + SQLite3
第三方服务：ASR语音识别API、LLM大模型对话接口、英文发音评测接口
## 目录说明
- frontend：前端React项目
- backend：Node后端服务
- docs：接口文档、项目设计文档
## 启动方式：后续开发完成补充详细步

## 项目迭代记录
### PR1 | 项目仓库初始化 feat/init-project
> PR标题：feat: init repo, create dir structure & base readme
1. **功能描述**：创建`frontend`前端、`backend`后端、`docs`文档三级工程目录；编写项目首版README，明确产品定位、全栈技术栈、目录释义，搭建项目基础文档框架。
2. **实现思路**：前后端代码物理目录拆分隔离，遵循全栈项目工程化规范，便于后续按功能模块拆分PR迭代开发，避免代码耦合混乱。
3. **测试方式**：克隆远端项目仓库，本地目录结构完整无缺失，README文档可正常打开浏览，仓库基础配置可用。
4. **补充备注**：本阶段无任何第三方依赖包，后续开发新增的所有前端/后端依赖、第三方AI接口（ASR/LLM/发音评测），都会在README【第三方依赖清单】统一补充登记。