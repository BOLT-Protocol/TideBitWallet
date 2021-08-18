# TideBitWallet
Chrome Extension for TideWallet3
### setup
1. 基本的folder架構
```
.
├── build                   # 最終放在chrome extension 上的東西
│   ├── css         
│   │   └── main.css        # 彈出視窗的畫面的css放在popup.html裡面
│   ├── image         
│   │   └── ...
│   └── javascript          # 畫彈出視窗的畫面的script,直接放在popup.html裡面的body tag
│   │   └── bundle.js       # 使用webpack生成  
│   ├──manifest.json        # chrome extension的進入點
│   ├──popup.html           # chrome extension 彈出視窗的畫面
│   ├──background.js        # (我還沒用到,待補充)
│   │   
│   │   
├── src                     # 實際開發的地方
│   ├── image               # Load and stress tests
│   │   └── ...
│   ├── javascript         
│   │   ├── ...
│   │   ├── ui.js           # webpack轉錄前實際用來畫畫面的js
│   │   └── index.js        # (我計劃讓後端與前端相遇的地方,待補充)
│   ├── scss                
│   │   ├── ...
│   │   └── main.scss       # 使用scss
│   └── main.js             # webpack 讀取的進入點
│   │   
│   │   
└── package.json            # 放npm library 只有開發的時候需要使用
└── webpack.config.js       

```

[使用GoogleSignIn](https://developer.chrome.com/docs/apps/app_identity/)

1. Add permissions to your manifest and upload your app.
```
"permissions": [
  "identity", "storage"
]
```
2. Copy key in the installed manifest.json to your source manifest, so that your application ID will stay constant during development.
3. [Get an OAuth2 client ID for your Chrome App.](https://console.cloud.google.com/home/dashboard?project=tidebitwallet-317901&authuser=0&orgonly=true&supportedpurview=organizationId)
3.1 API和服務 => 建立 OAuth 用戶端 ID
3.2 API和服務 => OAuth同意畫面 => 測試使用者新增
4. Update your manifest to include the client ID and scopes.
5. Get the authentication token.
