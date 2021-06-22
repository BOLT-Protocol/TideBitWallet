import { currentView } from "../utils/utils";
import asset from "../screen/asset";
import landing from "../screen/landing";
import overview from "../screen/overview";
import bill from "../screen/bill";
import address from "../screen/address";

class ViewController {
  initialize(user, config) {
    this.currentAsset;
    this.currentBill;
    this.currentScreen;
    this.userBalanceInFiat = user.userBalanceInFiat;
    this.userAssets = user.assets;
    this.walletFiat = config.fiat;
    this.walletVersion = config.version;
    this.walletMode = config.mode;
  }
  updateAssets = (assets, userBalanceInFiat, fiat) => {
    this.userAssets = assets;
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
  updateAsset = (asset, userBalanceInFiat) => {
    this.userBalanceInFiat = userBalanceInFiat;
    const view = currentView();
    switch (view) {
      case "assets":
      case "settings":
        overview.update(
          "OnUpdateAccount",
          this.userBalanceInFiat,
          this.walletFiat,
          { asset }
        );
        break;
      case "asset":
        // ++ 2021/6/22 Emily
        break;
      default:
        break;
    }
    overview.update("OnUpdateAccount", asset);
  };
  updateBills = (bills) => {};
  updateBill = (bill) => {};
  updateAddress = (address) => {};
  route = (screen, data) => {
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
      case "asset":
        if (data) {
          this.currentAsset = data; //Asset
        }
        asset.render(screen, this.currentAsset, this.walletFiat);
        break;
      case "bill":
        this.currentBill = data; //Bill
        bill.render(screen, this.currentAsset, this.currentBill);
        break;
      case "address":
        address.render(screen, this.currentAsset);
    }
  };
}
const viewController = new ViewController();

export default viewController;
