# MyMomentum - Modern Activity Tracking Backend

MyMomentum is a backend service built with Spring Boot, providing a RESTful API for activity tracking and user management.

- **Google OAuth login** for secure user authentication
- **JWT-based authentication** for stateless, secure API access
- **PostgreSQL** for robust data storage
- Designed for easy integration with modern web or mobile frontends
- Features: user authentication (Google login), activity creation and management, secure API endpoints, and OpenAPI/Swagger documentation

---

## 項目概述

這是一個使用 Spring Boot 框架開發的後端項目，集成了 PostgreSQL 數據庫。項目採用 Maven 作為構建工具，並使用 Docker 來運行 PostgreSQL 數據庫。

## 技術棧

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **PostgreSQL 16**
- **Maven**
- **Docker & Docker Compose**
- **Lombok**

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
- **Spring Data JPA** (`spring-boot-starter-data-jpa`) - 數據庫操作
- **PostgreSQL Driver** (`postgresql`) - PostgreSQL 數據庫驅動
- **Lombok** (`lombok`) - 減少樣板代碼
- **Spring Boot Test** (`spring-boot-starter-test`) - 測試支持
- **Springdoc OpenAPI** (`springdoc-openapi-starter-webmvc-ui`) - API 文檔和 Swagger UI

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
│   │   │               │   ├── JwtService.java           # JWT 服務
│   │   │               │   └── ...
│   │   │               ├── controller/                   # REST 控制器
│   │   │               │   ├── ActivityController.java   # 活動管理控制器
│   │   │               │   ├── ActivityRecordController.java # 活動記錄控制器
│   │   │               │   └── StatisticsController.java # 統計控制器
│   │   │               ├── dto/                          # 資料傳輸物件
│   │   │               │   ├── CreateActivityRequest.java # 創建活動請求DTO
│   │   │               │   ├── RecordResponse.java       # 記錄回應DTO
│   │   │               │   └── ...
│   │   │               ├── entity/                       # 實體類
│   │   │               │   ├── Activity.java             # 活動實體類
│   │   │               │   └── ActivityRecord.java       # 活動記錄實體類
│   │   │               ├── enums/                        # 枚舉類
│   │   │               │   └── RecordSource.java         # 記錄來源枚舉
│   │   │               ├── repository/                   # 資料訪問層
│   │   │               │   ├── ActivityRepository.java   # 活動數據訪問層
│   │   │               │   └── ActivityRecordRepository.java # 活動記錄數據訪問層
│   │   │               ├── service/                      # 業務邏輯層
│   │   │               │   ├── ActivityService.java      # 活動業務邏輯層
│   │   │               │   ├── ActivityRecordService.java # 活動記錄業務邏輯層
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

### 1. 啟動數據庫

```bash
cd mymomentum-db
docker-compose up -d
```

### 2. 運行 Spring Boot 應用

```bash
mvn spring-boot:run
```

### 3. 測試應用

訪問健康檢查端點：

```
http://localhost:8080/api/test/health
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

- **DDL 自動更新**: `update` - 根據實體類自動更新數據庫結構
- **顯示 SQL**: `true` - 在控制台顯示執行的 SQL 語句
- **方言**: PostgreSQL 方言

### 應用配置

- **服務端口**: 8080
- **應用名稱**: mymomentum
- **日誌級別**: DEBUG (用於開發調試)

## 下一步計劃

1. ✅ 創建實體類 (Entity) - **已完成**
2. ✅ 實現數據訪問層 (Repository) - **已完成**
3. ✅ 添加業務邏輯層 (Service) - **已完成**
4. ✅ 完善 REST API 端點 - **已完成**
5. 添加數據驗證
6. 實現錯誤處理
7. 添加單元測試

## 注意事項

- 確保 Docker 和 Docker Compose 已安裝
- 確保 Java 17 已安裝
- 確保 Maven 已安裝
- 首次運行時，Hibernate 會自動創建數據庫表結構
