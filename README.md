# 赛博木鱼小应用
实现语言：Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).
"# CyberWood" 

# 已实现优化
## 前端
### 0. 初始化
1. 总功德数 & 持久化存储
2. 自动积攒功德功能
3. 增加“好运”“智慧”积攒
### 1. 体验与交互
1. 增加“连击反馈”：连点时浮字堆叠、颜色/大小变化、震动效果
2. 加入“清零/自定义重置”按钮（带确认）
3. 自动敲击支持“档位选择”（1s/0.5s/2s）
### 2. 音效与表现
1. 引入更接近木鱼的合成音：叠加短噪声+敲击包络
2. 让手动/自动音量可调，保存音量到 localStorage
3. 根据功德数切换音色（“升级感”）
### 3. 代码结构与扩展
1. 把逻辑拆成可复用的 useWoodfish() 组合式函数
2. 统一管理所有本地存储 Key 与读写方法
3. 为“功德/好运/智慧”做配置表，后续再加新属性更方便
## 后端
1. 创建Web API项目
# 待实现优化
## 后端
1. API实现