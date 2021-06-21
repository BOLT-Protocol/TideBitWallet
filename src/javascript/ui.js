// MVC: View
import route from "./utils/route";

import * as utils from "./utils/utils";

const state = {};

// ++ let assetList = ui.getAssets();
const getAssets = () => {
  return {
    totalAsset: 52.29,
    accounts: [
      {
        id: utils.randomHex(32),
        name: "Bitcoin",
        symbol: "BTC",
        network: "mainnet",
        decimals: 8,
        publish: true,
        image: "https://www.tidebit.one/icons/btc.png",
        balance: 0,
        inUSD: 0,
      },
      {
        id: utils.randomHex(32),
        name: "Bitcoin",
        symbol: "BTC",
        network: "testnet",
        decimals: 8,
        publish: false,
        image: "https://www.tidebit.one/icons/btc.png",
        balance: 0,
        inUSD: 0,
      },
      {
        id: utils.randomHex(32),
        name: "Ethereum",
        symbol: "ETH",
        network: "mainnet",
        decimals: 18,
        publish: true,
        image: "https://www.tidebit.one/icons/eth.png",
        balance: 0,
        inUSD: 0,
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
        inUSD: 52.29,
      },
      {
        id: utils.randomHex(32),
        name: "Tidetain",
        symbol: "TTN",
        network: "mainnet",
        decimals: 18,
        publish: true,
        image: "https://www.tidebit.one/icons/eth.png",
        balance: 0,
        inUSD: 0,
      },
    ],
  };
};

const setWallet = (mode, version, fiat) => {
  return {
    mode,
    version,
    fiat,
  };
};

const startApp = () => {
  state.user = getAssets();
  state.walletConfig = setWallet("development", "v 0.1.0 (1)", {
    symbol: "USD",
    inUSD: 1,
  });
  state.screen = "landing";
  route(state);
};

export default function launchTideBitUi(options, callback) {
  startApp();
}
