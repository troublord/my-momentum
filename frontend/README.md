# MyMomentum

MyMomentum 是一款通用的時間紀錄與習慣追蹤工具，幫助使用者看見日常中的小努力，建立正向循環。

## 🎯 專案特色

- 極簡介面：直覺的操作流程
- 彈性紀錄：支援即時與手動紀錄
- 可視化成就：清晰展示進度與統計
- Google 帳號整合：安全便利的登入體驗

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
│   ├── components/     # React 組件
│   │   ├── ActivityCard.tsx
│   │   ├── ActivityGrid.tsx
│   │   ├── AddActivityCard.tsx
│   │   ├── Header.tsx
│   │   ├── IntroPage.tsx
│   │   ├── RecordPanel.tsx
│   │   └── SummarySection.tsx
│   ├── contexts/      # React Context
│   │   └── AuthContext.tsx
│   ├── services/      # API 服務
│   │   └── auth.ts
│   ├── types/         # TypeScript 型別
│   │   └── index.ts
│   ├── App.tsx        # 應用程式入口
│   └── index.tsx      # React 入口
└── package.json
```

## 🛠️ 使用技術

- React 18
- TypeScript
- TailwindCSS
- @react-oauth/google
- jwt-decode

## 🔄 API 端點

### Google 登入
```
POST /auth/google
Content-Type: application/json

Request:
{
    "idToken": "Google ID Token"
}

Response:
{
    "accessToken": "JWT Token"
}
```

## 👥 開發團隊

- [您的名字/團隊成員]

## 📝 授權

[授權方式]

## 🤝 貢獻指南

1. Fork 專案
2. 建立特性分支
3. 提交變更
4. 發送 Pull Request

## 📮 聯絡方式

[聯絡資訊]
