# SpeakMate AI - API 接口文档

## 目录

1. [基础信息](#1-基础信息)
2. [用户接口](#2-用户接口)
3. [场景接口](#3-场景接口)
4. [发音评测接口](#4-发音评测接口)
5. [语法纠错接口](#5-语法纠错接口)
6. [语音识别接口](#6-语音识别接口)
7. [练习报告接口](#7-练习报告接口)
8. [词汇接口](#8-词汇接口)
9. [异常接口与问题修复记录](#9-异常接口与问题修复记录)

---

## 1. 基础信息

### 1.1 服务地址

- **开发环境**: `http://localhost:3000`
- **API 前缀**: `/api`

### 1.2 响应格式

```json
{
  "code": 200,
  "msg": "success",
  "data": {}
}
```

| 字段 | 类型 | 说明 |
|-----|------|-----|
| code | Integer | 状态码，200 表示成功 |
| msg | String | 提示信息 |
| data | Object | 返回数据 |

### 1.3 错误码说明

| 错误码 | 说明 |
|-------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 500 | 服务器内部错误 |

---

## 2. 用户接口

### 2.1 用户注册

**请求**
- **URL**: `/api/user/register`
- **Method**: POST
- **Content-Type**: `application/json`

**请求体**
```json
{
  "username": "string (必填，用户名)",
  "pwd": "string (必填，密码)"
}
```

**响应**
```json
{
  "code": 200,
  "msg": "注册成功",
  "data": null
}
```

**错误响应**
```json
{
  "code": 500,
  "msg": "error message",
  "data": null
}
```

### 2.2 用户登录

**请求**
- **URL**: `/api/user/login`
- **Method**: POST
- **Content-Type**: `application/json`

**请求体**
```json
{
  "username": "string (必填，用户名)",
  "pwd": "string (必填，密码)"
}
```

**响应**
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "uid": "integer (用户ID)",
    "username": "string (用户名)",
    "pwd": "string (密码)"
  }
}
```

**错误响应**
```json
{
  "code": 500,
  "msg": "账号或密码错误",
  "data": null
}
```

---

## 3. 场景接口

### 3.1 获取场景列表

**请求**
- **URL**: `/api/scene/list`
- **Method**: GET

**响应**
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "sid": "integer (场景ID)",
      "scene_name": "string (场景名称)",
      "prompt": "string (场景提示)"
    }
  ]
}
```

---

## 4. 发音评测接口

### 4.1 发音评测

**请求**
- **URL**: `/api/pronunciation/evaluate`
- **Method**: POST
- **Content-Type**: `multipart/form-data`

**请求体**
| 参数 | 类型 | 说明 |
|-----|------|-----|
| audio | File | 音频文件（webm格式） |
| referenceText | String | 参考文本（必填） |

**响应**
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "totalScore": "number (总分 0-100)",
    "fluency": "number (流利度 0-100)",
    "accuracy": "number (准确度 0-100)",
    "completeness": "number (完整度 0-100)",
    "phonemeErrors": [
      {
        "word": "string (单词)",
        "targetPhoneme": "string (目标音素)",
        "actualPhoneme": "string (实际音素)",
        "position": "number (位置索引)"
      }
    ],
    "suggestion": "string (改进建议)",
    "referenceText": "string (参考文本)"
  }
}
```

**错误响应**
```json
{
  "code": 500,
  "msg": "Reference text is required",
  "data": null
}
```

### 4.2 测试接口

**请求**
- **URL**: `/api/pronunciation/test`
- **Method**: GET

**响应**
```json
{
  "code": 200,
  "msg": "test success",
  "data": null
}
```

---

## 5. 语法纠错接口

### 5.1 语法纠错

**请求**
- **URL**: `/api/grammar/correct`
- **Method**: POST
- **Content-Type**: `application/json`

**请求体**
```json
{
  "text": "string (必填，待纠错文本)",
  "userId": "string (可选，用户ID，默认 1)"
}
```

**响应**
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "originalText": "string (原始文本)",
    "correctedText": "string (纠正后文本)",
    "errors": [
      {
        "id": "number (错误ID)",
        "type": "string (错误类型：grammar/spelling/wording/punctuation)",
        "message": "string (错误说明)",
        "original": "string (原始内容)",
        "replacement": "string (修正内容)",
        "startIndex": "number (起始位置)",
        "endIndex": "number (结束位置)"
      }
    ],
    "overallSuggestion": "string (总体建议)"
  }
}
```

**支持的错误类型**

| 类型 | 说明 | 示例 |
|-----|------|------|
| grammar | 语法错误 | I am → 已正确 |
| spelling | 拼写错误 | recieve → receive |
| wording | 用词不当 | very good → excellent |
| punctuation | 标点错误 | 空格+. → . |

**错误响应**
```json
{
  "code": 500,
  "msg": "Text to correct is required",
  "data": null
}
```

---

## 6. 语音识别接口

### 6.1 语音识别

**请求**
- **URL**: `/api/asr/recognize`
- **Method**: POST
- **Content-Type**: `multipart/form-data`

**请求体**
| 参数 | 类型 | 说明 |
|-----|------|-----|
| audio | File | 音频文件（webm格式） |

**响应**
```json
{
  "code": 200,
  "msg": "success",
  "data": "string (识别出的文本)"
}
```

**错误响应**
```json
{
  "code": 500,
  "msg": "Audio file is required",
  "data": null
}
```

---

## 7. 练习报告接口

### 7.1 获取练习报告

**请求**
- **URL**: `/api/report`
- **Method**: GET

**查询参数**
| 参数 | 类型 | 说明 |
|-----|------|-----|
| userId | String | 用户ID，默认 `default` |

**响应**
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "userId": "string",
    "summary": {
      "totalPracticeDays": "number (总练习天数)",
      "totalSessions": "number (总会话数)",
      "totalDialogues": "number (总对话数，sessions * 5.5)",
      "totalErrors": "number (总错误数)",
      "totalNewWords": "number (总生词数)"
    },
    "averages": {
      "pronunciationScore": "number (平均发音得分)",
      "fluencyScore": "number (平均流利度得分)",
      "accuracyRate": "string (准确率，如 '87.4')",
      "wpm": "number (每分钟词数)"
    },
    "recentPerformance": [
      {
        "date": "string (日期，如 '6月1日')",
        "score": "number (得分)",
        "dialogues": "number (对话数)"
      }
    ],
    "errorDistribution": [
      {
        "type": "string (错误类型：grammar/spelling/wording/pronunciation/punctuation)",
        "label": "string (错误类型标签)",
        "count": "number (数量)",
        "percentage": "string (百分比，如 '18.2')"
      }
    ],
    "wordFrequency": [
      {
        "word": "string (单词)",
        "count": "number (出现次数)",
        "level": "string (难度等级：B1/B2/C1)"
      }
    ],
    "weeklyTrend": [
      {
        "week": "string (周次，如 '第1周')",
        "startDate": "string (周起始日期，如 '2026-05-10')",
        "sessions": "number (会话数)",
        "avgScore": "number (平均得分)",
        "totalErrors": "number (错误数)"
      }
    ]
  }
}
```

### 7.2 获取练习历史

**请求**
- **URL**: `/api/report/history`
- **Method**: GET

**查询参数**
| 参数 | 类型 | 说明 |
|-----|------|-----|
| userId | String | 用户ID，默认 `default` |
| limit | Number | 返回数量，默认 10 |

**响应**
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "id": "string (会话ID，格式 'session-{rid}-{index}')",
      "date": "string (日期)",
      "duration": "number (时长，分钟)",
      "dialogues": "number (对话数)",
      "pronunciationScore": "number (发音得分)",
      "errors": "number (错误数)",
      "newWords": "number (生词数)",
      "scenario": "string (场景名称：面试/点餐/会议）"
    }
  ]
}
```

---

## 8. 词汇接口

### 8.1 获取词汇统计

**请求**
- **URL**: `/api/vocabulary/stats`
- **Method**: GET

**查询参数**
| 参数 | 类型 | 说明 |
|-----|------|-----|
| userId | String | 用户ID，默认 `1` |

**响应**
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "totalWords": "number (生词总数)",
    "totalErrors": "number (总错误次数)",
    "topErrorWords": [
      {
        "word": "string (单词)",
        "errors": "number (错误次数)",
        "phonetic": "string (音标，可为空)"
      }
    ]
  }
}
```

### 8.2 获取词汇列表

**请求**
- **URL**: `/api/vocabulary`
- **Method**: GET

**查询参数**
| 参数 | 类型 | 说明 |
|-----|------|-----|
| userId | String | 用户ID，默认 `1` |
| page | Number | 页码，默认 1 |
| limit | Number | 每页数量，默认 10，最大 50 |

**响应**
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "list": [
      {
        "id": "number (词汇ID，对应 wid)",
        "word": "string (单词)",
        "phonetic": "string (音标，可为空)",
        "wrongSentence": "string (错误句子)",
        "errorCount": "number (错误次数)",
        "addedAt": "string (添加时间)"
      }
    ],
    "total": "number (总记录数)",
    "page": "number (当前页码)",
    "limit": "number (每页数量)"
  }
}
```

### 8.3 添加词汇

**请求**
- **URL**: `/api/vocabulary`
- **Method**: POST
- **Content-Type**: `application/json`

**请求体**
```json
{
  "word": "string (必填，单词)",
  "phonetic": "string (可选，音标)",
  "wrongSent": "string (可选，错误句子)",
  "userId": "string (可选，用户ID，默认 1)"
}
```

**响应**
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": "number (词汇ID)",
    "word": "string (单词)",
    "phonetic": "string (音标)",
    "wrongSentence": "string (错误句子)",
    "errorCount": "number (错误次数)",
    "addedAt": "string (添加时间)"
  }
}
```

**错误响应 - 词汇已存在**
```json
{
  "code": 500,
  "msg": "Word already exists in vocabulary book",
  "data": null
}
```

### 8.4 删除词汇

**请求**
- **URL**: `/api/vocabulary/:id`
- **Method**: DELETE

**路径参数**
| 参数 | 类型 | 说明 |
|-----|------|-----|
| id | Number | 词汇ID（wid） |

**响应**
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": "number (词汇ID)",
    "message": "Vocabulary deleted"
  }
}
```

**错误响应**
```json
{
  "code": 500,
  "msg": "Vocabulary not found",
  "data": null
}
```

### 8.5 收藏词汇

**请求**
- **URL**: `/api/vocabulary/collect`
- **Method**: POST
- **Content-Type**: `application/json`

**请求体**
```json
{
  "word": "string (必填，单词)",
  "wrongSent": "string (可选，错误句子)",
  "userId": "string (可选，用户ID，默认 1)"
}
```

**响应**
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": "number (词汇ID)",
    "word": "string (单词)",
    "phonetic": "string (音标)",
    "wrongSentence": "string (错误句子)",
    "errorCount": "number (错误次数)",
    "addedAt": "string (添加时间)",
    "isNew": "boolean (是否新增词汇)"
  }
}
```

---

## 9. 异常接口与问题修复记录

### 9.1 ASR语音识别接口

**接口地址**: `POST /api/asr/recognize`

**出现现象**: 调用后返回404错误，前端提示「接口连接失败，请检查后端服务、端口和跨域配置」

**根因分析**:
- 后端路由文件 `asrRoute.js` 已存在，但在 `app.js` 中未注册该路由
- 路由注册遗漏导致接口无法访问

**修复方案**:
- 在 `backend/app.js` 中添加路由注册代码：
  ```javascript
  const asrRouter = require('./routes/asrRoute');
  app.use('/api/asr', asrRouter);
  ```
- 重启后端服务验证接口正常

**当前状态**: 已修复，接口可正常调用

---

### 9.2 练习报告接口

**接口地址**: `GET /api/report`

**出现现象**: 前端提示「网络错误」，无法获取练习报告数据

**根因分析**:
- 前端代码硬编码了完整URL `http://localhost:3000/api/report`
- 开发环境中前端运行在 `localhost:5173`，直接访问 `localhost:3000` 存在跨域问题

**修复方案**:
- 将前端请求改为相对路径 `/api/report`
- 依赖 Vite 代理配置转发请求到后端

**当前状态**: 已修复，接口可正常调用

---

### 9.3 发音评测接口

**接口地址**: `POST /api/pronunciation/evaluate`

**出现现象**: 上传音频后返回500错误

**根因分析**:
- 前端上传的音频文件缺少参考文本参数 `referenceText`
- 后端未对必填参数进行校验，导致后续处理报错

**修复方案**:
- 后端增加参数校验，缺少 `referenceText` 时返回明确错误提示
- 前端确保在调用接口时携带参考文本

**当前状态**: 已修复，接口可正常调用

---

### 9.4 生词保存接口

**接口地址**: `POST /api/vocabulary`

**出现现象**: 重复添加相同生词时返回500错误

**根因分析**:
- `wordbook` 表缺少单词唯一性约束
- 后端未捕获插入重复数据时的异常

**修复方案**:
- 在 `wordbook` 表中添加 `word` 字段的唯一约束
- 后端捕获SQL异常，返回友好提示「词汇已存在」

**当前状态**: 已修复，接口可正常调用

---

### 9.5 语法纠错接口

**接口地址**: `POST /api/grammar/correct`

**出现现象**: 返回空的错误列表

**根因分析**:
- 正则表达式匹配规则不够完善
- 某些语法错误类型未被覆盖

**修复方案**:
- 扩展正则表达式规则，增加更多语法错误检测
- 优化错误匹配逻辑，提升检测准确率

**当前状态**: 已修复，接口可正常调用

---

### 9.6 练习报告数据异常

**接口地址**: `GET /api/report`

**出现现象**: 周趋势数据显示异常（前3周会话数为0，第4周数据重复）

**根因分析**:
- 周数计算逻辑错误，导致周编号重复
- 日期格式化不一致导致x轴数据映射错误

**修复方案**:
- 实现 `getWeekNumber` 函数，基于当前日期计算正确周数
- 统一日期格式化格式为 `${date.getMonth() + 1}月${date.getDate()}日`

**当前状态**: 已修复，数据显示正常

---

### 9.7 折线图数据显示异常

**接口地址**: `GET /api/report`

**出现现象**: 得分和对话数共用一个Y轴，对话数显示被缩放

**根因分析**:
- 折线图配置为单Y轴，得分（0-100）和对话数（0-20）数据范围差异大
- 对话数数据被压缩，无法准确展示

**修复方案**:
- 修改ECharts配置，实现双Y轴
- 左侧Y轴显示得分（0-100），右侧Y轴显示对话数（0-20）

**当前状态**: 已修复，图表显示正常

---

## 附录：错误码详细说明

| HTTP状态码 | 说明 |
|-----------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误或格式不正确 |
| 404 | 请求的资源不存在 |
| 500 | 服务器内部错误 |

### 常见错误信息

| 错误信息 | 说明 |
|---------|------|
| Reference text is required | 发音评测缺少参考文本 |
| Text to correct is required | 语法纠错缺少文本 |
| Audio file is required | 语音识别缺少音频文件 |
| Word is required | 词汇操作缺少单词 |
| Word already exists in vocabulary book | 词汇已存在 |
| Vocabulary not found | 词汇不存在 |
| Invalid vocabulary id | 无效的词汇ID |
| 账号或密码错误 | 登录失败 |
