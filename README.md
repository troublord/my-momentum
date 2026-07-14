# MyMomentum

一個完整開發並正式上線過的個人習慣追蹤 / 活動紀錄工具：用番茄鐘式的「開始／結束」按鈕自動計算時間，並將累積時數、週時數、完成率視覺化呈現。

> **狀態：已下線（2025-11 停止維護）**
> 曾在 [my-momentum.app](https://my-momentum.app) 正式營運，2025-11 因主機成本上升、且市面上出現更完整的替代方案 [lofi.town](https://app.lofi.town/)，故停止維護並下線。這個 repo 保留下來作為完整全端專案的作品紀錄。

## 這是什麼

- **番茄鐘式計時**：按下開始／結束，系統自動計算耗時
- **手動輸入**：也可以直接補登時間
- **登入與個人資料**：Google OAuth 登入，每人保有自己的紀錄
- **統計視覺化**：累積總時數、週時數、完成率，圓形進度條呈現

## 技術架構

| 部分 | 技術 |
|---|---|
| 前端 | React 18、TypeScript、TailwindCSS |
| 後端 | Spring Boot、Java 17 |
| 資料庫 | PostgreSQL |
| 驗證 | Google OAuth + JWT |
| 部署 | AWS EC2、Docker、Nginx 反向代理 |
| CI/CD | GitHub Actions（dev → production 自動 PR + 部署） |

my-momentum/
├── frontend/          React + TypeScript 前端
├── backend/           Spring Boot 後端
├── mymomentum-db/      Postgres 本地開發設定
├── nginx/              反向代理設定
├── .github/            CI/CD workflow
└── docs/ / documents/  專案文件

## 開發時間軸

| 時間 | 里程碑 |
|---|---|
| 2025-07-30 | 第一個 commit，前端 prototype |
| 2025-08 ~ 09 | 全端快速開發 |
| 2025-10-26 | 正式部署上線，接上 my-momentum.app 域名 |
| 2025-10-30 | CI/CD 建置完成（GitHub Actions 自動 PR + 部署） |
| 2025-11-18 | 最後功能更新：活動總覽儀表板 |
| 2025-11-22 | 停止維護 |

約 4 個月完成從 0 到正式上線的完整全端開發。

## 上線期間成果

即使完全沒有主動推廣，下線前最後 30 天仍有 1,310 名 unique visitors、15,230 次請求造訪（多數為爬蟲流量，真實活躍使用者約 30 人/月）。

## 停止維護原因

- **成本**：AWS 免費額度用完後每月約 900 NTD，超出預期且專案沒有收入
- **替代方案**：lofi.town 已能滿足 90% 的核心需求，繼續維護的動機降低

---

## 授權 / 使用說明

個人專案，僅作為作品參考展示，未提供對外授權或支援。
