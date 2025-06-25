# 🤖 Gemini API 集成指南

GemiUI 现在支持真实的 Gemini API 集成！以下是如何设置和使用的详细说明。

## ✨ 新功能特性

### 🔥 真实 AI 对话
- ✅ 基于 Google Generative AI SDK 的流式响应
- ✅ 支持 Gemini 2.5 Pro 和其他模型
- ✅ 实时打字效果显示
- ✅ 完整的对话历史管理
- ✅ 错误处理和状态显示

### 🎯 智能状态指示器
- 🟢 **绿色**: API 已配置，Gemini 准备就绪
- 🟡 **黄色**: 正在思考/响应中
- 🔴 **红色**: 配置错误或API问题
- ⚫ **灰色**: 未配置API密钥

## 🚀 快速开始

### 1. 获取 Gemini API 密钥

1. 访问 [``Google AI Studio](https://aistudio.google.com/apikey)
2. 登录你的 Google 账户
3. 点击 "Create API Key"
4. 复制生成的 API 密钥

### 2. 配置 GemiUI

1. 启动 GemiUI 应用
2. 点击左侧边栏的 **Settings** 
3. 在 "API Configuration" 部分：
   - 粘贴你的 API 密钥到 "Gemini API Key" 字段
   - 选择想要使用的模型（默认：Gemini 2.5 Pro）
4. 点击 **Save Settings** 
5. 应用会自动重启并连接到 Gemini

### 3. 开始聊天

1. 返回 **Chat** 面板
2. 确认状态显示为 🟢 "Ready (gemini-2.5-pro)"
3. 在输入框中输入你的问题
4. 按 Enter 发送，享受实时 AI 对话！

## 🛠️ 支持的模型

- `gemini-2.5-pro` - 最新最强大的模型（推荐）
- `gemini-2.5-flash` - 更快的响应速度
- `gemini-1.5-pro` - 稳定版本

## 💡 使用技巧

### 流式响应体验
- 消息会实时逐字显示，就像真人打字一样
- 可以看到 Gemini 的"思考"过程

### 对话历史
- 自动维护对话上下文
- 可以引用之前的对话内容
- 支持多轮复杂对话

### 错误处理
- 如果 API 密钥无效，会显示明确的错误信息
- 网络问题会自动重试
- 模型限制会有友好的提示

## 🔧 高级配置

### 模型参数调整
当前支持的配置参数：
- **Temperature**: 控制创造性（0-1，默认0.7）
- **Max Tokens**: 响应长度限制（默认8192）

### 自定义配置
可以在 Settings 面板中调整：
- 响应温度
- 最大token数
- 模型选择

## 🐛 故障排除

### 常见问题

**❌ "API key is required"**
- 解决：在 Settings 中配置有效的 API 密钥

**❌ "Failed to initialize Gemini service"**
- 检查网络连接
- 确认 API 密钥有效
- 查看控制台错误详情

**❌ "No response received from Gemini"**
- 模型可能过载，稍后重试
- 检查输入是否符合内容政策

**🟡 响应缓慢**
- 切换到 `gemini-2.5-flash` 获得更快响应
- 检查网络延迟

### 开发调试

1. 打开开发者工具 (F12)
2. 查看 Console 标签页获取详细错误信息
3. Network 标签页可以监控 API 请求

## 🔒 安全注意事项

- API 密钥存储在本地 localStorage 中
- 不会上传到任何外部服务器
- 建议定期轮换 API 密钥
- 不要在公共环境中输入敏感信息

## 📊 技术实现

### 架构概述
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   ChatPanel     │───▶│  GeminiService   │───▶│ Google GenAI    │
│   (React UI)    │    │  (业务逻辑)      │    │ (API)           │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                        │                       │
        ▼                        ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   useGemini     │    │  StreamingResponse│    │ 流式响应        │
│   (React Hook)  │    │  (类型定义)       │    │ 分块处理        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 核心文件
- `src/services/geminiService.ts` - Gemini API 服务
- `src/hooks/useGemini.ts` - React 状态管理
- `src/components/ChatPanel.tsx` - 聊天界面
- `src/components/SettingsPanel.tsx` - 配置界面

## 🎯 下一步计划

- [ ] 支持文件上传分析
- [ ] 代码高亮和语法支持
- [ ] 导出对话记录
- [ ] 多模态输入（图片、文档）
- [ ] 自定义系统提示词
- [ ] 对话分支管理

---

🎉 **享受与 Gemini 的智能对话体验！**