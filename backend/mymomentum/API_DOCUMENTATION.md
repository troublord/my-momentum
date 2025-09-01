cat > API_DOCUMENTATION.md << 'EOF'
# MyMomentum Backend API 文檔

## 📋 概述

本文檔描述了 MyMomentum 後端提供的所有 API 端點，包括認證、活動管理和統計數據功能。

### 🔐 認證

所有 API 端點都需要 Bearer Token 認證（除了 `/auth/*` 和 `/health`）。請在請求標頭中包含：
```
Authorization: Bearer <your-jwt-token>
```

### 🌐 基礎 URL

```
http://localhost:8080
```

---

## 🔑 認證 API

### 1. Google OAuth 登入

**端點：** `POST /auth/google`

**描述：** 使用 Google ID Token 進行登入認證

**請求標頭：**
```
Content-Type: application/json
```

**請求體：**
```json
{
  "idToken": "google-id-token-here"
}
```

**響應 (200 OK)：**
```json
{
  "accessToken": "jwt-token-here"
}
```

**錯誤響應：**
- `401 Unauthorized`: ID Token 無效

---

### 2. 獲取當前用戶信息

**端點：** `GET /api/me`

**描述：** 獲取當前登入用戶的基本信息

**請求標頭：**
```
Authorization: Bearer <token>
```

**響應 (200 OK)：**
```json
{
  "userId": 123
}
```

---

### 3. 健康檢查

**端點：** `GET /health`

**描述：** 檢查服務健康狀態

**響應 (200 OK)：**
```json
{
  "status": "UP"
}
```

---

## 📊 活動管理 API

### 1. 創建新活動

**端點：** `POST /api/activities`

**描述：** 為當前用戶創建新活動

**請求標頭：**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**請求體：**
```json
{
  "name": "閱讀",
  "targetTime": 120,
  "color": "#3b82f6",
  "icon": "book"
}
```

**參數說明：**
- `name` (string, required): 活動名稱
- `targetTime` (integer, required): 每週目標時間（分鐘）
- `color` (string, required): 活動顏色（十六進制）
- `icon` (string, required): 活動圖標

**響應 (201 Created)：**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "閱讀",
  "totalTime": 0,
  "weeklyTime": 0,
  "targetTime": 120,
  "color": "#3b82f6",
  "icon": "book"
}
```

**錯誤響應：**
- `400 Bad Request`: 活動名稱已存在或驗證失敗

---

### 2. 獲取用戶的所有活動

**端點：** `GET /api/activities`

**描述：** 獲取當前用戶的所有活動

**請求標頭：**
```
Authorization: Bearer <token>
```

**響應 (200 OK)：**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "閱讀",
      "totalTime": 180,
      "weeklyTime": 45,
      "targetTime": 120,
      "color": "#3b82f6",
      "icon": "book"
    }
  ]
}
```

---

### 3. 獲取單一活動

**端點：** `GET /api/activities/{id}`

**描述：** 根據ID獲取單一活動

**路徑參數：**
- `id` (UUID): 活動ID

**請求標頭：**
```
Authorization: Bearer <token>
```

**響應 (200 OK)：**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "閱讀",
  "totalTime": 180,
  "weeklyTime": 45,
  "targetTime": 120,
  "color": "#3b82f6",
  "icon": "book"
}
```

**錯誤響應：**
- `404 Not Found`: 活動不存在

---

### 4. 更新活動

**端點：** `PUT /api/activities/{id}`

**描述：** 更新現有活動

**路徑參數：**
- `id` (UUID): 活動ID

**請求標頭：**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**請求體：**
```json
{
  "name": "深度閱讀",
  "targetTime": 150,
  "color": "#10b981",
  "icon": "book-open"
}
```

**參數說明：**
- `name` (string, optional): 活動名稱
- `targetTime` (integer, optional): 每週目標時間（分鐘）
- `color` (string, optional): 活動顏色
- `icon` (string, optional): 活動圖標

**響應 (200 OK)：**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "深度閱讀",
  "totalTime": 180,
  "weeklyTime": 45,
  "targetTime": 150,
  "color": "#10b981",
  "icon": "book-open"
}
```

**錯誤響應：**
- `400 Bad Request`: 驗證失敗
- `404 Not Found`: 活動不存在

---

### 5. 刪除活動

**端點：** `DELETE /api/activities/{id}`

**描述：** 刪除現有活動

**路徑參數：**
- `id` (UUID): 活動ID

**請求標頭：**
```
Authorization: Bearer <token>
```

**響應 (204 No Content)：** 無內容

**錯誤響應：**
- `404 Not Found`: 活動不存在

---

## 📈 統計數據 API

### 1. 獲取統計摘要

**端點：** `GET /api/statistics/summary`

**描述：** 獲取用戶的統計摘要數據，默認為當前週

**查詢參數：**
- `period` (string, optional): 時間週期 - "week", "month", "year" (默認: "week")
- `startDate` (string, optional): 開始日期 (YYYY-MM-DD 格式)
- `endDate` (string, optional): 結束日期 (YYYY-MM-DD 格式)

**注意：** 如果同時提供 `startDate` 和 `endDate`，將使用自定義日期範圍；否則使用 `period` 參數。

**請求標頭：**
```
Authorization: Bearer <token>
```

**響應 (200 OK)：**
```json
{
  "weeklyTotalTime": 180,
  "mostFrequentActivity": "閱讀",
  "completionRate": 0.85
}
```

**參數說明：**
- `weeklyTotalTime` (integer): 指定期間的總時間（分鐘）
- `mostFrequentActivity` (string): 最常進行的活動名稱（null 如果沒有記錄）
- `completionRate` (number): 完成率 (0.0 - 1.0)

---

### 2. 獲取特定活動的統計數據（簡化版）

**端點：** `GET /api/statistics/activities/{activityId}`

**描述：** 獲取特定活動的統計數據（簡化版本）

**路徑參數：**
- `activityId` (string): 活動ID

**請求標頭：**
```
Authorization: Bearer <token>
```

**響應 (200 OK)：**
```json
{
  "totalTime": 360,
  "weeklyTime": 45,
  "completionRate": 0.75
}
```

**參數說明：**
- `totalTime` (integer): 所有時間的總分鐘數
- `weeklyTime` (integer): 當前週的總分鐘數
- `completionRate` (number): 當前週的完成率

**錯誤響應：**
- `404 Not Found`: 活動不存在

---

### 3. 獲取特定活動的詳細統計數據

**端點：** `GET /api/statistics/activities/{activityId}/detailed`

**描述：** 獲取特定活動的詳細統計數據，包含週期信息和趨勢

**路徑參數：**
- `activityId` (string): 活動ID

**查詢參數：**
- `period` (string, optional): 時間週期 - "week", "month", "year" (默認: "week")

**請求標頭：**
```
Authorization: Bearer <token>
```

**響應 (200 OK)：**
```json
{
  "activityId": "550e8400-e29b-41d4-a716-446655440000",
  "period": "week",
  "periodStart": "2025-01-06T00:00:00+08:00",
  "periodEnd": "2025-01-13T00:00:00+08:00",
  "totalTime": 120,
  "weeklyTarget": 150,
  "scale": 1.0,
  "completionRate": 0.8,
  "weeklyTrend": [
    {
      "weekStart": "2024-11-18",
      "minutes": 90
    },
    {
      "weekStart": "2024-11-25",
      "minutes": 120
    }
  ]
}
```

**參數說明：**
- `activityId` (string): 活動ID
- `period` (string): 時間週期
- `periodStart` (string): 期間開始時間（ISO 8601 格式）
- `periodEnd` (string): 期間結束時間（ISO 8601 格式）
- `totalTime` (integer): 指定期間的總分鐘數
- `weeklyTarget` (integer): 每週目標分鐘數
- `scale` (number): 縮放比例（週=1.0，月/年=天數/7.0）
- `completionRate` (number): 完成率
- `weeklyTrend` (array): 最近8週的趨勢數據

**錯誤響應：**
- `404 Not Found`: 活動不存在

---

### 4. 獲取週趨勢數據

**端點：** `GET /api/statistics/weekly-trend`

**描述：** 獲取用戶或特定活動的週趨勢數據（最近8週）

**查詢參數：**
- `activityId` (string, optional): 活動ID（如果不提供，則返回所有活動的總和）

**請求標頭：**
```
Authorization: Bearer <token>
```

**響應 (200 OK)：**
```json
{
  "data": [
    {
      "weekStart": "2024-11-18",
      "minutes": 180
    },
    {
      "weekStart": "2024-11-25",
      "minutes": 240
    }
  ]
}
```

**參數說明：**
- `weekStart` (string): 週開始日期（YYYY-MM-DD 格式，週一開始）
- `minutes` (integer): 該週的總分鐘數

**錯誤響應：**
- `404 Not Found`: 活動不存在（當提供 activityId 時）

---

## 📝 數據類型說明

### ActivityResponse
```json
{
  "id": "string (UUID)",
  "name": "string",
  "totalTime": "integer (minutes)",
  "weeklyTime": "integer (minutes)",
  "targetTime": "integer (minutes)",
  "color": "string (hex color)",
  "icon": "string"
}
```

### Summary
```json
{
  "weeklyTotalTime": "integer (minutes)",
  "mostFrequentActivity": "string | null",
  "completionRate": "number (0.0 - 1.0)"
}
```

### ActivityStatsSimple
```json
{
  "totalTime": "integer (minutes)",
  "weeklyTime": "integer (minutes)",
  "completionRate": "number (0.0 - 1.0)"
}
```

### ActivityStatistics
```json
{
  "activityId": "string (UUID)",
  "period": "string (week|month|year)",
  "periodStart": "string (ISO 8601)",
  "periodEnd": "string (ISO 8601)",
  "totalTime": "integer (minutes)",
  "weeklyTarget": "integer (minutes)",
  "scale": "number",
  "completionRate": "number (0.0 - 1.0)",
  "weeklyTrend": "WeeklyTrendItem[]"
}
```

### WeeklyTrendItem
```json
{
  "weekStart": "string (YYYY-MM-DD)",
  "minutes": "integer"
}
```

---

## 🔧 錯誤處理

### 常見錯誤碼

- `400 Bad Request`: 請求參數錯誤或驗證失敗
- `401 Unauthorized`: 未提供有效的認證令牌
- `404 Not Found`: 請求的資源不存在
- `500 Internal Server Error`: 服務器內部錯誤

### 錯誤響應格式
```json
{
  "timestamp": "2025-01-06T10:30:00.000Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Activity name is required",
  "path": "/api/activities"
}
```

---

## 📅 時間處理

- 所有時間計算都基於 **Asia/Taipei** 時區
- 週期計算：
  - **週**: 週一到週日
  - **月**: 當月第一天到最後一天
  - **年**: 當年第一天到最後一天
- 日期格式：`YYYY-MM-DD`
- 時間戳格式：ISO 8601 (`2025-01-06T00:00:00+08:00`)

---

## 🚀 使用範例

### JavaScript/TypeScript 範例

```typescript
// 認證
const loginWithGoogle = async (idToken: string) => {
  const response = await fetch('/auth/google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ idToken })
  });
  const data = await response.json();
  return data.accessToken;
};

// 創建活動
const createActivity = async (activityData: any, token: string) => {
  const response = await fetch('/api/activities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(activityData)
  });
  return response.json();
};

// 獲取統計摘要
const getSummary = async (period = 'week', token: string) => {
  const response = await fetch(`/api/statistics/summary?period=${period}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};

// 獲取週趨勢
const getWeeklyTrend = async (activityId: string | null, token: string) => {
  const url = activityId 
    ? `/api/statistics/weekly-trend?activityId=${activityId}`
    : '/api/statistics/weekly-trend';
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

---

## 📚 相關資源

- **Swagger UI**: `http://localhost:8080/swagger-ui/index.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`
- **OpenAPI YAML**: `http://localhost:8080/v3/api-docs.yaml`

---

## 📋 API 端點總覽

| 方法 | 端點 | 描述 | 認證 |
|------|------|------|------|
| POST | `/auth/google` | Google OAuth 登入 | ❌ |
| GET | `/api/me` | 獲取當前用戶信息 | ✅ |
| GET | `/health` | 健康檢查 | ❌ |
| POST | `/api/activities` | 創建新活動 | ✅ |
| GET | `/api/activities` | 獲取所有活動 | ✅ |
| GET | `/api/activities/{id}` | 獲取單一活動 | ✅ |
| PUT | `/api/activities/{id}` | 更新活動 | ✅ |
| DELETE | `/api/activities/{id}` | 刪除活動 | ✅ |
| GET | `/api/statistics/summary` | 獲取統計摘要 | ✅ |
| GET | `/api/statistics/activities/{id}` | 獲取活動統計（簡化） | ✅ |
| GET | `/api/statistics/activities/{id}/detailed` | 獲取活動統計（詳細） | ✅ |
| GET | `/api/statistics/weekly-trend` | 獲取週趨勢數據 | ✅ |

---

*最後更新：2025年1月*
EOF