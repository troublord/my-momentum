# MyMomentum

MyMomentum 是一款通用的時間紀錄與習慣追蹤工具，幫助使用者看見日常中的小努力，建立正向循環。

## 🎯 專案特色

- **極簡介面**：直覺的操作流程，現代化 UI 設計
- **彈性紀錄**：支援即時計時與手動紀錄兩種模式
- **完整 CRUD**：活動的創建、編輯、刪除功能
- **即時統計**：動態更新的進度追蹤與週統計
- **可視化成就**：清晰展示進度圓圈與完成率
- **詳細分析**：活動詳情頁面與深度數據分析
- **互動圖表**：Recharts 驅動的分佈圖與趨勢圖
- **智慧錯誤處理**：友善的錯誤提示與狀態管理
- **Google 帳號整合**：安全便利的 OAuth 登入體驗

## 🚀 快速開始

### 前置需求

- Node.js 16+
- npm 8+
- 後端服務 (預設: `http://localhost:8080`)

### 安裝步驟

1. 複製專案

```bash
git clone [your-repo-url]
cd MyMomentum/frontend
```

2. 安裝依賴

```bash
npm install
```

3. 設定環境變數

```bash
# 開發環境 (.env.local)
REACT_APP_API_URL=http://localhost:8080
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id

# 生產環境 (.env.production)
REACT_APP_API_URL=https://my-momentum.app/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

**環境變數說明：**
- `REACT_APP_API_URL`: 後端 API 基礎 URL
- `REACT_APP_GOOGLE_CLIENT_ID`: Google OAuth Client ID

4. 啟動開發伺服器

```bash
npm start
```

應用程式將在 `http://localhost:3000` 啟動。

## 🔐 Google OAuth 設定

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立或選擇專案
3. 在 "API 和服務" > "憑證" 中建立 OAuth 2.0 用戶端 ID
4. 設定已授權的 JavaScript 來源：
   - 開發環境：`http://localhost:3000`
   - 生產環境：`https://my-momentum.app`
5. 複製用戶端 ID 並設定環境變數：

```bash
# 開發環境
REACT_APP_GOOGLE_CLIENT_ID=your-client-id

# 生產環境  
REACT_APP_GOOGLE_CLIENT_ID=your-client-id
```

## 📁 專案結構

```
frontend/
├── public/
├── src/
│   ├── components/           # React 組件
│   │   ├── activity/             # 活動相關組件
│   │   │   ├── ActivityDetailCharts.tsx # 活動詳情圖表
│   │   │   ├── ChartCard.tsx     # 圖表卡片容器
│   │   │   └── KpiCard.tsx       # KPI 指標卡片
│   │   ├── ActivityCard.tsx      # 活動卡片（含編輯/刪除功能）
│   │   ├── ActivityGrid.tsx      # 活動網格佈局
│   │   ├── AddActivityCard.tsx   # 新增活動卡片
│   │   ├── CreateActivityModal.tsx # 創建活動彈窗
│   │   ├── EditActivityModal.tsx   # 編輯活動彈窗
│   │   ├── DeleteConfirmationModal.tsx # 刪除確認彈窗
│   │   ├── ErrorContainer.tsx    # 錯誤通知容器
│   │   ├── ErrorToast.tsx        # 錯誤提示組件
│   │   ├── Header.tsx            # 頁面標題列
│   │   ├── IntroPage.tsx         # 登入引導頁
│   │   ├── RecordPanel.tsx       # 記錄面板（即時/手動記錄）
│   │   └── SummarySection.tsx    # 統計摘要區塊
│   ├── pages/               # 頁面組件
│   │   └── ActivityDetailPage.tsx # 活動詳情頁面
│   ├── contexts/            # React Context
│   │   ├── AuthContext.tsx      # 身份驗證上下文
│   │   └── ErrorContext.tsx     # 錯誤處理上下文
│   ├── services/            # API 服務層
│   │   ├── api.ts              # 基礎 API 服務
│   │   ├── activities.ts       # 活動相關 API
│   │   ├── activityStats.ts    # 活動統計 API
│   │   ├── auth.ts            # 身份驗證 API
│   │   ├── records.ts         # 記錄相關 API
│   │   └── statistics.ts      # 統計相關 API
│   ├── mocks/               # Mock 服務
│   │   ├── handlers/            # MSW 處理器
│   │   │   └── activityStats.ts # 活動統計 Mock
│   │   ├── browser.ts          # 瀏覽器 Mock 設定
│   │   ├── server.ts           # 伺服器 Mock 設定
│   │   └── index.ts            # Mock 初始化
│   ├── types/               # TypeScript 型別定義
│   │   ├── index.ts           # 基礎型別
│   │   └── records.ts         # 記錄相關型別
│   ├── constants/           # 常數定義
│   │   └── emoji.ts           # 活動圖示定義
│   ├── App.tsx             # 應用程式主組件
│   ├── index.tsx           # React 應用程式入口
│   └── index.css           # 全域樣式
└── package.json
```

## 🛠️ 使用技術

### 前端框架

- **React 18** - 現代化 React 框架
- **TypeScript** - 型別安全的 JavaScript
- **TailwindCSS** - 實用優先的 CSS 框架
- **React Router v7** - 客戶端路由管理

### 狀態管理

- **React Context** - 全域狀態管理
- **React Hooks** - 組件狀態邏輯

### 資料視覺化

- **Recharts** - 互動式圖表庫
- **ResponsiveContainer** - 響應式圖表容器

### API 整合

- **Fetch API** - HTTP 請求處理
- **JWT** - 身份驗證令牌管理
- **@react-oauth/google** - Google OAuth 整合
- **jwt-decode** - JWT 令牌解析
- **MSW** - Mock Service Worker 開發環境模擬
- **自定義 Hooks** - 封裝 API 調用邏輯

### 開發工具

- **ESLint** - 程式碼品質檢查
- **Prettier** - 程式碼格式化
- **PostCSS** - CSS 後處理器
- **Autoprefixer** - CSS 自動前綴

## 🔄 API 端點

### 身份驗證

```
POST /auth/google
Content-Type: application/json
```

### 活動管理

```
GET    /api/activities        # 獲取所有活動
POST   /api/activities        # 創建新活動
GET    /api/activities/{id}   # 獲取單一活動
PUT    /api/activities/{id}   # 更新活動
DELETE /api/activities/{id}   # 刪除活動
```

### 記錄管理

```
GET    /api/records           # 獲取記錄列表
POST   /api/records           # 創建新記錄
PATCH  /api/records/{id}/finish # 完成即時記錄
GET    /api/records/running   # 獲取進行中的記錄
```

### 統計資料

```
GET /api/statistics/summary           # 獲取統計摘要
GET /api/statistics/activities/{id}   # 獲取活動統計
GET /api/statistics/weekly-trend      # 獲取週趨勢
GET /api/statistics/last-day-records  # 獲取昨日記錄
```

### 活動詳情分析

```
GET /api/activities/{id}/distribution # 獲取活動分佈數據
GET /api/activities/{id}/trend        # 獲取活動趨勢數據
GET /api/activities/{id}/kpis         # 獲取活動 KPI 指標
```

## ✨ 核心功能

### 🎯 活動管理

- **創建活動**：選擇名稱、目標時間、顏色和圖示
- **編輯活動**：修改現有活動的任何屬性
- **刪除活動**：安全刪除含確認對話框
- **視覺化進度**：圓形進度條顯示完成率

### ⏱️ 時間記錄

- **即時記錄**：一鍵開始/停止，即時計時器顯示
- **手動記錄**：事後補錄，支援日期和時間選擇
- **自動同步**：記錄完成後立即更新統計資料
- **單位轉換**：前端分鐘，後端秒數，自動轉換

### 📊 統計分析

- **週摘要**：本週累積時間、最常做活動、完成率
- **活動統計**：每個活動的總時間和週時間
- **進度追蹤**：視覺化的進度圓圈和百分比

### 📈 詳細分析 (新增)

- **活動詳情頁**：點擊活動卡片進入深度分析頁面
- **分佈圖表**：按天/週/月顯示活動時間分佈
- **趨勢分析**：長期趨勢線圖展示活動變化
- **KPI 指標**：平均時長、最長記錄、週環比變化
- **互動控制**：切換指標類型、時間粒度、日期範圍
- **響應式設計**：完美適配桌面和行動裝置

### 🛡️ 錯誤處理

- **友善提示**：Toast 通知系統，支援成功/警告/錯誤
- **特殊情況**：409 衝突錯誤的客製化訊息
- **載入狀態**：所有異步操作的載入指示器
- **自動重試**：網路錯誤的智慧處理

## 🚦 開發狀態

### ✅ 已完成功能

- [x] Google OAuth 身份驗證
- [x] 活動完整 CRUD 操作
- [x] 即時記錄功能（計時器）
- [x] 手動記錄功能
- [x] 統計摘要顯示
- [x] 錯誤處理系統
- [x] 響應式設計
- [x] 資料即時同步
- [x] 活動詳情頁面
- [x] 互動式圖表分析
- [x] KPI 指標展示
- [x] MSW 開發環境模擬
- [x] React Router 客戶端路由
- [x] 昨日記錄顯示
- [x] 自定義 Hooks API 封裝
- [x] 載入狀態管理
- [x] 錯誤邊界處理

### 🚧 開發中功能

- [ ] 記錄歷史查看
- [ ] 活動分類系統
- [ ] 匯出資料功能

### 🎯 未來規劃

- [ ] 行動應用程式
- [ ] 多語言支援
- [ ] 深色模式
- [ ] 社群分享功能

## 📋 API 規格文件

### 後端開發者請參考

本專案前端需要以下 API 端點，詳細規格請參考：

#### 核心 API 端點

- **身份驗證**: `POST /auth/google`
- **活動管理**: `GET|POST|PUT|DELETE /api/activities`
- **記錄管理**: `GET|POST|PUT|DELETE /api/records`
- **統計資料**: `GET /api/statistics/summary`

#### 新增分析 API 端點

- **活動分佈**: `GET /api/activities/{id}/distribution`
- **活動趨勢**: `GET /api/activities/{id}/trend`
- **活動 KPI**: `GET /api/activities/{id}/kpis`
- **昨日記錄**: `GET /api/statistics/last-day-records`

#### 資料格式要求

- 時間單位：前端顯示分鐘，後端儲存秒數
- 日期格式：API 參數使用 `YYYY-MM-DD`，回應使用 ISO8601
- 時區：所有時間計算基於 `Asia/Taipei`
- 分頁：支援 `page` 和 `size` 參數

#### 認證要求

- 所有 API 請求需要 `Authorization: Bearer <token>` 標頭
- 401 回應會觸發前端重新導向至登入頁面

詳細的 API 規格文件包含完整的請求/回應格式、資料型別定義和範例資料，請聯絡前端開發團隊取得完整文件。

## 🔧 開發指南

### 程式碼風格

```bash
# 格式化程式碼
npm run format

# 檢查程式碼品質
npm run lint

# 修復可自動修復的問題
npm run lint:fix
```

### 測試

```bash
# 執行所有測試
npm test

# 執行測試覆蓋率
npm run test:coverage
```

### 建置

```bash
# 建置生產版本
npm run build

# 預覽建置結果
npm run preview
```

## 👥 開發團隊

- **劉毓文** - 全端開發工程師

## 📝 版本歷史

### v1.4.0 (2024-12-19)

- ✨ 新增環境配置分離支援
- ✨ 更新網域設定支援 my-momentum.app
- ✨ 前端 API URL 支援環境變數配置
- ✨ Google Client ID 支援環境變數配置
- 🔧 優化開發與生產環境配置管理

### v1.3.0 (2024-12-19)

- ✨ 新增活動詳情頁面與深度分析功能
- ✨ 實現互動式圖表（分佈圖、趨勢圖）
- ✨ 添加 KPI 指標展示（平均時長、最長記錄、週環比）
- ✨ 整合 MSW 開發環境模擬
- ✨ 新增 React Router v7 客戶端路由
- ✨ 新增昨日記錄顯示功能
- ✨ 實現自定義 Hooks API 封裝
- ✨ 完善錯誤邊界處理機制
- 🐛 修復無限 API 調用問題
- 🎨 完善響應式設計與載入狀態

### v1.2.0 (2024-12-19)

- ✨ 新增完整記錄功能（即時/手動）
- ✨ 實現活動編輯和刪除功能
- ✨ 添加全域錯誤處理系統
- 🐛 修復無限 API 調用問題
- 🎨 改善 UI/UX 和載入狀態

### v1.1.0 (2024-12-18)

- ✨ 新增活動創建功能
- ✨ 實現基礎統計顯示
- 🎨 完善響應式設計

### v1.0.0 (2024-12-17)

- 🎉 初始版本發布
- ✨ Google OAuth 登入
- ✨ 基礎活動管理

## 📝 授權

MIT License - 詳見 [LICENSE](LICENSE) 文件

## 🤝 貢獻指南

1. **Fork 專案** - 點擊右上角 Fork 按鈕
2. **建立分支** - `git checkout -b feature/amazing-feature`
3. **提交變更** - `git commit -m 'feat: add amazing feature'`
4. **推送分支** - `git push origin feature/amazing-feature`
5. **發送 PR** - 開啟 Pull Request

### 提交訊息格式

```
feat: 新功能
fix: 修復問題
docs: 文件更新
style: 程式碼格式
refactor: 重構
test: 測試相關
chore: 建置工具或輔助工具
```

## 📮 聯絡方式

- **Email**: [聯絡信箱]
- **GitHub**: [GitHub 連結]
- **Issues**: [回報問題](../../issues)
