# Cloudflare 代理模式部署指南

本專案已配置為使用 Cloudflare 作為 SSL/TLS 代理，EC2 上的 Nginx 僅監聽 HTTP (port 80)。

## 🌐 架構說明

```
用戶瀏覽器 (HTTPS)
    ↓
Cloudflare (SSL Termination + CDN + DDoS Protection)
    ↓ (HTTP)
EC2 Nginx (port 80)
    ↓
Frontend Container (React)
Backend Container (Spring Boot)
```

## ✅ Cloudflare 設定要求

### 1. SSL/TLS 設定

在 Cloudflare Dashboard 中：

1. 進入 **SSL/TLS** 標籤
2. 選擇加密模式：**Flexible** 或 **Full**
   - **Flexible**: Cloudflare → EC2 使用 HTTP（推薦，本專案使用此模式）
   - **Full**: 需要 EC2 上有 SSL 證書（本專案已移除）

推薦設定：**Flexible**

### 2. DNS 設定

確保您的域名 DNS 記錄：

- **A Record**: `my-momentum.app` → EC2 公網 IP
- **A Record**: `www.my-momentum.app` → EC2 公網 IP
- **Proxy Status**: 🟠 Proxied（橘色雲朵）

### 3. 安全性設定

建議啟用：
- ✅ Always Use HTTPS（自動重定向到 HTTPS）
- ✅ Automatic HTTPS Rewrites
- ✅ HTTP Strict Transport Security (HSTS)
- ✅ Minimum TLS Version: 1.2

---

## 🚀 部署步驟

### 在 EC2 上執行

```bash
# 1. 確保專案代碼最新
cd /path/to/my-momentum
git pull origin dev

# 2. 確保資料庫運行
cd mymomentum-db
docker-compose ps

# 如果未運行
docker-compose up -d

# 3. 回到專案根目錄
cd ..

# 4. 執行部署腳本
chmod +x deploy.sh
./deploy.sh
```

---

## ✅ 驗證部署

### 1. 檢查容器狀態

```bash
docker-compose ps
```

預期輸出：
```
NAME                  STATUS              PORTS
mymomentum-nginx      Up (healthy)        0.0.0.0:80->80/tcp
mymomentum-frontend   Up                  
mymomentum-backend    Up (healthy)        
```

### 2. 測試 HTTP 訪問（從 EC2 內部）

```bash
curl http://localhost
# 應該返回前端 HTML
```

### 3. 測試 HTTPS 訪問（從外部/瀏覽器）

```bash
curl -I https://my-momentum.app
# 應該返回 200 OK
```

### 4. 測試後端 API

```bash
curl https://my-momentum.app/api/actuator/health
# 應該返回: {"status":"UP"}
```

---

## 🔧 配置說明

### docker-compose.yml 變更

```yaml
services:
  nginx:
    ports:
      - "80:80"  # 僅 HTTP，無需 443
    volumes:
      # 移除了 SSL 證書掛載
      # 移除了 certbot-webroot 掛載
      
  # certbot 服務已完全移除
```

### nginx/conf.d/default.conf 變更

- 移除了 HTTPS (443) 監聽
- 移除了 SSL 證書配置
- 移除了 HTTP → HTTPS 重定向
- 保留了重要的 proxy headers，特別是：
  - `X-Forwarded-Proto: https` - 讓後端知道原始請求是 HTTPS
  - `X-Forwarded-Port: 443` - 讓後端知道原始端口

---

## 🔐 安全性考量

### 優點

1. **SSL 管理簡化**: Cloudflare 自動處理證書更新
2. **DDoS 防護**: Cloudflare 提供企業級防護
3. **CDN 加速**: 靜態資源自動緩存加速
4. **WAF 保護**: 可選的 Web Application Firewall

### 注意事項

1. **EC2 安全組設定**
   - 只需開放 port 80 (HTTP)
   - 可以限制來源 IP 為 Cloudflare IP 範圍（進階）

2. **Cloudflare IP 範圍白名單**（可選）

如果要限制只允許 Cloudflare 訪問，可以在 EC2 安全組中只允許 Cloudflare IP：
- https://www.cloudflare.com/ips/

3. **後端應用配置**

確保後端正確處理 `X-Forwarded-Proto` header，以便：
- 生成正確的 HTTPS URL
- 正確處理重定向

---

## 📊 監控與維護

### 日常檢查

```bash
# 容器狀態
docker-compose ps

# Nginx 日誌
docker-compose logs -f nginx

# 後端日誌
docker-compose logs -f backend
```

### Cloudflare Dashboard 監控

定期檢查：
- 流量統計
- 攻擊防護記錄
- 快取命中率
- SSL/TLS 證書狀態

---

## 🐛 故障排除

### 問題 1: 無限重定向循環

**症狀**: 瀏覽器顯示 "重定向次數過多"

**原因**: Cloudflare 與 Nginx 同時做 HTTPS 重定向

**解決方案**:
- 確認 Nginx 配置中**沒有** HTTP → HTTPS 重定向
- 確認 Cloudflare SSL 模式為 **Flexible** 或 **Full**

### 問題 2: Mixed Content 警告

**症狀**: 瀏覽器控制台顯示 "Mixed Content" 警告

**原因**: 前端使用 HTTP URL 載入資源

**解決方案**:
- 確認前端所有資源使用相對路徑或 HTTPS
- 檢查後端 API URL 配置

### 問題 3: 後端生成錯誤的 URL

**症狀**: 後端返回的 URL 是 HTTP 而非 HTTPS

**原因**: 後端沒有正確讀取 `X-Forwarded-Proto` header

**解決方案**:
檢查 Spring Boot 配置：
```yaml
server:
  forward-headers-strategy: framework
```

---

## 🔄 回滾到自簽證書（如需要）

如果需要回滾到使用 Let's Encrypt 證書：

1. 恢復 `docker-compose.yml` 中的 certbot 服務
2. 恢復 nginx 的 443 端口和 SSL 配置
3. 恢復證書目錄掛載
4. 在 Cloudflare 中將 DNS 記錄改為 **DNS Only**（灰色雲朵）

---

## 📚 相關文檔

- [Cloudflare SSL/TLS 最佳實踐](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/)
- [原始部署文檔](./NGINX_DOCKER_MIGRATION.md)
- [快速部署指南](./QUICK_START_EC2.md)

---

## 📚 其他相關文檔

- **`DEPLOY_CHEATSHEET.md`** - 日常部署速查表（推薦）
- **`QUICK_START_EC2.md`** - 快速部署指南
- **`NGINX_DOCKER_MIGRATION.md`** - 完整技術文檔

---

**更新日期**: 2025-10-28  
**配置模式**: Cloudflare Flexible SSL  
**證書管理**: Cloudflare 自動管理

