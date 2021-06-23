// MVC: View
import Bill from "./model/bill";
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
const getAssetDetail = (assetId) => {
  if (assetId !== "e0642b1b64b8b0214e758dd0be63242839e63db7") return [];
  return [
    {
      id: randomHex(32),
      txid: "0xaf40440a607d8ecea5236c22a70c806bcd36c29cdb81811694a3cb3f634be276",
      amount: 0.1,
      fee: 0.000021,
      message: "",
      timestamp: Date.now(),
      direction: "send",
      from: "0xe0642b1b64b8b0214e758dd0be63242839e63db7",
      to: "0xd885833741f554a0e64ffd1141887d65e0dded01",
      confirmations: 0,
    },
    {
      id: randomHex(32),
      txid: "0xa51396e2d31bef6825b25d7078a912e3d9ecaab6bdce949e2ed5193bb7c73044",
      amount: 0.1,
      fee: 0.000021,
      message: "",
      timestamp: 1625993323880,
      direction: "receive",
      from: "0xd885833741f554a0e64ffd1141887d65e0dded01",
      to: "0xe0642b1b64b8b0214e758dd0be63242839e63db7",
      confirmations: 1,
    },
    {
      id: randomHex(32),
      txid: "0xa51396e2d31bef6825b25d7078a912e3d9ecaab6bdce949e2ed5193bb7c73044",
      amount: 0.1,
      fee: 0.000021,
      message: "",
      timestamp: 1625953323880,
      direction: "send",
      from: "0xd885833741f554a0e64ffd1141887d65e0dded01",
      to: "0xe0642b1b64b8b0214e758dd0be63242839e63db7",
      confirmations: 4,
    },
    {
      id: randomHex(32),
      txid: "0xab4372209b00d0669a440e93134ee7812b779b62ac4e0b254eb18541c78af3b9",
      amount: 1,
      fee: 0.000021,
      message: "",
      timestamp: 1620719000000,
      direction: "send",
      from: "0xd885833741f554a0e64ffd1141887d65e0dded01",
      to: "0xe0642b1b64b8b0214e758dd0be63242839e63db7",
      confirmations: 2160,
    },
    {
      id: randomHex(32),
      txid: "0xab4372209b00d0669a440e93134ee7812b779b62ac4e0b254eb18541c78af3b9",
      amount: 3,
      fee: 0.000021,
      message: "",
      timestamp: 1620719218543,
      direction: "receive",
      from: "0xd885833741f554a0e64ffd1141887d65e0dded01",
      to: "0xe0642b1b64b8b0214e758dd0be63242839e63db7",
      confirmations: 214560,
    },
  ];
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
  let user, wallet, bills;
  // initialize
  wallet = getWalletConfig();
  // -- test
  window.wallet = wallet;
  // --
  viewController.initialize(wallet);
  viewController.route("landing");

  // onReady
  // -- test
  setTimeout(() => {
    user = getUserDetail();
    user.assets = user.assets.map((asset) => new Asset(asset));
    viewController.updateUser(user);
    viewController.route("assets");
  }, 2000);
  // --

  // onUpdateAccount
  // new Account
  setTimeout(() => {
    viewController.updateAsset(createTestAsset(), user.userBalanceInFiat);
  }, 3500);

  // onUpdateAccount
  // existAccount
  setTimeout(() => {
    viewController.updateAsset(
      createTestAsset(user.assets[1].id),
      user.userBalanceInFiat
    );
  }, 4500);

  // onUpdateTransaction
  // eth ropsten transaction
  setTimeout(() => {
    bills = getAssetDetail(user.assets[3].id)?.map((obj) => new Bill(obj));
    window.bills = bills;
    viewController.route("asset", user.assets[3]);
    setTimeout(() => {
      viewController.updateBills(user.assets[3], bills);
      const updateBill = (bill = user.assets[3].bills[0]) => {
        bill.confirmations += 1;
        viewController.updateBill(user.assets[3], bills[0]);
        if (bill.confirmations === 4) {
          viewController.route("bill", bills[0]);
        }
        if (bill.confirmations > 7) {
          viewController.route("asset", user.assets[3]);
          clearInterval(interval);
        }
      };
      const interval = setInterval(updateBill, 2000);
    }, 1000);
  }, 6000);
};

startApp();

window.viewController = viewController;
window.getUserDetail = getUserDetail;
window.getWalletConfig = getWalletConfig;
window.createTestAsset = createTestAsset;
