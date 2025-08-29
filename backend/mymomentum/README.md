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
      - "5432:5432"
```

#### 應用配置 (application.yml)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mymomentumdb
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
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── ramble/
│   │   │           └── mymomentum/
│   │   │               ├── MyMomentumApplication.java    # 主應用類
│   │   │               ├── controller/
│   │   │               │   ├── ActivityController.java   # 活動管理控制器
│   │   │               │   └── TestController.java       # 測試控制器
│   │   │               ├── dto/
│   │   │               │   └── CreateActivityRequest.java # 創建活動請求DTO
│   │   │               ├── entity/
│   │   │               │   ├── Activity.java             # 活動實體類
│   │   │               │   └── ActivityRecord.java       # 活動記錄實體類
│   │   │               ├── enums/
│   │   │               │   └── RecordSource.java         # 記錄來源枚舉
│   │   │               ├── repository/
│   │   │               │   ├── ActivityRepository.java   # 活動數據訪問層
│   │   │               │   └── ActivityRecordRepository.java # 活動記錄數據訪問層
│   │   │               ├── service/
│   │   │               │   └── ActivityService.java      # 活動業務邏輯層
│   │   │               └── resources/
│   │   │                   └── application.yml           # 應用配置文件
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
- **端口**: 5432
- **數據庫名**: mymomentumdb
- **用戶名**: mymomentum
- **密碼**: secret123

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
