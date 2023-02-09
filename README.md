# PartyGame

[![](https://i.imgur.com/a0YINuO.png)](https://youtu.be/vo5YG96lcps)
上圖附有影片連結

> 此專案參考 [2022 鐵人賽 派對動物嗨起來](https://ithelp.ithome.com.tw/users/20140213/ironman/5661) 主要用來學習 babylon.js，與教學不同的地方在於本專案的框架採用React，內部所使用之素材皆由該鐵人賽中取得，非營利用途，僅為學習用途。


## 畫面
![](https://i.imgur.com/JorU4tB.jpg)

![](https://i.imgur.com/NrZXOtN.png)

![](https://i.imgur.com/vpmiC6n.png)


## 遊玩方式

使用電腦開啟派對

用行動裝置點選加入派對，並輸入派對密碼

等玩家都加入派對後即可開始遊戲


## 安裝

以下將會引導你如何安裝此專案到你的電腦上。


### 取得專案

```bash
git clone https://github.com/charlie871105/PartyGame.git
```

### 移動到專案內

##### 前端
```bash
cd PartyGame/client
```
##### 後端
```bash
cd PartyGame/server
```

### 安裝套件

##### 前端
```bash
yarn
```
##### 後端
```bash
yarn
```

### 環境變數設定

##### 前端

請在終端機輸入 `cp .env.example .env` 來複製 .env.example 檔案，並依據 `.env` 內容調整相關欄位。

### 運行專案

##### 前端
```bash
yarn start
```
##### 後端
```bash
yarn dev
```

### 開啟專案

在瀏覽器網址列輸入以下即可看到畫面

```bash
http://[VITE_HOST]:5173/
```
VITE_HOST 為環境變數裡面配置的IP

## 環境變數說明

##### 前端
```env
VITE_HOST= # 使用者IP位置
```

## 資料夾說明


- client - 前端
    - src
        - common - 放置常數、util function
        - pages
        - redux
        - components
        - context - 此專案用context提供全域的socket物件
        - game
        - hooks
        - router
        - style
        - types
- server - 後端
    - src
        - game-console - 處理遊戲資訊
        - room - 處理將socket group的邏輯
        - ws-client -處理socket連線
        - types
        - utils




## 專案技術

##### 前端
- dependencies
    - react
    - babylonjs - 建立3D場景
    - cannon - 提供物理引擎
    - react-babylonjs - 以react的風格使用babylonjs
    - material ui
    - reduxjs/toolkit - 處理資料流
    - colord - 處理顏色
    - nanoid
    - react-joystick-component - 類比搖桿元件
    - react-toastify - 提供全域的toast元件
    - react-router-dom - 處理router
    - react-transition-group - 處理 transition動畫
    - socket.io-client - 處理client sokcet連線
- devDependencies
    - vite
    - typescript
    - tailwindcss
    - sass
    - postcss
    - autoprefixer
    - eslint
    - prettier 

##### 後端
- dependencies
    - nestjs
    - lodash
    - nanoid
- devDependencies
    - typescript
    - eslint
    - prettier

## 聯絡作者

- EMAIL : B06501012@gmail.com 
