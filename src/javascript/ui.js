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
  viewController.route("landing");
  // onReady
  const user = getUserDetail();
  const wallet = getWalletConfig();
  // ++ test
  user.assets = user.assets.map((asset) => new Asset(asset));
  window.user = user;
  window.wallet = wallet;
  viewController.initialize(user, wallet);
  // viewController.route("assets");
  // viewController.route("asset", asset);
  // onUpdate
  // switch (event) {
  //   case "":
  //     // viewController.updateAsset();
  //     break;
  // }
};

startApp();

window.viewController = viewController;
window.getUserDetail = getUserDetail;
window.getWalletConfig = getWalletConfig;
window.createTestAsset = createTestAsset;
