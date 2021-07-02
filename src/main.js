import "./frontend/scss/main.scss"
import Asset from "./frontend/javascript/model/asset";
import Bill from "./frontend/javascript/model/bill";
import viewController from "./frontend/javascript/controller/view";
/**
 * viewContoller 提供頁面跳轉及頁面更新的功能
 * @param {String} screen
 * @param {dynamic} data Asset || Bill
 * 頁面跳轉 => viewController.route(screen, [data])
 * screen: 
 * viewController.route('landing') => 登入頁面
 * viewController.route('mnemonic') => 輸入助記詞頁面
 * viewController.route('assets') => asset 清單 
 * viewController.route('settings') => 設定頁面
 * viewController.route('asset', asset) => asset 的交易清單
 * viewController.route('bill', bill) => 交易細節
 * viewController.route('transaction') => 交易畫面
 * viewController.route('address') => 收款頁面
 * 頁面更新
 * @param {Array} assets,  
 * @param {String} balance [目前tidewalletJS沒有提供]// ++ 20210703, 
 * @param {Fiat} fiat[optional], 參考model Fiat
 * viewController.updateAssets(assets, balance, fiat.name)
 * @param {Array} asset,  
 * @param {String} balance [目前tidewalletJS沒有提供]// ++ 20210703, 
 * viewController.updateAsset(asset, balance)
 * @param {Asset} asset
 * @param {Array} bills
 * viewController.updateBills(asset, bills)
 * @param {Asset} asset
 * @param {Bill} bill
 * viewController.updateBill(asset, bill)
 */

// START
// setup tidewallet
const tidewallet = new window.TideWallet();

//[Crucial step] pass tidewallet to the page which would need it
viewController.setup(tidewallet);

// 監聽 tidewallet 事件
// on ready
tidewallet.on("ready", (data) => {
  console.log("TideWallet is Ready", data); // -- test
});
// on update
/**
 * event: OnUpdateCurrency 
 * => 更新單個或是多個asset, 更新錢包的法幣也用這個event
 * => 影響頁面 overview(assetList & settingList) 及 asset, 
 * => 更新參數
 * @param {String} balance [目前tidewalletJS沒有提供]// ++ 20210703, 
 * @param {Array} assets,  
 * @param {Fiat} fiat[optional], 參考model Fiat
 * event: OnUpdateTransactions
 */
/**
 * event: OnUpdateTransactions
 * => 更新某個 asset 的交易清單, 同 getAssetDetail() function
 * => 影響頁面 asset & bill(Transaction Detail)
 * => 更新參數
 * @param {Asset} asset
 * @param {Array} bill
 */
tidewallet.on("update", (data) => {
  console.log("TideWallet Data Updated", data); // -- test
  switch (data.evt) {
    case "OnUpdateCurrency":
      if (Array.isArray(data.value)) {
        const assets = data.value.map((currency) => new Asset(currency));
        if (data.value.length === 1) {
          viewController.updateAsset(assets[0]);
        } else {
          viewController.updateAssets(assets);
        }
      }
      break;
    case "OnUpdateTransactions":
      const asset = new Asset(data.value.currency);
      const bills = data.value.transactions.map(
        (transaction) => new Bill(transaction)
      );
      viewController.updateBills(asset, bills);
      break;
    case "OnUpdateTransaction":
      // ++ 0702 Emily update UncomfirmTransaction
      break;
  }
});
// on notice
tidewallet.on("notice", (data) => {
  console.log("TideWallet Say Hello", data); // -- test
});

// 顯示登入頁面
/**
 * 需要在 viewController.setup(tidewallet)之後呼叫
 * 因為landing頁面提供的兩種登錄方式,均會使用 tidewallet 提供的funcion
 * GoogleSignIn
 * Recovery Wallet
 */
viewController.route("landing");
