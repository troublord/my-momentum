# 建置階段 - 使用官方 Node.js 映像
FROM node:18-alpine AS builder
WORKDIR /app

# 複製 package 檔案
COPY package*.json ./

# 安裝依賴
RUN npm ci

# 複製所有原始碼
COPY . .

# 建置 React 應用
RUN npm run build

# 運行階段 - 使用 Nginx 映像
FROM nginx:alpine

# 複製建置的靜態檔案
COPY --from=builder /app/build /usr/share/nginx/html

# 複製自定義 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

