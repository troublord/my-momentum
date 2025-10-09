# 使用 Node.js 18 作為基礎映像
FROM node:18-alpine

# 設定工作目錄
WORKDIR /app

# 複製 package 檔案
COPY package*.json ./

# 安裝依賴
RUN npm ci --only=production

# 複製原始碼
COPY . .

# 建置應用程式
RUN npm run build

# 使用 Nginx 提供靜態檔案
FROM nginx:alpine

# 複製建置檔案到 Nginx 目錄
COPY --from=0 /app/build /usr/share/nginx/html

# 複製 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 啟動 Nginx
CMD ["nginx", "-g", "daemon off;"]
