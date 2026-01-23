# Client/Dockerfile

# 1. 编译阶段
FROM node:22-alpine AS build-stage
WORKDIR /app

# 拷贝 package.json 并安装依赖
COPY package*.json ./
RUN npm install

# 拷贝源码并打包
COPY . .
RUN npm run build

# 2. 运行阶段（使用 Nginx）
FROM nginx:alpine as production-stage

# 把 Vue 打包生成的 dist 文件夹，复制到 Nginx 的网页目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 暴露 Nginx 的端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]