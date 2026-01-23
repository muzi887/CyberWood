# 🐟 CyberWood - 赛博木鱼

> 积赛博功德，享电子福报。
> A Cyber-style Wooden Fish app built with Vue 3 Fullstack.

## 🛠 技术栈 (Tech Stack)

- **前端**: Vue 3 + TypeScript + Vite + CSS3 Variables
- **后端**: ASP.NET Core 9.0 Web API
- **数据库**: SQLite + Entity Framework Core (Code First)
- **API 文档**: Swagger / OpenAPI

---

## ✨ 已实现功能 (Features)

### 🎨 前端交互与视觉 (Frontend)

#### 0. 核心玩法
- **多属性积攒**: 支持“功德”、“好运”、“智慧”三种属性并行积累。
- **持久化存储**: 
  - 本地优先 (LocalStorage) 保证极速响应。
  - **全栈同步**: 数据实时通过 API 同步至后端 SQLite 数据库，支持防抖 (Debounce) 保存。
- **自动挂机**: 支持开启“自动积攒”，提供多档位速度切换 (0.5s / 1s / 2s)。

#### 1. 沉浸式背景系统 (New!) 🌈
引入策略模式，提供三种独具特色的视觉反馈机制：
- **🎡 赛博轮回 (Samsara Mode)**: 
  - 颜色随总功德数无限流转，配合霓虹光效，体验时间与积累的流动感。
- **☯️ 太极平衡 (Balance Mode)**: 
  - **禅意玩法**。系统监测“功德/好运/智慧”的平衡度。
  - **圣光特效**: 当三者数值极差很小（不偏科）时，触发神圣的“白金圣光”背景。
  - **偏科预警**: 若某项数值过高，背景将呈现该属性对应的深色调（警示态）。
- **⚗️ 炼金术师 (Alchemy Mode)**: 
  - **动态混色**。基于 RGB 物理融合算法。
  - 黄(功德) + 蓝(好运) + 紫(智慧) 实时混合，根据你的属性分布生成独一无二的命理背景色。

#### 2. 极致体验
- **微操修行**: 顶部属性胶囊支持点击，可定向修炼特定属性（用于微操平衡）。
- **连击反馈**: 浮字堆叠动画、水波纹扩散、动态缩放。
- **音频合成**: 引入 Web Audio API，合成接近真实木鱼的短噪声+包络音效。
- **音量管理**: 独立控制“手动敲击”与“自动积攒”的音量。

### 🚀 后端架构 (Backend)

#### 1. API 服务
- **RESTful API**: 提供标准的 `GET` / `POST` 接口管理用户数据。
- **健壮性设计**: 
  - 实现 `UpdateStats` 逻辑，解决并发写入冲突。
  - 针对 SQLite 文件锁 (Database Locked) 进行优化。

#### 2. 数据层
- **EF Core**: 使用 Code First 模式管理数据库迁移 (Migrations)。
- **SQLite**: 轻量级嵌入式数据库，无需复杂配置即可运行。

---

## 📅 待开发计划 (Roadmap)

- [x] **容器化部署**: 已完成！支持 Docker 一键拉起前后端与数据库。
- [ ] **多用户系统**: 引入 JWT 鉴权，支持不同用户拥有独立的功德账户。
- [ ] **排行榜**: 展示全服功德/好运/智慧排行榜。

---

## 🔧 快速开始 (Quick Start)

### 后端 (Server)

```bash
cd Server/CyberWoodfish.API
dotnet restore
dotnet run
# API 将运行在 http://localhost:5xxx
```

### 前端 (Client)

```Bash
cd Client
npm install
npm run dev
# 访问 http://localhost:5173
```

### 🐳 Docker 一键部署 (推荐)

如果你不想安装 .NET SDK 和 Node.js 环境，可以使用 Docker 直接运行。

1. **前置条件**: 确保本地已安装并启动 [Docker Desktop](https://www.docker.com/products/docker-desktop/)。
2. **准备数据库**: 
   - 首次运行会自动在根目录创建 `woodfish_data` 文件夹。
   - 如果需要保留原有数据，请将本地的 `woodfish.db` 复制到 `woodfish_data/` 目录中。
3. **启动服务**:

```bash
# 在项目根目录执行
docker-compose up --build
```

4. **访问应用**:

Web 前端: http://localhost:5173

API 文档: http://localhost:5076/swagger