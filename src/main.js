import viewController from "./frontend/javascript/controller/view";
import { googleSignin, getInstallID } from "./frontend/javascript/utils/utils";

const getUserInfo = async (tidewallet) => {
  const api = {
    apiURL: "https://service.tidewallet.io/api/v1",
    apiKey: "f2a76e8431b02f263a0e1a0c34a70466",
    apiSecret: "9e37d67450dc906042fde75113ecb78c",
  };
  const OAuthID = await googleSignin();
  const InstallID = await getInstallID();
  console.log(OAuthID, InstallID);
  const result = await tidewallet.init({ user: { OAuthID, InstallID }, api });
  console.log(result);
  if (result) {
    const fiat = await tidewallet.getFiat();
    console.log(fiat);
    viewController.updateFiat(fiat);
    viewController.route("assets");
    const dashboard = await tidewallet.overview();
    console.log(dashboard);
    const balance = dashboard?.balance;
    const assets = dashboard?.currencies?.map(
      (currency) =>
        new Asset({
          id: currency.accountcurrencyId,
          symbol: currency.symbol,
          network: "Did not provide", //++ ropsten, mainnet, testnet
          publish: true, //++ Boolean "Did not provide",
          image: currency.image,
          balance: currency.balance,
          inFiat: "0", //++ string "Did not provide",
        })
    );
    console.log(balance, assets);
    viewController.updateUser({
      balance,
      assets,
    });
  }
};

const tidewallet = new window.TideWallet();
viewController.updateConfig(tidewallet, tidewallet.getVersion());

tidewallet.on("ready", (data) => {
  console.log("TideWallet is Ready", data);
});
tidewallet.on("update", (data) => {
  console.log("TideWallet Data Updated", data);
  switch (data.evt) {
    case "OnUpdateCurrency":
      if (Array.isArray(data.value)) {
        const currencies = data.value;
        const assets = currencies.map(
          (currency) =>
            new Asset({
              id: currency.accountcurrencyId,
              symbol: currency.symbol,
              network: "Did not provide", //++ ropsten, mainnet, testnet
              publish: true, //++ Boolean "Did not provide",
              image: currency.image,
              balance: currency.balance,
              inFiat: "0", //++ string "Did not provide",
            })
        );
        if (data.value.length === 1) {
          viewController.updateAsset(assets[0]);
        } else {
          viewController.updateAssets(assets);
        }
      }
      break;
    case "OnUpdateTransactions":
      const currency = data.value.currency;
      const asset = new Asset({
        id: currency.accountcurrencyId,
        symbol: currency.symbol,
        network: "Did not provide", //++ ropsten, mainnet, testnet
        publish: true, //++ Boolean "Did not provide",
        image: currency.image,
        balance: currency.balance,
        inFiat: "0", //++ string "Did not provide",
      });
      const transactions = data.value.transactions;
      const bills = transactions.map((transaction) => new Bill(transaction));
      viewController.updateBills(asset, bills);
      break;
  }
});
tidewallet.on("notice", (data) => {
  console.log("TideWallet Say Hello", data);
});

viewController.route("landing", () => getUserInfo(tidewallet));
