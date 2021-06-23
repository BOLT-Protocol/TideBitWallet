import { currentView } from "../utils/utils";
import asset from "../screen/asset";
import landing from "../screen/landing";
import overview from "../screen/overview";
import bill from "../screen/bill";
import address from "../screen/address";

class ViewController {
  initialize(config, user) {
    this.currentAsset;
    this.currentBill;
    this.currentScreen;
    this.walletFiat = config.fiat;
    this.walletVersion = config.version;
    this.walletMode = config.mode;
    this.updateUser(user);
  }
  updateUser(user) {
    this.userBalanceInFiat = user?.userBalanceInFiat;
    this.userAssets = user?.assets;
  }
  updateAssets = (assets, userBalanceInFiat, fiat) => {
    this.userAssets = assets;
    this.userBalanceInFiat = userBalanceInFiat;
    if (fiat) this.walletFiat = fiat;
    const view = currentView();
    switch (view) {
      case "assets":
      case "settings":
        overview.updateAssets(this.userBalanceInFiat, this.walletFiat, assets);
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
        overview.updateAsset(this.userBalanceInFiat, asset);
        break;
      case "asset":
        // ++ 2021/6/22 Emily
        break;
      default:
        break;
    }
  };
  updateBills = (bills) => {};
  updateBill = (bill) => {};
  updateAddress = (address) => {};
  route = (screen, data) => {
    switch (screen) {
      case "landing":
        landing.render(screen, this.walletVersion);
        break;
      case "assets":
      case "settings":
        overview.render(screen, this.walletFiat, this.walletVersion, {
          totalAsset: this.userBalanceInFiat,
          assets: this.userAssets,
        });
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
