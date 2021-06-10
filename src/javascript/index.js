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
        pulish: true,
        image: "https://www.tidebit.one/icons/btc.png",
        balance: 0,
      },
      {
        name: "Bitcoin",
        symbol: "BTC",
        network: "testnet",
        decimals: 8,
        pulish: false,
        image: "https://www.tidebit.one/icons/btc.png",
        balance: 0,
      },
      {
        name: "Ethereum",
        symbol: "ETH",
        network: "mainnet",
        decimals: 18,
        pulish: true,
        image: "https://www.tidebit.one/icons/eth.png",
        balance: 0,
      },
      {
        name: "Ethereum",
        symbol: "ETH",
        network: "ropsten",
        decimals: 18,
        pulish: false,
        image: "https://www.tidebit.one/icons/eth.png",
        balance: 2,
      },
      {
        name: "Tidetain",
        symbol: "TTN",
        network: "mainnet",
        decimals: 18,
        pulish: true,
        image: "https://www.tidebit.one/icons/eth.png",
        balance: 0,
      },
    ],
  };
};

const updateWalletSetup = (mode = "development", currency = "usd") => {
  return {
    mode: mode,
    currency: currency,
  };
};

const renderOverviewPage = () => {
  console.log("renderOverviewPage");
  const user = getUser();
  const wallet = updateWalletSetup("development", "USD");
  overview(user, wallet);
};

renderOverviewPage();
