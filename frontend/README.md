# MyMomentum Frontend

MyMomentum 是一個個人習慣追蹤與活動紀錄工具，讓使用者簡單紀錄自己做了什麼、做了多久，並從中看見時間的累積與進步。

## 功能特色

- **即時紀錄**: 像番茄鐘一樣按「開始」和「結束」，系統自動計算時間
- **事後紀錄**: 使用者手動填寫活動名稱、時間與日期
- **活動追蹤**: 顯示累積總時間、本週時間、進度完成率
- **視覺化進度**: 圓形進度條顯示完成率
- **響應式設計**: 支援桌機和行動裝置

## 技術棧

- React 18
- TypeScript
- TailwindCSS
- React Scripts

## 安裝與執行

1. 安裝依賴：

```bash
npm install
```

2. 啟動開發伺服器：

```bash
npm start
```

3. 開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

## 專案結構

```
src/
├── components/          # React 元件
│   ├── Header.tsx      # 頁面標題和導覽
│   ├── SummarySection.tsx  # 總體摘要區塊
│   ├── ActivityCard.tsx    # 活動卡片
│   ├── AddActivityCard.tsx # 新增活動卡片
│   ├── ActivityGrid.tsx    # 活動卡片網格
│   └── RecordPanel.tsx     # 右側紀錄面板
├── types/              # TypeScript 類型定義
├── data/               # Mock 資料
├── App.tsx             # 主要應用程式元件
└── index.tsx           # 應用程式入口點
```

## 主要元件說明

### Header

- Logo 和導覽列
- 包含「全部活動」和「設定」連結

### SummarySection

- 顯示本週累積時間
- 最常做的活動
- 進度完成率

### ActivityGrid

- 活動卡片網格佈局
- 每張卡片顯示活動資訊和進度
- 包含新增活動的卡片

### RecordPanel

- 右側固定的紀錄面板
- 支援即時紀錄和事後紀錄
- 活動選擇和時間設定

## 開發說明

目前使用 Mock 資料進行靜態畫面展示，包含：

- 6 個範例活動（閱讀、運動、程式設計、冥想、寫作、學習語言）
- 本週摘要資料
- 基本的互動功能（點擊事件、表單操作）

後續可以整合：

- API 串接
- 狀態管理（Redux/Context）
- 路由功能
- 資料持久化
