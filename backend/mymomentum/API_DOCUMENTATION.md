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

**描述：** 根據 ID 獲取單一活動

**路徑參數：**

- `id` (UUID): 活動 ID

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

- `id` (UUID): 活動 ID

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

- `id` (UUID): 活動 ID

**請求標頭：**

```
Authorization: Bearer <token>
```

**響應 (204 No Content)：** 無內容

**錯誤響應：**

- `404 Not Found`: 活動不存在

---

## 📝 活動記錄管理 API

### 1. 創建活動記錄

**端點：** `POST /api/records`

**描述：** 為當前用戶創建新的活動記錄（LIVE 或 MANUAL）

**請求標頭：**

```
Content-Type: application/json
Authorization: Bearer <token>
```

**請求體：**

```json
{
  "activityId": "550e8400-e29b-41d4-a716-446655440000",
  "source": "LIVE",
  "duration": null,
  "executedAt": "2024-01-15T10:30:00Z"
}
```

**參數說明：**

- `activityId` (UUID, required): 活動 ID
- `source` (string, required): 記錄來源 - "LIVE"（實時記錄）或 "MANUAL"（手動記錄）
- `duration` (integer, optional): 持續時間（秒）- MANUAL 記錄必需，LIVE 記錄必須為 null
- `executedAt` (string, required): 執行時間（ISO 8601 格式）

**響應 (201 Created)：**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "activityId": "550e8400-e29b-41d4-a716-446655440000",
  "source": "LIVE",
  "duration": null,
  "executedAt": "2024-01-15T10:30:00Z",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**錯誤響應：**

- `400 Bad Request`: 請求參數錯誤或驗證失敗
- `404 Not Found`: 活動不存在
- `409 Conflict`: 該活動已有正在進行的 LIVE 記錄

---

### 2. 完成 LIVE 記錄

**端點：** `PATCH /api/records/{id}/finish`

**描述：** 結束正在進行的 LIVE 記錄並設置持續時間

**路徑參數：**

- `id` (UUID): 記錄 ID

**請求標頭：**

```
Content-Type: application/json
Authorization: Bearer <token>
```

**請求體：**

```json
{
  "endAt": "2024-01-15T11:30:00Z"
}
```

**參數說明：**

- `endAt` (string, required): 結束時間（ISO 8601 格式）

**響應 (200 OK)：**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "activityId": "550e8400-e29b-41d4-a716-446655440000",
  "source": "LIVE",
  "duration": 3600,
  "executedAt": "2024-01-15T10:30:00Z",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T11:30:00Z"
}
```

**錯誤響應：**

- `400 Bad Request`: 請求參數錯誤
- `404 Not Found`: 記錄不存在
- `409 Conflict`: 記錄不是正在進行的 LIVE 記錄

---

### 3. 更新記錄

**端點：** `PUT /api/records/{id}`

**描述：** 更新現有的活動記錄（僅限 MANUAL 記錄或已完成的 LIVE 記錄）

**路徑參數：**

- `id` (UUID): 記錄 ID

**請求標頭：**

```
Content-Type: application/json
Authorization: Bearer <token>
```

**請求體：**

```json
{
  "activityId": "550e8400-e29b-41d4-a716-446655440000",
  "source": "MANUAL",
  "duration": 1800,
  "executedAt": "2024-01-15T09:00:00Z"
}
```

**參數說明：**

- `activityId` (UUID, required): 活動 ID
- `source` (string, required): 記錄來源
- `duration` (integer, optional): 持續時間（秒）
- `executedAt` (string, required): 執行時間

**響應 (200 OK)：**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "activityId": "550e8400-e29b-41d4-a716-446655440000",
  "source": "MANUAL",
  "duration": 1800,
  "executedAt": "2024-01-15T09:00:00Z",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T12:00:00Z"
}
```

**錯誤響應：**

- `400 Bad Request`: 請求參數錯誤或驗證失敗
- `404 Not Found`: 記錄不存在
- `409 Conflict`: 不能更新正在進行的 LIVE 記錄

---

### 4. 刪除記錄

**端點：** `DELETE /api/records/{id}`

**描述：** 刪除現有的活動記錄

**路徑參數：**

- `id` (UUID): 記錄 ID

**請求標頭：**

```
Authorization: Bearer <token>
```

**響應 (204 No Content)：** 無內容

**錯誤響應：**

- `404 Not Found`: 記錄不存在

---

### 5. 獲取單一記錄

**端點：** `GET /api/records/{id}`

**描述：** 根據 ID 獲取單一活動記錄

**路徑參數：**

- `id` (UUID): 記錄 ID

**請求標頭：**

```
Authorization: Bearer <token>
```

**響應 (200 OK)：**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "activityId": "550e8400-e29b-41d4-a716-446655440000",
  "source": "MANUAL",
  "duration": 1800,
  "executedAt": "2024-01-15T09:00:00Z",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**錯誤響應：**

- `404 Not Found`: 記錄不存在

---

### 6. 獲取記錄列表

**端點：** `GET /api/records`

**描述：** 獲取用戶的活動記錄列表，支持多種過濾條件

**查詢參數：**

- `activityId` (UUID, optional): 活動 ID 過濾
- `from` (string, optional): 開始時間過濾（ISO 8601 格式）
- `to` (string, optional): 結束時間過濾（ISO 8601 格式）
- `source` (string, optional): 記錄來源過濾 - "LIVE" 或 "MANUAL"
- `running` (boolean, optional): 僅顯示正在進行的 LIVE 記錄
- `page` (integer, optional): 頁碼（默認: 0）
- `size` (integer, optional): 每頁大小（默認: 20）

**請求標頭：**

```
Authorization: Bearer <token>
```

**響應 (200 OK)：**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "activityId": "550e8400-e29b-41d4-a716-446655440000",
      "source": "MANUAL",
      "duration": 1800,
      "executedAt": "2024-01-15T09:00:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "page": 0,
  "size": 20,
  "total": 1
}
```

---

### 7. 獲取正在進行的記錄

**端點：** `GET /api/records/running`

**描述：** 獲取用戶正在進行的 LIVE 記錄列表

**查詢參數：**

- `activityId` (UUID, optional): 活動 ID 過濾
- `page` (integer, optional): 頁碼（默認: 0）
- `size` (integer, optional): 每頁大小（默認: 20）

**請求標頭：**

```
Authorization: Bearer <token>
```

**響應 (200 OK)：**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "activityId": "550e8400-e29b-41d4-a716-446655440000",
      "source": "LIVE",
      "duration": null,
      "executedAt": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "page": 0,
  "size": 20,
  "total": 1
}
```

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

- `activityId` (string): 活動 ID

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

- `activityId` (string): 活動 ID

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

- `activityId` (string): 活動 ID
- `period` (string): 時間週期
- `periodStart` (string): 期間開始時間（ISO 8601 格式）
- `periodEnd` (string): 期間結束時間（ISO 8601 格式）
- `totalTime` (integer): 指定期間的總分鐘數
- `weeklyTarget` (integer): 每週目標分鐘數
- `scale` (number): 縮放比例（週=1.0，月/年=天數/7.0）
- `completionRate` (number): 完成率
- `weeklyTrend` (array): 最近 8 週的趨勢數據

**錯誤響應：**

- `404 Not Found`: 活動不存在

---

### 4. 獲取週趨勢數據

**端點：** `GET /api/statistics/weekly-trend`

**描述：** 獲取用戶或特定活動的週趨勢數據（最近 8 週）

**查詢參數：**

- `activityId` (string, optional): 活動 ID（如果不提供，則返回所有活動的總和）

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

### RecordResponse

```json
{
  "id": "string (UUID)",
  "activityId": "string (UUID)",
  "source": "string (LIVE|MANUAL)",
  "duration": "integer (seconds) | null",
  "executedAt": "string (ISO 8601)",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

### PagedRecordResponse

```json
{
  "data": "RecordResponse[]",
  "page": "integer",
  "size": "integer",
  "total": "integer"
}
```

### RecordCreateRequest

```json
{
  "activityId": "string (UUID)",
  "source": "string (LIVE|MANUAL)",
  "duration": "integer (seconds) | null",
  "executedAt": "string (ISO 8601)"
}
```

### RecordFinishRequest

```json
{
  "endAt": "string (ISO 8601)"
}
```

### RecordUpdateRequest

```json
{
  "activityId": "string (UUID)",
  "source": "string (LIVE|MANUAL)",
  "duration": "integer (seconds) | null",
  "executedAt": "string (ISO 8601)"
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
  const response = await fetch("/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });
  const data = await response.json();
  return data.accessToken;
};

// 創建活動
const createActivity = async (activityData: any, token: string) => {
  const response = await fetch("/api/activities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(activityData),
  });
  return response.json();
};

// 獲取統計摘要
const getSummary = async (period = "week", token: string) => {
  const response = await fetch(`/api/statistics/summary?period=${period}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// 獲取週趨勢
const getWeeklyTrend = async (activityId: string | null, token: string) => {
  const url = activityId
    ? `/api/statistics/weekly-trend?activityId=${activityId}`
    : "/api/statistics/weekly-trend";

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// 創建活動記錄
const createRecord = async (recordData: any, token: string) => {
  const response = await fetch("/api/records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(recordData),
  });
  return response.json();
};

// 完成LIVE記錄
const finishRecord = async (recordId: string, endAt: string, token: string) => {
  const response = await fetch(`/api/records/${recordId}/finish`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ endAt }),
  });
  return response.json();
};

// 獲取記錄列表
const getRecords = async (filters: any, token: string) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params.append(key, value.toString());
    }
  });

  const response = await fetch(`/api/records?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// 獲取正在進行的記錄
const getRunningRecords = async (activityId: string | null, token: string) => {
  const url = activityId
    ? `/api/records/running?activityId=${activityId}`
    : "/api/records/running";

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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

---

## 🎯 新增的前端專用 API

### 1. 活動分佈數據 API

**端點**: `GET /api/activities/{id}/distribution`

**用途**: 為分佈圖表提供數據，支援按天/週/月聚合

**查詢參數**:

- `from` (必填): 開始日期，格式 YYYY-MM-DD
- `to` (必填): 結束日期，格式 YYYY-MM-DD
- `grain` (必填): 時間粒度，`day` | `week` | `month`

**範例請求**:

```bash
GET /api/activities/123e4567-e89b-12d3-a456-426614174000/distribution?from=2025-09-01&to=2025-09-30&grain=day
Authorization: Bearer <your-jwt-token>
```

**回應格式**:

```json
[
  {
    "date": "2025-09-01",
    "durationSec": 0,
    "count": 0
  },
  {
    "date": "2025-09-02",
    "durationSec": 1800,
    "count": 1
  },
  {
    "date": "2025-09-03",
    "durationSec": 3600,
    "count": 2
  }
]
```

**錯誤響應：**

- `400 Bad Request`: 參數錯誤 (日期格式、時間粒度、範圍限制)
- `401 Unauthorized`: 未授權 (JWT token 無效)
- `404 Not Found`: 活動不存在
- `500 Internal Server Error`: 伺服器錯誤

---

### 2. 活動趨勢數據 API

**端點**: `GET /api/activities/{id}/trend`

**用途**: 為趨勢線圖提供數據，支援按週/月聚合

**查詢參數**:

- `from` (必填): 開始日期，格式 YYYY-MM-DD
- `to` (必填): 結束日期，格式 YYYY-MM-DD
- `grain` (必填): 時間粒度，`week` | `month`

**範例請求**:

```bash
GET /api/activities/123e4567-e89b-12d3-a456-426614174000/trend?from=2025-06-15&to=2025-09-09&grain=week
Authorization: Bearer <your-jwt-token>
```

**回應格式**:

```json
[
  {
    "periodStart": "2025-08-18",
    "totalDurationSec": 7200,
    "totalCount": 3
  },
  {
    "periodStart": "2025-08-25",
    "totalDurationSec": 9000,
    "totalCount": 4
  },
  {
    "periodStart": "2025-09-01",
    "totalDurationSec": 5400,
    "totalCount": 2
  }
]
```

**錯誤響應：**

- `400 Bad Request`: 參數錯誤 (日期格式、時間粒度、範圍限制)
- `401 Unauthorized`: 未授權 (JWT token 無效)
- `404 Not Found`: 活動不存在
- `500 Internal Server Error`: 伺服器錯誤

---

### 3. 活動 KPI 指標 API

**端點**: `GET /api/activities/{id}/kpis`

**用途**: 為 KPI 卡片提供統計指標

**查詢參數**:

- `from` (必填): 開始日期，格式 YYYY-MM-DD
- `to` (必填): 結束日期，格式 YYYY-MM-DD

**範例請求**:

```bash
GET /api/activities/123e4567-e89b-12d3-a456-426614174000/kpis?from=2025-09-02&to=2025-09-09
Authorization: Bearer <your-jwt-token>
```

**回應格式**:

```json
{
  "avgDurationSec": 1800,  
  "maxSingleDurationSec": 7200,
  "weekOverWeekChangePct": 0.15 
}
```

**參數說明：**

- `avgDurationSec` (integer): 平均每次記錄秒數 (30分鐘)
- `maxSingleDurationSec` (integer): 最長單次記錄秒數 (2小時)
- `weekOverWeekChangePct` (number): 週環比變化 (-1.0 到 +1.0) (+15%)

**錯誤響應：**

- `400 Bad Request`: 參數錯誤 (日期格式錯誤)
- `401 Unauthorized`: 未授權 (JWT token 無效)
- `404 Not Found`: 活動不存在
- `500 Internal Server Error`: 伺服器錯誤

---

## 🔧 新增 API 技術特性

### 數據一致性

- ✅ 統一使用 `Asia/Taipei` 時區
- ✅ 所有日期參數使用 `YYYY-MM-DD` 格式
- ✅ 後端儲存秒數，前端顯示分鐘
- ✅ 日期範圍使用半開區間 `[from, to)`

### API 設計一致性

- ✅ 遵循現有的錯誤處理模式
- ✅ 統一的驗證和授權機制
- ✅ 完整的 Swagger 文檔註解
- ✅ 一致的日誌記錄格式

### 性能優化

- ✅ 緩存機制 (Spring Cache)
- ✅ 查詢範圍限制防止性能問題
- ✅ 資料庫索引優化 (需要手動建立)
- ✅ 複雜 SQL 查詢優化

### 查詢範圍限制

- **日粒度**: 最多 90 天
- **週粒度**: 最多 1 年
- **月粒度**: 最多 3 年

---

## 🚀 前端使用流程

### 頁面載入時

```javascript
// 1. 獲取活動基本資訊
const activity = await fetch(`/api/activities/${activityId}`);

// 2. 獲取記錄總數
const records = await fetch(
  `/api/records?activityId=${activityId}&page=1&size=1`
);

// 3. 獲取統計數據
const distribution = await fetch(
  `/api/activities/${activityId}/distribution?from=2025-09-01&to=2025-09-30&grain=day`
);
const trend = await fetch(
  `/api/activities/${activityId}/trend?from=2025-06-15&to=2025-09-09&grain=week`
);
const kpis = await fetch(
  `/api/activities/${activityId}/kpis?from=2025-09-02&to=2025-09-09`
);
```

### 用戶操作時

```javascript
// 改變日期範圍 → 重新呼叫所有統計 API
const updateDateRange = (from, to) => {
  Promise.all([
    fetch(
      `/api/activities/${activityId}/distribution?from=${from}&to=${to}&grain=${currentGrain}`
    ),
    fetch(
      `/api/activities/${activityId}/trend?from=${from}&to=${to}&grain=${currentGrain}`
    ),
    fetch(`/api/activities/${activityId}/kpis?from=${from}&to=${to}`),
  ]);
};

// 改變時間粒度 → 重新呼叫分佈和趨勢 API
const updateGrain = (grain) => {
  Promise.all([
    fetch(
      `/api/activities/${activityId}/distribution?from=${from}&to=${to}&grain=${grain}`
    ),
    fetch(
      `/api/activities/${activityId}/trend?from=${from}&to=${to}&grain=${grain}`
    ),
  ]);
};
```

### 錯誤處理範例

```javascript
try {
  const response = await fetch(
    `/api/activities/${activityId}/distribution?from=${from}&to=${to}&grain=${grain}`
  );

  if (!response.ok) {
    switch (response.status) {
      case 400:
        showError("參數錯誤，請檢查日期格式和範圍");
        break;
      case 401:
        redirectToLogin();
        break;
      case 404:
        showError("活動不存在");
        break;
      default:
        showError("伺服器錯誤，請稍後再試");
    }
    return;
  }

  const data = await response.json();
  updateChart(data);
} catch (error) {
  showError("網路錯誤，請檢查連線");
}
```

---

## 📋 完整 API 端點總覽

| 方法    | 端點                                       | 描述                  | 認證   |
| ------- | ------------------------------------------ | --------------------- | ------ |
| POST    | `/auth/google`                             | Google OAuth 登入     | ❌     |
| GET     | `/api/me`                                  | 獲取當前用戶信息      | ✅     |
| GET     | `/health`                                  | 健康檢查              | ❌     |
| POST    | `/api/activities`                          | 創建新活動            | ✅     |
| GET     | `/api/activities`                          | 獲取所有活動          | ✅     |
| GET     | `/api/activities/{id}`                     | 獲取單一活動          | ✅     |
| PUT     | `/api/activities/{id}`                     | 更新活動              | ✅     |
| DELETE  | `/api/activities/{id}`                     | 刪除活動              | ✅     |
| **GET** | **`/api/activities/{id}/distribution`**    | **獲取活動分佈數據**  | **✅** |
| **GET** | **`/api/activities/{id}/trend`**           | **獲取活動趨勢數據**  | **✅** |
| **GET** | **`/api/activities/{id}/kpis`**            | **獲取活動 KPI 指標** | **✅** |
| POST    | `/api/records`                             | 創建活動記錄          | ✅     |
| PATCH   | `/api/records/{id}/finish`                 | 完成 LIVE 記錄        | ✅     |
| PUT     | `/api/records/{id}`                        | 更新記錄              | ✅     |
| DELETE  | `/api/records/{id}`                        | 刪除記錄              | ✅     |
| GET     | `/api/records/{id}`                        | 獲取單一記錄          | ✅     |
| GET     | `/api/records`                             | 獲取記錄列表          | ✅     |
| GET     | `/api/records/running`                     | 獲取正在進行的記錄    | ✅     |
| GET     | `/api/statistics/summary`                  | 獲取統計摘要          | ✅     |
| GET     | `/api/statistics/activities/{id}`          | 獲取活動統計（簡化）  | ✅     |
| GET     | `/api/statistics/activities/{id}/detailed` | 獲取活動統計（詳細）  | ✅     |
| GET     | `/api/statistics/weekly-trend`             | 獲取週趨勢數據        | ✅     |

**粗體標示為新增的前端專用 API**

---

_最後更新：2025 年 9 月_12 號
