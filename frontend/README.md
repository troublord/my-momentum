# MyMomentum

MyMomentum 是一款通用的時間紀錄與習慣追蹤工具，幫助使用者看見日常中的小努力，建立正向循環。

## 🎯 專案特色

- **極簡介面**：直覺的操作流程，現代化 UI 設計
- **彈性紀錄**：支援即時計時與手動紀錄兩種模式
- **完整 CRUD**：活動的創建、編輯、刪除功能
- **即時統計**：動態更新的進度追蹤與週統計
- **可視化成就**：清晰展示進度圓圈與完成率
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
# .env
REACT_APP_API_URL=http://localhost:8080
```

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
   - 生產環境：您的網域
5. 複製用戶端 ID 並更新 `src/index.tsx`：

```typescript
<GoogleOAuthProvider clientId="your-client-id">
```

## 📁 專案結構

```
frontend/
├── public/
├── src/
│   ├── components/           # React 組件
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
│   ├── contexts/            # React Context
│   │   ├── AuthContext.tsx      # 身份驗證上下文
│   │   └── ErrorContext.tsx     # 錯誤處理上下文
│   ├── services/            # API 服務層
│   │   ├── api.ts              # 基礎 API 服務
│   │   ├── activities.ts       # 活動相關 API
│   │   ├── auth.ts            # 身份驗證 API
│   │   ├── records.ts         # 記錄相關 API
│   │   └── statistics.ts      # 統計相關 API
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

### 狀態管理
- **React Context** - 全域狀態管理
- **React Hooks** - 組件狀態邏輯

### API 整合
- **Fetch API** - HTTP 請求處理
- **JWT** - 身份驗證令牌管理
- **@react-oauth/google** - Google OAuth 整合
- **jwt-decode** - JWT 令牌解析

### 開發工具
- **ESLint** - 程式碼品質檢查
- **Prettier** - 程式碼格式化

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
GET    /api/records/{id}      # 獲取單一記錄
PUT    /api/records/{id}      # 更新記錄
DELETE /api/records/{id}      # 刪除記錄
PATCH  /api/records/{id}/finish # 完成即時記錄
GET    /api/records/running   # 獲取進行中的記錄
```

### 統計資料
```
GET /api/statistics/summary           # 獲取統計摘要
GET /api/statistics/activities/{id}   # 獲取活動統計
GET /api/statistics/weekly-trend      # 獲取週趨勢
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

### 🚧 開發中功能
- [ ] 記錄歷史查看
- [ ] 統計圖表視覺化
- [ ] 活動分類系統
- [ ] 匯出資料功能

### 🎯 未來規劃
- [ ] 行動應用程式
- [ ] 多語言支援
- [ ] 深色模式
- [ ] 社群分享功能

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
