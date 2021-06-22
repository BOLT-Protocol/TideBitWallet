import account from "../screen/account";
import landing from "../screen/landing";
import overview from "../screen/overview";
import { currentView } from "../utils/utils";

class ViewController {
  initialize(user, config) {
    this.currentAsset;
    this.currentBill;
    this.currentScreen;
    this.userBalanceInFiat = user.userBalanceInFiat;
    this.userAssets = JSON.parse(JSON.stringify(user.assets));
    this.walletFiat = config.fiat;
    this.walletVersion = config.version;
    this.walletMode = config.mode;
  }
  updateAssets = (assets, userBalanceInFiat, fiat) => {
    this.userAssets = JSON.parse(JSON.stringify(assets));
    this.userBalanceInFiat = userBalanceInFiat;
    if (fiat) this.walletFiat = fiat;
    const view = currentView();
    switch (view) {
      case "assets":
      case "settings":
        overview.update(
          "OnUpdateCurrency",
          this.userBalanceInFiat,
          this.walletFiat,
          { assets }
        );
        break;
      default:
        break;
    }
  };
  updateAsset = (account, userBalanceInFiat) => {
    this.userBalanceInFiat = userBalanceInFiat;
    const view = currentView();
    switch (view) {
      case "assets":
      case "settings":
        overview.update(
          "OnUpdateAccount",
          this.userBalanceInFiat,
          this.walletFiat,
          { account }
        );
        break;
      case "asset":
        // ++ 2021/6/22 Emily
        break;
      default:
        break;
    }
    overview.update("OnUpdateAccount", account);
  };
  updateBills = (bills) => {};
  updateBill = (bill) => {};
  updateAddress = (address) => {};
  route = (screen) => {
    switch (screen) {
      case "landing":
        landing.render(screen);
        break;
      case "assets":
      case "settings":
        overview.render(
          screen,
          this.userBalanceInFiat,
          this.userAssets,
          this.walletFiat,
          this.walletVersion
        );
        break;
      case "account":
        account(data, this.walletFiat);
    }
  };
}
const viewController = new ViewController();

export default viewController;
