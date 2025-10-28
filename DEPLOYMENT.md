# MyMomentum 後端部署指南

本文檔記錄 MyMomentum 後端服務的 Docker 部署過程、配置說明和疑難排解。

## 📋 目錄

- [架構概述](#架構概述)
- [前置需求](#前置需求)
- [部署步驟](#部署步驟)
- [配置文件說明](#配置文件說明)
- [常見問題與解決](#常見問題與解決)
- [驗證部署](#驗證部署)
- [維護指令](#維護指令)

---

## 架構概述

### 服務架構

```
資料庫服務 (mymomentum-db)
├── PostgreSQL 16
├── 端口: 15432 (主機) → 5432 (容器)
└── 網路: mymomentum-network

後端服務 (backend)
├── Spring Boot 3.2.0
├── Java 17 (Eclipse Temurin)
├── 端口: 8080
└── 網路: mymomentum-network (共用網路)
```

### 關鍵設計決策

1. **分離部署**: 資料庫和後端使用獨立的 docker-compose，便於獨立管理和 CI/CD
2. **共用網路**: 使用 `mymomentum-network` 讓容器透過服務名稱通信
3. **環境隔離**: 使用 `prod` profile 區分生產和開發環境
4. **健康檢查**: 整合 Spring Boot Actuator 進行容器健康監控

---

## 前置需求

### 必要軟體

- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **作業系統**: Ubuntu 20.04+ / 支援 Docker Desktop 的環境

### 檢查安裝

```bash
# 檢查 Docker
docker --version

# 檢查 Docker Compose
docker-compose --version

# 確認權限
docker ps
```

---

## 部署步驟

### 步驟 1: 啟動資料庫

```bash
# 進入資料庫目錄
cd mymomentum-db

# 建立共用網路並啟動資料庫
docker-compose up -d

# 驗證資料庫運行
docker-compose ps
docker-compose logs postgres
```

**預期結果**:
```
NAME                  STATUS
mymomentum-postgres   Up (healthy)
```

### 步驟 2: 準備後端服務

```bash
# 進入後端目錄
cd ../backend

# 建立 logs 目錄（避免掛載錯誤）
mkdir -p logs
```

### 步驟 3: 建置並啟動後端

```bash
# 建置 Docker 映像
docker-compose build --no-cache

# 啟動後端服務
docker-compose up -d

# 查看啟動日誌
docker-compose logs -f backend
```

**預期日誌**:
```
Started MyMomentumApplication in X.XXX seconds
```

### 步驟 4: 驗證部署

```bash
# 檢查容器狀態
docker-compose ps

# 測試健康檢查
curl http://localhost:8080/actuator/health

# 預期回應: {"status":"UP"}
```

---

## 配置文件說明

### 1. Dockerfile

**位置**: `backend/mymomentum/Dockerfile`

**特點**:
- 多階段建置（Multi-stage build）以優化映像大小
- 建置階段使用官方 Maven 映像
- 運行階段使用完整 Eclipse Temurin JDK

```dockerfile
# 建置階段
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests
RUN mv /app/target/*.jar /app/target/app.jar

# 運行階段
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=builder /app/target/app.jar app.jar
RUN apt-get update && apt-get install -y curl
ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8080
HEALTHCHECK ...
CMD ["java", "-jar", "app.jar"]
```

**關鍵決策**:
- 使用 `eclipse-temurin:17-jdk` 而非 slim 版本，避免缺少關鍵工具導致 cgroup 錯誤
- 固定 JAR 檔名為 `app.jar` 避免版本號變更影響部署

### 2. Backend Docker Compose

**位置**: `backend/docker-compose.yml`

```yaml
services:
  backend:
    build:
      context: ./mymomentum
    environment:
      SPRING_PROFILES_ACTIVE: prod
      # ... 其他環境變數
    volumes:
      - ./logs:/app/logs           # 日誌持久化
      - /sys/fs/cgroup:/sys/fs/cgroup:ro  # 重要：解決 cgroup 問題
    networks:
      - mymomentum-network
    ports:
      - "8080:8080"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
```

**關鍵設定**:
- **cgroup 掛載**: `/sys/fs/cgroup:/sys/fs/cgroup:ro` 解決 Java 17 cgroup 讀取問題
- **外部網路**: 使用 `external: true` 連接到資料庫的網路
- **日誌掛載**: `./logs:/app/logs` 將日誌持久化到主機

### 3. Database Docker Compose

**位置**: `mymomentum-db/docker-compose.yml`

```yaml
services:
  postgres:
    image: postgres:16
    container_name: mymomentum-postgres
    environment:
      POSTGRES_USER: mymomentum
      POSTGRES_PASSWORD: PgR7!vL2zT8sM0nQ
      POSTGRES_DB: mymomentumdb
    networks:
      - mymomentum-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U mymomentum -d mymomentumdb"]
      interval: 30s
```

**關鍵設定**:
- **共用網路名稱**: `mymomentum-network` 必須與後端一致
- **健康檢查**: 確保資料庫就緒後其他服務才啟動
- **資料持久化**: `./pgdata` 目錄保存資料庫資料

### 4. Application Production Config

**位置**: `backend/mymomentum/src/main/resources/application-prod.yml`

```yaml
spring:
  datasource:
    # Docker Compose 環境：使用服務名稱連接
    url: jdbc:postgresql://postgres:5432/mymomentumdb
```

**關鍵設定**:
- **資料庫 URL**: 使用 `postgres:5432`（容器內部通信）
- **環境變數**: 所有敏感資訊使用 `${VAR:default}` 格式
- **日誌配置**: 日誌寫入 `/app/logs/mymomentum.log`

---

## 常見問題與解決

### 問題 1: cgroup 讀取錯誤

**錯誤訊息**:
```
Cannot invoke "jdk.internal.platform.CgroupInfo.getMountPoint()" 
because "anyController" is null
```

**原因**: Java 17 需要讀取 cgroup 資訊，但容器內沒有掛載

**解決方案**:

在 `backend/docker-compose.yml` 加入 cgroup 掛載:

```yaml
volumes:
  - /sys/fs/cgroup:/sys/fs/cgroup:ro
```

**為什麼有效**: 掛載 cgroup 到容器讓 Java 能讀取系統資源資訊

### 問題 2: JDK 映像不存在

**錯誤訊息**:
```
manifest for eclipse-temurin:17-jre-slim not found
```

**原因**: slim 版本缺少必要工具

**解決方案**:

改用完整 JDK 版本:

```dockerfile
FROM eclipse-temurin:17-jdk  # 而非 -jre-slim
```

### 問題 3: 容器無法連接資料庫

**錯誤訊息**:
```
Connection refused: postgres:5432
```

**原因**: 容器不在同一網路

**解決方案**:

1. 確認資料庫網路已建立:
```bash
docker network ls | grep mymomentum-network
```

2. 確認後端使用正確網路:
```yaml
networks:
  mymomentum-network:
    external: true
    name: mymomentum-network
```

### 問題 4: 健康檢查失敗

**錯誤訊息**:
```
HEALTHCHECK failed
```

**原因**: curl 未安裝或服務未啟動

**解決方案**:

1. 確認 Dockerfile 安裝 curl:
```dockerfile
RUN apt-get update && apt-get install -y curl
```

2. 檢查服務是否啟動:
```bash
docker-compose logs backend
curl http://localhost:8080/actuator/health
```

### 問題 5: 版本號變更需修改 Dockerfile

**原始問題**: JAR 檔名包含版本號，每次變更需修改

**解決方案**:

在 Dockerfile 中重新命名:
```dockerfile
RUN mv /app/target/*.jar /app/target/app.jar
COPY --from=builder /app/target/app.jar app.jar
```

---

## 驗證部署

### 1. 容器狀態檢查

```bash
# 檢查所有容器
docker ps

# 應看到:
# mymomentum-backend (Up, healthy)
# mymomentum-postgres (Up, healthy)
```

### 2. 健康檢查測試

```bash
# Actuator 健康檢查
curl http://localhost:8080/actuator/health

# 預期回應: {"status":"UP"}
```

### 3. API 文檔測試

```bash
# OpenAPI 文檔
curl http://localhost:8080/api-docs

# Swagger UI
curl http://localhost:8080/swagger-ui.html
```

### 4. 資料庫連線檢查

```bash
# 查看後端日誌，確認 HikariCP 連線成功
docker-compose logs backend | grep -i hikari

# 應該看到:
# HikariPool-1 - Starting...
# HikariPool-1 - Start completed.
```

### 5. 網路連通性檢查

```bash
# 查看網路詳情
docker network inspect mymomentum-network

# 應該看到 mymomentum-postgres 和 mymomentum-backend
```

---

## 維護指令

### 日常操作

```bash
# 重啟後端
cd backend
docker-compose restart

# 查看日誌
docker-compose logs -f backend

# 重建映像
docker-compose build --no-cache
docker-compose up -d

# 停止服務
docker-compose down

# 完全清理（包括映像）
docker-compose down --rmi all
```

### 資料庫操作

```bash
cd mymomentum-db

# 備份資料庫
docker-compose exec postgres pg_dump -U mymomentum mymomentumdb > backup.sql

# 恢復資料庫
docker-compose exec -T postgres psql -U mymomentum mymomentumdb < backup.sql

# 查看資料庫日誌
docker-compose logs -f postgres
```

### 偵錯指令

```bash
# 進入容器內部
docker exec -it mymomentum-backend bash

# 測試資料庫連線（容器內）
curl http://postgres:5432

# 查看環境變數
docker exec mymomentum-backend env

# 檢查 Java 版本
docker exec mymomentum-backend java -version

# 查看 Spring Boot 日誌
docker exec mymomentum-backend cat /app/logs/mymomentum.log
```

### 監控指令

```bash
# 容器資源使用
docker stats mymomentum-backend

# 網路狀態
docker network inspect mymomentum-network

# 映像大小
docker images | grep mymomentum

# 系統清理
docker system prune -a
```

---

## 技術決策記錄

### 為什麼選擇 Eclipse Temurin?

- **企業級支援**: Eclipse Foundation 維護，有長期支援
- **完整工具集**: 完整 JDK 包含所有必要工具
- **Docker 優化**: 對容器環境有更好的支援

### 為什麼掛載 cgroup?

- **Java 17 需求**: 需要讀取 cgroup 資訊進行資源監控
- **Metrics 功能**: Spring Boot Actuator 依賴 cgroup 數據
- **避免錯誤**: 防止 `NullPointerException` 導致啟動失敗

### 為什麼使用外部網路?

- **分離部署**: 資料庫和後端可以獨立管理
- **CI/CD 友好**: 適合自動化部署流程
- **靈活性**: 可以單獨更新某個服務

### 為什麼關閉 processor metrics?

- **效能考量**: 避免不必要的監控開銷
- **容器環境**: 某些 metrics 在容器內可能不準確
- **生產優化**: 減少日誌和監控數據量

---

## 部署檢查清單

### 部署前

- [ ] Docker 和 Docker Compose 已安裝
- [ ] 專案代碼已更新到最新版本
- [ ] 環境變數已正確設定
- [ ] logs 目錄已建立
- [ ] 資料庫網路已建立

### 部署後

- [ ] 所有容器處於 Running 狀態
- [ ] 健康檢查通過
- [ ] 資料庫連線成功
- [ ] API 端點可訪問
- [ ] 日誌文件正常寫入

---

## 相關文件

- [Backend README](./backend/mymomentum/README.md)
- [API 文檔](./backend/mymomentum/API_DOCUMENTATION.md)
- [資料庫設計](./backend/mymomentum/DATABASE_DESIGN.md)

---

**最後更新**: 2025-10-26  
**維護者**: MyMomentum Team

---

## 後續步驟

### 部署前置任務

1. **環境變數設定**: 確保 `backend/docker-compose.yml` 中的環境變數已更新
2. **資料庫網路**: 確認 `mymomentum-network` 已建立
3. **logs 目錄**: 建立 `backend/logs` 目錄

### 部署指令總結

```bash
# 1. 啟動資料庫
cd mymomentum-db
docker-compose up -d

# 2. 啟動後端
cd ../backend
mkdir -p logs
docker-compose up -d --build

# 3. 驗證
curl http://localhost:8080/actuator/health
```

### 快速參考

- **健康檢查**: `curl http://localhost:8080/actuator/health`
- **API 文檔**: `http://localhost:8080/swagger-ui.html`
- **查看日誌**: `docker-compose logs -f backend`
- **容器狀態**: `docker-compose ps`

