# MyMomentum - Modern Activity Tracking Backend

MyMomentum is a backend service built with Spring Boot, providing a RESTful API for activity tracking and user management.

- **Google OAuth login** for secure user authentication
- **JWT-based authentication** for stateless, secure API access
- **PostgreSQL** for robust data storagetest
- Designed for easy integration with modern web or mobile frontends
- Features: user authentication (Google login), activity creation and management, secure API endpoints, and OpenAPI/Swagger documentation

---

## 項目概述

這是一個使用 Spring Boot 框架開發的後端項目，集成了 PostgreSQL 數據庫。項目採用 Maven 作為構建工具，並使用 Docker 來運行 PostgreSQL 數據庫。

## 技術棧

- **Java 17** (Eclipse Temurin)
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **Spring Security**
- **PostgreSQL 16**
- **Maven**
- **Docker & Docker Compose**
- **Lombok**
- **JWT (JJWT)**
- **Google OAuth 2.0**
- **Flyway 資料庫遷移**
- **Spring Cache (Caffeine)**
- **Springdoc OpenAPI (Swagger)**
- **Spring Boot Actuator**

## 項目設置步驟

### 1. 初始化 Maven 項目

創建了一個基本的 Maven 項目結構：

```
mymomentum/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   └── resources/
│   └── test/
│       └── java/
```

### 2. 配置 Maven 依賴 (pom.xml)

添加了以下核心依賴：

#### Spring Boot 父項目

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.0</version>
</parent>
```

#### 核心依賴

- **Spring Web** (`spring-boot-starter-web`) - 用於構建 Web 應用
- **Spring Security** (`spring-boot-starter-security`) - 安全認證和授權
- **Spring Data JPA** (`spring-boot-starter-data-jpa`) - 數據庫操作
- **PostgreSQL Driver** (`postgresql`) - PostgreSQL 數據庫驅動
- **Lombok** (`lombok`) - 減少樣板代碼
- **Spring Boot Test** (`spring-boot-starter-test`) - 測試支持
- **Springdoc OpenAPI** (`springdoc-openapi-starter-webmvc-ui`) - API 文檔和 Swagger UI
- **Spring Cache** (`spring-boot-starter-cache`) - 快取支援
- **Caffeine Cache** (`caffeine`) - 高效能快取實作
- **Google API Client** (`google-api-client`) - Google OAuth 驗證
- **JJWT** (`jjwt-*`) - JWT 令牌處理
- **Flyway** (`flyway-core`) - 資料庫遷移管理
- **Spring Boot Actuator** (`spring-boot-starter-actuator`) - 監控和健康檢查

### 3. 數據庫配置

使用 Docker Compose 設置 PostgreSQL 數據庫：

#### Docker Compose 配置 (docker-compose.yml)

```yaml
version: "3.8"
services:
  postgres:
    image: postgres:16
    container_name: mymomentum-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: mymomentum
      POSTGRES_PASSWORD: secret123
      POSTGRES_DB: mymomentumdb
    volumes:
      - ./pgdata:/var/lib/postgresql/data
    ports:
      - "15432:5432"
```

#### 應用配置 (application.yml)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:15432/mymomentumdb
    username: mymomentum
    password: secret123
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
```

### 4. 創建 Spring Boot 應用

#### 主應用類 (MyMomentumApplication.java)

```java
@SpringBootApplication
public class MyMomentumApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyMomentumApplication.class, args);
    }
}
```

#### 測試控制器 (TestController.java)

```java
@RestController
@RequestMapping("/api/test")
public class TestController {
    @GetMapping("/health")
    public String healthCheck() {
        return "MyMomentum application is running! Database connection should be working.";
    }
}
```

## 項目結構

```
mymomentum/
├── pom.xml                                    # Maven 配置文件
├── DATABASE_DESIGN.md                         # 資料庫設計文檔
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── ramble/
│   │   │           └── mymomentum/
│   │   │               ├── MyMomentumApplication.java    # 主應用類
│   │   │               ├── auth/                         # 認證相關
│   │   │               │   ├── GoogleAuthController.java # Google OAuth 控制器
│   │   │               │   ├── GoogleVerifierConfig.java # Google 驗證配置
│   │   │               │   ├── JwtAuthFilter.java        # JWT 認證過濾器
│   │   │               │   ├── JwtService.java           # JWT 服務
│   │   │               │   └── MeController.java         # 用戶資訊控制器
│   │   │               ├── config/                       # 配置類
│   │   │               │   ├── AppConfig.java            # 應用配置
│   │   │               │   ├── CacheConfig.java          # 快取配置
│   │   │               │   ├── OpenAPIConfig.java        # OpenAPI 配置
│   │   │               │   └── SecurityConfig.java       # 安全配置
│   │   │               ├── controller/                   # REST 控制器
│   │   │               │   ├── ActivityController.java   # 活動管理控制器
│   │   │               │   ├── ActivityRecordController.java # 活動記錄控制器
│   │   │               │   └── StatisticsController.java # 統計控制器
│   │   │               ├── dto/                          # 資料傳輸物件
│   │   │               │   ├── ActivityKPIs.java         # 活動 KPI 指標
│   │   │               │   ├── ActivityResponse.java     # 活動回應
│   │   │               │   ├── ActivityStatistics.java   # 活動統計
│   │   │               │   ├── CreateActivityRequest.java # 創建活動請求
│   │   │               │   ├── DistributionItem.java     # 分佈資料項目
│   │   │               │   ├── ErrorResponse.java        # 錯誤回應
│   │   │               │   ├── LastDayRecordsResponse.java # 昨日記錄回應
│   │   │               │   ├── PagedRecordResponse.java  # 分頁記錄回應
│   │   │               │   ├── RecordCreateRequest.java  # 創建記錄請求
│   │   │               │   ├── RecordFinishRequest.java  # 完成記錄請求
│   │   │               │   ├── RecordResponse.java       # 記錄回應
│   │   │               │   ├── RecordUpdateRequest.java  # 更新記錄請求
│   │   │               │   ├── Summary.java              # 統計摘要
│   │   │               │   ├── TrendItem.java            # 趨勢資料項目
│   │   │               │   ├── UpdateActivityRequest.java # 更新活動請求
│   │   │               │   └── WeeklyTrendItem.java      # 週趨勢項目
│   │   │               ├── entity/                       # 實體類
│   │   │               │   ├── Activity.java             # 活動實體類
│   │   │               │   └── ActivityRecord.java       # 活動記錄實體類
│   │   │               ├── enums/                        # 枚舉類
│   │   │               │   └── RecordSource.java         # 記錄來源枚舉
│   │   │               ├── exception/                    # 異常處理
│   │   │               │   ├── BadRequestException.java  # 400 錯誤異常
│   │   │               │   ├── ConflictException.java    # 409 衝突異常
│   │   │               │   ├── GlobalExceptionHandler.java # 全域異常處理器
│   │   │               │   └── NotFoundException.java    # 404 未找到異常
│   │   │               ├── repository/                   # 資料訪問層
│   │   │               │   ├── ActivityRepository.java   # 活動數據訪問層
│   │   │               │   └── ActivityRecordRepository.java # 活動記錄數據訪問層
│   │   │               ├── service/                      # 業務邏輯層
│   │   │               │   ├── ActivityRecordService.java # 活動記錄業務邏輯層
│   │   │               │   ├── ActivityService.java      # 活動業務邏輯層
│   │   │               │   ├── CacheEvictionService.java # 快取清除服務
│   │   │               │   └── StatisticsService.java    # 統計業務邏輯層
│   │   │               ├── user/                         # 用戶相關
│   │   │               │   ├── User.java                 # 用戶實體類
│   │   │               │   └── UserRepository.java       # 用戶數據訪問層
│   │   │               └── resources/
│   │   │                   ├── application.yml           # 應用配置文件
│   │   │                   └── db/migration/             # 資料庫遷移腳本
│   │   │                       └── V1__Initial_schema.sql
│   └── test/
│       └── java/
└── README.md                                   # 項目文檔
```

## 運行項目

### 1. 環境配置

專案支援多環境配置，使用不同的環境檔案：

```bash
# 開發環境
env.dev

# 生產環境  
env.prod
```

### 2. 啟動數據庫

```bash
cd mymomentum-db
docker-compose up -d
```

### 3. 運行 Spring Boot 應用

```bash
# 開發環境
mvn spring-boot:run -Dspring.profiles.active=local

# 生產環境
mvn spring-boot:run -Dspring.profiles.active=prod
```

### 4. 使用 Docker Compose (推薦)

```bash
# 開發環境
docker-compose --env-file env.dev up

# 生產環境
docker-compose --env-file env.prod up
```

### 5. Docker 部署

#### Dockerfile 說明

專案使用多階段建置 Dockerfile：

```dockerfile
# 建置階段 - 使用官方 Maven 映像
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests
RUN mv /app/target/*.jar /app/target/app.jar

# 運行階段 - 使用完整的 Eclipse Temurin JDK
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=builder /app/target/app.jar app.jar
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1
CMD ["java", "-jar", "app.jar"]
```

#### 建置和運行

```bash
# 建置 Docker 映像
docker build -t mymomentum-backend .

# 運行容器
docker run -p 8080:8080 \
  -e DB_USERNAME=mymomentum \
  -e DB_PASSWORD=your_password \
  -e JWT_SECRET=your_jwt_secret \
  -e GOOGLE_CLIENT_ID=your_google_client_id \
  -e FRONTEND_URL=http://localhost:3000 \
  mymomentum-backend
```

#### 分離部署步驟

1. **啟動資料庫服務**
```bash
# 進入資料庫目錄
cd mymomentum-db
docker-compose up -d

# 驗證資料庫運行
docker-compose ps
```

2. **部署後端服務**
```bash
# 進入後端目錄
cd ../backend

# 建立 logs 目錄
mkdir -p logs

# 建置並啟動
docker-compose build --no-cache
docker-compose up -d

# 查看日誌
docker-compose logs -f backend
```

3. **測試部署**
```bash
# 檢查健康狀態
curl http://localhost:8080/actuator/health

# 檢查 API 文檔
curl http://localhost:8080/api-docs
```

#### 關鍵配置

- **資料庫**: 在 `mymomentum-db/docker-compose.yml` 運行
- **後端**: 在 `backend/docker-compose.yml` 運行
- **共用網路**: 兩個服務使用相同的 `mymomentum-network`
- **cgroup 掛載**: 後端需掛載 `/sys/fs/cgroup:/sys/fs/cgroup:ro`
- **日誌掛載**: 後端日誌掛載到 `./logs`

詳細部署指南請參考 [DEPLOYMENT.md](../DEPLOYMENT.md)

### 6. 測試應用

#### 健康檢查端點

```bash
# Actuator 健康檢查
curl http://localhost:8080/actuator/health

# 測試端點
curl http://localhost:8080/api/test/health
```

#### Swagger UI 文檔

訪問 Swagger UI 進行 API 測試和文檔查看：

```
http://localhost:8080/swagger-ui.html
```

OpenAPI JSON 文檔：

```
http://localhost:8080/api-docs
```

#### Actuator 監控端點

```bash
# 應用資訊
curl http://localhost:8080/actuator/info

# 環境資訊
curl http://localhost:8080/actuator/env

# 指標監控
curl http://localhost:8080/actuator/metrics
```

## 配置說明

### 數據庫配置

- **數據庫類型**: PostgreSQL 16
- **主機**: localhost
- **端口**: 15432
- **數據庫名**: mymomentumdb
- **用戶名**: mymomentum
- **密碼**: secret123

#### 資料表結構

**users 表** - 用戶基本資訊

- `id` (BIGSERIAL): 用戶唯一識別碼
- `email` (VARCHAR): 用戶電子郵件（唯一，不區分大小寫）
- `name` (VARCHAR): 用戶顯示名稱
- `google_sub` (VARCHAR): Google OAuth Subject ID（唯一）
- `created_at`, `updated_at` (TIMESTAMPTZ): 時間戳記

**activities 表** - 活動定義

- `id` (UUID): 活動唯一識別碼
- `user_id` (BIGINT): 所屬用戶 ID（外鍵）
- `name` (VARCHAR): 活動名稱（每用戶唯一）
- `target_time` (INT): 每週目標時間（分鐘）
- `color` (VARCHAR): 活動顏色代碼
- `icon` (VARCHAR): 活動圖示代碼
- `created_at`, `updated_at` (TIMESTAMPTZ): 時間戳記

**activity_records 表** - 活動記錄

- `id` (UUID): 記錄唯一識別碼
- `user_id` (BIGINT): 所屬用戶 ID（外鍵）
- `activity_id` (UUID): 所屬活動 ID（外鍵）
- `source` (record_source): 記錄來源（LIVE/MANUAL 枚舉）
- `duration` (INT): 持續時間（秒），進行中的 LIVE 記錄為 NULL
- `executed_at` (TIMESTAMPTZ): 執行時間（時區感知）
- `created_at`, `updated_at` (TIMESTAMPTZ): 時間戳記

**record_source 枚舉類型**

- `LIVE`: 即時記錄，進行中時 duration 為 NULL
- `MANUAL`: 手動記錄，建立時即包含完整 duration

> 📋 **詳細資料庫設計**: 請參考 [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) 獲取完整的資料庫設計文檔

### JPA 配置

- **DDL 自動更新**: `validate` - 使用 Flyway 管理資料庫結構
- **顯示 SQL**: `true` - 在控制台顯示執行的 SQL 語句
- **方言**: PostgreSQL 方言
- **時區設定**: UTC
- **Open-in-view**: `false` - 避免 N+1 查詢問題

### 應用配置

- **服務端口**: 8080
- **應用名稱**: mymomentum
- **日誌級別**: DEBUG (開發環境) / INFO (生產環境)
- **快取配置**: Caffeine 快取，支援活動分佈、趨勢和 KPI 快取
- **Flyway 遷移**: 自動執行資料庫遷移腳本
- **Spring Security**: JWT 認證，Google OAuth 整合
- **CORS 設定**: 支援前端跨域請求
- **Actuator 端點**: 健康檢查、指標監控、環境資訊
- **Docker 多階段建置**: 優化映像大小和建置速度
- **健康檢查**: Docker HEALTHCHECK 整合 Actuator
- **分離部署架構**: 資料庫和後端獨立管理，支援 CI/CD
- **共用網路**: 使用 Docker 網路實現服務間通信

### 環境變數配置

#### 開發環境 (env.dev)
```bash
DB_USERNAME=mymomentum
DB_PASSWORD=secret123
JWT_SECRET=dev-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
FRONTEND_URL=http://localhost:3000
SPRING_PROFILES_ACTIVE=local
```

#### 生產環境 (env.prod)
```bash
DB_USERNAME=mymomentum
DB_PASSWORD=secure-production-password
JWT_SECRET=secure-production-secret
GOOGLE_CLIENT_ID=your-google-client-id
FRONTEND_URL=https://my-momentum.app
SPRING_PROFILES_ACTIVE=prod
```

**注意**: 生產環境使用 `application-prod.yml`，包含以下特殊配置：
- 資料庫使用 Docker 容器名稱連接 (`postgres:5432`)
- 掛載 cgroup 目錄解決 Java 17 cgroup 問題
- 日誌寫入 `/app/logs/mymomentum.log`
- 使用環境變數而非硬編碼密碼

## 已完成功能

1. ✅ **實體類 (Entity)** - Activity, ActivityRecord, User
2. ✅ **數據訪問層 (Repository)** - 完整的 CRUD 操作
3. ✅ **業務邏輯層 (Service)** - 活動、記錄、統計服務
4. ✅ **REST API 端點** - 完整的 RESTful API
5. ✅ **身份驗證** - Google OAuth + JWT
6. ✅ **資料驗證** - 完整的請求驗證
7. ✅ **錯誤處理** - 全域異常處理器
8. ✅ **快取機制** - Caffeine 快取優化
9. ✅ **資料庫遷移** - Flyway 版本控制
10. ✅ **API 文檔** - Swagger/OpenAPI 文檔
11. ✅ **監控端點** - Spring Boot Actuator
12. ✅ **安全配置** - Spring Security 整合
13. ✅ **Docker 部署** - 多階段建置和健康檢查
14. ✅ **生產環境配置** - 環境變數和 Profile 管理

## 核心 API 端點

### 身份驗證
- `POST /auth/google` - Google OAuth 登入
- `GET /auth/me` - 獲取當前用戶資訊

### 活動管理
- `GET /api/activities` - 獲取所有活動
- `POST /api/activities` - 創建新活動
- `GET /api/activities/{id}` - 獲取單一活動
- `PUT /api/activities/{id}` - 更新活動
- `DELETE /api/activities/{id}` - 刪除活動

### 記錄管理
- `GET /api/records` - 獲取記錄列表
- `POST /api/records` - 創建新記錄
- `PATCH /api/records/{id}/finish` - 完成即時記錄
- `GET /api/records/running` - 獲取進行中的記錄

### 統計分析
- `GET /api/statistics/summary` - 獲取統計摘要
- `GET /api/statistics/activities/{id}` - 獲取活動統計
- `GET /api/statistics/weekly-trend` - 獲取週趨勢
- `GET /api/activities/{id}/distribution` - 獲取活動分佈數據
- `GET /api/activities/{id}/trend` - 獲取活動趨勢數據
- `GET /api/activities/{id}/kpis` - 獲取活動 KPI 指標

## Google Cloud Console 設定

### OAuth 2.0 用戶端 ID 設定

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立或選擇專案
3. 在 "API 和服務" > "憑證" 中建立 OAuth 2.0 用戶端 ID
4. 設定已授權的 JavaScript 來源：
   - 開發環境：`http://localhost:3000`
   - 生產環境：`https://my-momentum.app`
5. 設定已授權的重新導向 URI：
   - `https://my-momentum.app/`
   - `https://my-momentum.app/auth/callback`

## 注意事項

- 確保 Docker 和 Docker Compose 已安裝
- 確保 Java 17 已安裝（開發環境）
- 確保 Maven 已安裝（開發環境）
- 首次運行時，Flyway 會自動執行資料庫遷移腳本
- 生產環境必須使用 HTTPS
- Google OAuth 要求生產環境使用 HTTPS
- Docker 映像使用 Eclipse Temurin JDK 17
- 健康檢查依賴 Spring Boot Actuator
- 生產環境建議使用 Docker Compose 部署

## 部署檢查清單

### 開發環境
- [ ] Java 17 已安裝
- [ ] Maven 已安裝
- [ ] Docker 已安裝
- [ ] PostgreSQL 容器已啟動
- [ ] 環境變數已設定

### 生產環境
- [ ] EC2 實例已準備
- [ ] Docker 已安裝
- [ ] 環境變數檔案已設定
- [ ] 資料庫網路已建立 (`mymomentum-network`)
- [ ] 資料庫服務已啟動
- [ ] 後端 logs 目錄已建立
- [ ] cgroup 掛載已設定
- [ ] SSL 憑證已準備（如需要）
- [ ] 防火牆規則已設定
- [ ] 健康檢查端點可訪問
