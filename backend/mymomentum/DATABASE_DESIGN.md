# MyMomentum 資料庫設計文檔

## 概述

MyMomentum 使用 PostgreSQL 16 作為主要資料庫，採用 Flyway 進行資料庫版本管理。資料庫設計遵循正規化原則，支援多用戶活動追蹤系統。

## 資料庫配置

- **資料庫類型**: PostgreSQL 16
- **主機**: localhost
- **端口**: 15432
- **資料庫名**: mymomentumdb
- **用戶名**: mymomentum
- **密碼**: secret123
- **版本管理**: Flyway
- **UUID 支援**: pgcrypto extension

## 資料表結構

### 1. users 表

用戶基本資訊表，支援 Google OAuth 登入。

| 欄位名稱   | 資料類型     | 約束條件                  | 說明                    |
| ---------- | ------------ | ------------------------- | ----------------------- |
| id         | BIGSERIAL    | PRIMARY KEY               | 用戶唯一識別碼          |
| email      | VARCHAR(255) | UNIQUE (case-insensitive) | 用戶電子郵件            |
| name       | VARCHAR(255) | -                         | 用戶顯示名稱            |
| google_sub | VARCHAR(255) | NOT NULL, UNIQUE          | Google OAuth Subject ID |
| created_at | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()   | 建立時間                |
| updated_at | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()   | 更新時間                |

**索引:**

- `idx_users_google_sub`: google_sub 唯一索引
- `uq_users_email_ci`: email 不區分大小寫唯一索引

### 2. activities 表

活動定義表，每個用戶可以建立多個活動。

| 欄位名稱    | 資料類型     | 約束條件                               | 說明                 |
| ----------- | ------------ | -------------------------------------- | -------------------- |
| id          | UUID         | PRIMARY KEY, DEFAULT gen_random_uuid() | 活動唯一識別碼       |
| user_id     | BIGINT       | NOT NULL, FK to users(id)              | 所屬用戶 ID          |
| name        | VARCHAR(100) | NOT NULL                               | 活動名稱             |
| target_time | INT          | NOT NULL, DEFAULT 0, CHECK >= 0        | 每週目標時間（分鐘） |
| color       | VARCHAR(16)  | -                                      | 活動顏色代碼         |
| icon        | VARCHAR(16)  | -                                      | 活動圖示代碼         |
| created_at  | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()                | 建立時間             |
| updated_at  | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()                | 更新時間             |

**約束條件:**

- `uq_activity_name_per_user`: 同一用戶的活動名稱必須唯一

**索引:**

- `idx_activities_user`: user_id 索引

### 3. activity_records 表

活動記錄表，記錄用戶執行的活動。

| 欄位名稱    | 資料類型      | 約束條件                               | 說明                                      |
| ----------- | ------------- | -------------------------------------- | ----------------------------------------- |
| id          | UUID          | PRIMARY KEY, DEFAULT gen_random_uuid() | 記錄唯一識別碼                            |
| user_id     | BIGINT        | NOT NULL, FK to users(id)              | 所屬用戶 ID                               |
| activity_id | UUID          | NOT NULL, FK to activities(id)         | 所屬活動 ID                               |
| source      | record_source | NOT NULL                               | 記錄來源 (LIVE/MANUAL)                    |
| duration    | INT           | CHECK (IS NULL OR > 0)                 | 持續時間（秒），進行中的 LIVE 記錄為 NULL |
| executed_at | TIMESTAMPTZ   | NOT NULL                               | 執行時間（時區感知）                      |
| created_at  | TIMESTAMPTZ   | NOT NULL, DEFAULT NOW()                | 建立時間                                  |
| updated_at  | TIMESTAMPTZ   | NOT NULL, DEFAULT NOW()                | 更新時間                                  |

**約束條件:**

- `uq_live_record_per_activity`: 每個用戶的每個活動只能有一個進行中的 LIVE 記錄

**索引:**

- `idx_records_user_time`: (user_id, executed_at DESC) 複合索引
- `idx_records_activity_time`: (activity_id, executed_at DESC) 複合索引

### 4. record_source 枚舉類型

記錄來源枚舉，定義在資料庫層級。

```sql
CREATE TYPE record_source AS ENUM ('LIVE', 'MANUAL');
```

- **LIVE**: 即時記錄，進行中時 duration 為 NULL
- **MANUAL**: 手動記錄，建立時即包含完整 duration

## 實體關聯

### 關聯關係

1. **User → Activities**: 一對多

   - 一個用戶可以有多個活動
   - 外鍵: activities.user_id → users.id
   - 級聯刪除: CASCADE

2. **User → ActivityRecords**: 一對多

   - 一個用戶可以有多個活動記錄
   - 外鍵: activity_records.user_id → users.id
   - 級聯刪除: CASCADE

3. **Activity → ActivityRecords**: 一對多
   - 一個活動可以有多個記錄
   - 外鍵: activity_records.activity_id → activities.id
   - 級聯刪除: CASCADE

### 業務規則

1. **活動名稱唯一性**: 同一用戶的活動名稱必須唯一
2. **進行中記錄限制**: 每個用戶的每個活動只能有一個進行中的 LIVE 記錄
3. **記錄完整性**: MANUAL 記錄必須有 duration，LIVE 記錄進行中時 duration 為 NULL
4. **時間一致性**: 所有時間欄位使用 TIMESTAMPTZ 確保時區一致性

## 索引策略

### 主要查詢模式

1. **用戶活動查詢**: 根據 user_id 查詢活動列表
2. **活動記錄查詢**: 根據 user_id 和時間範圍查詢記錄
3. **特定活動記錄**: 根據 activity_id 查詢記錄
4. **最新記錄查詢**: 按時間倒序查詢最新記錄

### 索引設計

- **主鍵索引**: 所有表的主鍵自動建立
- **外鍵索引**: 支援關聯查詢效能
- **複合索引**: 支援多條件查詢
- **唯一索引**: 確保資料完整性
- **部分索引**: 針對特定條件的查詢優化

## 資料庫擴展

### 已啟用擴展

- **pgcrypto**: 提供 UUID 生成功能

### 建議擴展

- **pg_stat_statements**: 查詢效能監控
- **pg_trgm**: 全文搜尋支援（如需要）

## 效能考量

### 查詢優化

1. **分頁查詢**: 使用 LIMIT/OFFSET 或游標分頁
2. **時間範圍查詢**: 利用 executed_at 索引
3. **統計查詢**: 預先計算常用統計資料

### 資料維護

1. **定期清理**: 清理過期或無效記錄
2. **統計更新**: 定期更新統計資訊
3. **索引維護**: 監控索引使用情況

## 備份與恢復

### 備份策略

1. **定期備份**: 每日全量備份
2. **增量備份**: 每小時增量備份
3. **WAL 備份**: 持續 WAL 歸檔

### 恢復測試

1. **定期測試**: 每月進行恢復測試
2. **災難恢復**: 建立災難恢復程序
3. **資料驗證**: 恢復後驗證資料完整性

## 安全性

### 存取控制

1. **最小權限原則**: 應用程式使用專用資料庫用戶
2. **連線加密**: 使用 SSL/TLS 加密連線
3. **密碼策略**: 強密碼要求

### 資料保護

1. **敏感資料**: 不儲存敏感個人資訊
2. **資料加密**: 必要時使用欄位級加密
3. **審計日誌**: 記錄重要操作

## 監控與維護

### 效能監控

1. **慢查詢監控**: 識別效能瓶頸
2. **連線監控**: 監控資料庫連線數
3. **資源使用**: 監控 CPU、記憶體、磁碟使用

### 維護任務

1. **統計更新**: 定期更新查詢統計
2. **索引重建**: 必要時重建索引
3. **資料庫清理**: 清理無用資料

---

_最後更新: 2024 年 12 月_
