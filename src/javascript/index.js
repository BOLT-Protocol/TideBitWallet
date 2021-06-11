// import "./layout/scaffold";
import overview from "./screen/overview";

const getUser = () => {
  return {
    totalAsset: 52.29,
    accounts: [
      {
        name: "Bitcoin",
        symbol: "BTC",
        network: "mainnet",
        decimals: 8,
        publish: true,
        image: "https://www.tidebit.one/icons/btc.png",
        balance: 0,
        inUSD:0
      },
      {
        name: "Bitcoin",
        symbol: "BTC",
        network: "testnet",
        decimals: 8,
        publish: false,
        image: "https://www.tidebit.one/icons/btc.png",
        balance: 0,
        inUSD:0
      },
      {
        name: "Ethereum",
        symbol: "ETH",
        network: "mainnet",
        decimals: 18,
        publish: true,
        image: "https://www.tidebit.one/icons/eth.png",
        balance: 0,
        inUSD:0
      },
      {
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
        name: "Tidetain",
        symbol: "TTN",
        network: "mainnet",
        decimals: 18,
        publish: true,
        image: "https://www.tidebit.one/icons/eth.png",
        balance: 0,
        inUSD:0
      },
    ],
  };
};

const updateWalletSetup = (mode, fiat) => {
  return {
    mode: mode,
    fiat: fiat,
  };
};

const renderOverviewPage = () => {
  console.log("renderOverviewPage");
  const user = getUser();
  const wallet = updateWalletSetup("development", { symbol: "USD", inUSD: 1 });
  overview(user, wallet.fiat);
};

renderOverviewPage();
