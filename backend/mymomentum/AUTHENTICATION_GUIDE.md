# MyMomentum 專案登入方式說明

## 登入架構概述

MyMomentum 專案採用 **Google OAuth 2.0 + JWT** 的認證方式，這是一個現代化的無狀態認證架構。

## 技術棧

- **前端認證**：Google OAuth 2.0
- **後端認證**：JWT (JSON Web Token)
- **安全框架**：Spring Security
- **資料庫**：PostgreSQL

## 登入流程詳解

### 1. 前端登入流程

```
用戶點擊「使用Google登入」
    ↓
前端調用Google OAuth API
    ↓
Google返回ID Token
    ↓
前端將ID Token發送給後端
    ↓
後端驗證並返回JWT Token
    ↓
前端儲存JWT Token用於後續請求
```

### 2. 後端處理流程

#### Step 1: 接收 Google ID Token

**API 端點**：`POST /auth/google`

**請求格式**：

```json
{
  "idToken": "Google提供的ID Token"
}
```

#### Step 2: 驗證 Google ID Token

```java
// GoogleAuthController.java
GoogleIdToken idToken = verifier.verify(request.idToken());
if (idToken == null) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
}
```

**驗證過程**：

- 使用 Google 的公開金鑰驗證 Token 簽名
- 檢查 Token 是否過期
- 驗證 Audience（Client ID）是否正確

#### Step 3: 提取用戶資訊

```java
GoogleIdToken.Payload payload = idToken.getPayload();
String googleSub = payload.getSubject();  // Google用戶唯一ID
String email = (String) payload.get("email");
String name = (String) payload.get("name");
```

#### Step 4: 用戶註冊/登入

```java
Optional<User> optional = userRepository.findByGoogleSub(googleSub);
User user = optional.orElseGet(() -> {
    User u = new User();
    u.setGoogleSub(googleSub);
    return u;
});
user.setEmail(email);
user.setName(name);
user = userRepository.save(user);
```

**邏輯**：

- 如果用戶存在：更新用戶資訊
- 如果用戶不存在：創建新用戶

#### Step 5: 生成 JWT Token

```java
String token = jwtService.issue(user.getId(), user.getEmail());
return ResponseEntity.ok(Map.of("accessToken", token));
```

**JWT 內容**：

- `subject`: 用戶 ID
- `email`: 用戶郵箱
- `issuedAt`: 發行時間
- `expiration`: 過期時間（4 小時）

### 3. 後續請求認證

#### JWT Filter 處理

```java
// JwtAuthFilter.java
String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
if (authorization != null && authorization.startsWith("Bearer ")) {
    String token = authorization.substring(7);
    Jws<Claims> jws = jwtService.parse(token);
    String subject = jws.getBody().getSubject();
    Authentication authentication = new UserIdAuthentication(Long.parseLong(subject));
    SecurityContextHolder.getContext().setAuthentication(authentication);
}
```

**流程**：

1. 從 `Authorization` Header 提取 JWT Token
2. 驗證 Token 簽名和過期時間
3. 提取用戶 ID 並設置到 Security Context
4. 允許請求繼續處理

## 安全配置

### 1. Spring Security 設定

```java
// SecurityConfig.java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/auth/**", "/health", "/api-docs/**", "/swagger-ui.html", "/swagger-ui/**").permitAll()
    .anyRequest().authenticated()
)
```

**公開端點**：

- `/auth/**` - 認證相關
- `/health` - 健康檢查
- `/api-docs/**`, `/swagger-ui/**` - API 文檔

**受保護端點**：

- 所有其他端點都需要認證

### 2. CORS 配置

```java
configuration.setAllowedOrigins(appConfig.getCors().getAllowedOrigins());
configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
configuration.setAllowCredentials(true);
```

**允許的來源**：`http://localhost:3000`（前端地址）

## 資料庫設計

### User 實體

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email")
    private String email;

    @Column(name = "name")
    private String name;

    @Column(name = "google_sub", nullable = false, unique = true)
    private String googleSub;  // Google用戶唯一標識
}
```

**特點**：

- 使用 `google_sub` 作為唯一標識
- 不儲存密碼（由 Google 管理）
- 支援自動註冊

## 配置參數

### JWT 設定

```yaml
app:
  security:
    jwt:
      secret: "你的JWT密鑰"
      expirationMinutes: 240 # 4小時過期
```

### Google OAuth 設定

```yaml
app:
  google:
    oauth:
      clientId: "你的Google Client ID"
```

## API 端點

### 認證相關

- `POST /auth/google` - Google 登入
- `GET /api/me` - 獲取當前用戶資訊

### 請求範例

#### Google 登入

```bash
curl -X POST http://localhost:8080/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "Google ID Token"
  }'
```

#### 獲取用戶資訊

```bash
curl -X GET http://localhost:8080/api/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 優點

1. **安全性高**：使用 Google 的 OAuth 2.0，無需管理密碼
2. **用戶體驗好**：一鍵登入，無需註冊
3. **無狀態**：使用 JWT，支援水平擴展
4. **自動註冊**：首次登入自動創建用戶
5. **標準化**：遵循 OAuth 2.0 和 JWT 標準

## 潛在改進

1. **Refresh Token**：可以加入 Refresh Token 機制延長登入時間
2. **角色權限**：可以加入用戶角色和權限管理
3. **多平台登入**：可以支援其他 OAuth 提供商（如 GitHub、Facebook）
4. **登出機制**：可以加入 Token 黑名單機制

## 故障排除

### 常見問題

1. **Google ID Token 驗證失敗**

   - 檢查 Client ID 是否正確
   - 確認 Token 未過期
   - 檢查 Google OAuth 設定

2. **JWT Token 無效**

   - 檢查 Token 格式是否正確
   - 確認 Token 未過期
   - 檢查 JWT 密鑰設定

3. **CORS 錯誤**
   - 檢查前端 URL 是否在允許清單中
   - 確認 CORS 配置正確

### 除錯技巧

1. **檢查日誌**：查看 Spring Boot 應用日誌
2. **使用 Swagger**：透過 Swagger UI 測試 API
3. **檢查資料庫**：確認用戶資料正確儲存

## 相關檔案

- `src/main/java/com/ramble/mymomentum/auth/GoogleAuthController.java` - Google 登入控制器
- `src/main/java/com/ramble/mymomentum/auth/JwtService.java` - JWT 服務
- `src/main/java/com/ramble/mymomentum/auth/JwtAuthFilter.java` - JWT 認證過濾器
- `src/main/java/com/ramble/mymomentum/config/SecurityConfig.java` - 安全配置
- `src/main/java/com/ramble/mymomentum/user/User.java` - 用戶實體

---

_最後更新：2024 年 12 月_
