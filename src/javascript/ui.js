// MVC: View
import Asset from "./model/asset";
import viewController from "./controller/view";
import { randomHex } from "./utils/utils";

// test
const createTestAsset = (id) => {
  return {
    id: id ? id : randomHex(32),
    name: "Aretha",
    symbol: "ARE",
    network: "Testnet",
    decimals: 8,
    publish: true,
    image: "https://www.tidebit.one/icons/btc.png",
    balance: 100,
    inFiat: 30000,
  };
};
// ++ let assetList = ui.getAssets();
const getUserDetail = () => {
  return {
    userBalanceInFiat: 52.29,
    assets: [
      {
        id: randomHex(32),
        name: "Bitcoin",
        symbol: "BTC",
        network: "mainnet",
        decimals: 8,
        publish: true,
        image: "https://www.tidebit.one/icons/btc.png",
        balance: 0,
        inFiat: 0,
      },
      {
        id: randomHex(32),
        name: "Bitcoin",
        symbol: "BTC",
        network: "testnet",
        decimals: 8,
        publish: false,
        image: "https://www.tidebit.one/icons/btc.png",
        balance: 0,
        inFiat: 0,
      },
      {
        id: randomHex(32),
        name: "Ethereum",
        symbol: "ETH",
        network: "mainnet",
        decimals: 18,
        publish: true,
        image: "https://www.tidebit.one/icons/eth.png",
        balance: 0,
        inFiat: 0,
      },
      {
        id: "e0642b1b64b8b0214e758dd0be63242839e63db7",
        name: "Ethereum",
        symbol: "ETH",
        network: "ropsten",
        decimals: 18,
        publish: false,
        image: "https://www.tidebit.one/icons/eth.png",
        balance: 2,
        inFiat: 52.29,
      },
      {
        id: randomHex(32),
        name: "Tidetain",
        symbol: "TTN",
        network: "mainnet",
        decimals: 18,
        publish: true,
        image: "https://www.tidebit.one/icons/eth.png",
        balance: 0,
        inFiat: 0,
      },
    ],
  };
};
const getWalletConfig = () => {
  return {
    mode: "development",
    version: "v 0.1.0 (1)",
    fiat: "USD",
  };
};
//-- test

const startApp = () => {
  // const tideWallet = new TideWalletJS();
  let user, wallet;
  wallet = getWalletConfig();
  viewController.initialize(wallet);
  // -- test
  window.wallet = wallet;
  // -- test
  viewController.route("landing");
  // onReady

  // -- test
  setTimeout(() => {
    user = getUserDetail();
    user.assets = user.assets.map((asset) => new Asset(asset));
    viewController.updateUser(user);
    // -- test
    window.user = user;
    viewController.updateAssets(
      user.assets,
      user.userBalanceInFiat,
      wallet.fiat
    );
    setTimeout(() => {
      viewController.updateAsset(createTestAsset(), user.userBalanceInFiat);
    }, 5000);
  }, 10000);

  // -- test

  // viewController.route("assets");
  // viewController.route("settings");
  // viewController.route("asset", asset);
  // viewController.route("bill", bill);
  // viewController.route("address", bill);
  /**
   *  onUpdate
   *  OnUpdateCurrency
   */
  // viewController.updateAssets(
  //   user.assets,
  //   user.userBalanceInFiat,
  //   wallet.fiat
  // );
  /**
   *  onUpdate
   *  OnUpdateAccount
   */
  // viewController.updateAsset();
  /**
   *  onUpdate
   *  OnUpdateTransactions
   */
  // viewController.updateTransactions();
  /**
   *  onUpdate
   *  OnUpdateTransaction
   */
  // viewController.updateTransaction();
};

startApp();

window.viewController = viewController;
window.getUserDetail = getUserDetail;
window.getWalletConfig = getWalletConfig;
window.createTestAsset = createTestAsset;
