import { currentView } from "../utils/utils";
import AssetScreen from "../screen/asset";
import Landing from "../screen/landing";
import Overview from "../screen/overview";
import BillScreen from "../screen/bill";
import AddressScreen from "../screen/address";
import Transaction from "../screen/transaction";
import MnemonicScreen from "../screen/mnemonic";

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
    this.userBalanceInFiat = user?.totalValue?.amount;
    this.userAssets = user?.assets;
    if (this.userAssets) {
      this.updateAssets(this.userAssets, this.userBalanceInFiat, this.fiat);
    }
  }
  updateAssets = (assets, userBalanceInFiat, fiat) => {
    this.userAssets = assets;
    this.userBalanceInFiat = userBalanceInFiat;
    if (fiat) this.walletFiat = fiat;
    const view = currentView();
    switch (view) {
      case "assets":
      case "settings":
        Overview.updateAssets(this.userBalanceInFiat, this.walletFiat, assets);
        break;
      default:
        break;
    }
  };
  updateAsset = (asset, userBalanceInFiat) => {
    const index = this.userAssets.findIndex((ass) => ass.id === asset.id);
    this.userBalanceInFiat = userBalanceInFiat;
    const view = currentView();
    switch (view) {
      case "assets":
      case "settings":
        if (index > -1) {
          this.userAssets[index] = asset;
          Overview.updateAsset(index, this.userBalanceInFiat, asset);
        } else {
          this.userAssets.push(asset);
          Overview.addNewAsset(this.userBalanceInFiat, asset);
        }
        break;
      case "asset":
        // ++ 2021/6/22 Emily
        break;
      default:
        break;
    }
  };
  updateBills = (asset, bills) => {
    const index = this.userAssets.findIndex((ass) => ass.id === asset.id);
    this.userAssets[index].bills = bills;
    const view = currentView();
    switch (view) {
      case "asset":
        if (asset.id !== this.currentAsset.id) return;
        AssetScreen.updateBills(asset, bills);
        break;
      default:
        break;
    }
  };
  updateBill = (asset, bill) => {
    const assetIndex = this.userAssets.findIndex((ass) => ass.id === asset.id);
    const billIndex = this.userAssets[assetIndex].bills.findIndex(
      (billObj) => billObj.id === bill.id
    );
    billIndex > -1
      ? (this.userAssets[assetIndex].bills[billIndex] = bill)
      : this.userAssets[assetIndex].bills.push(bill);
    const view = currentView();
    switch (view) {
      case "asset":
        if (asset.id !== this.currentAsset.id) return;
        billIndex > -1
          ? AssetScreen.updateBill(asset, billIndex, bill)
          : AssetScreen.addNewBill(asset, bill);
        break;
      case "bill":
        if (bill.id !== this.currentBill.id) return;
        // ++
        BillScreen.update(asset, bill);
        break;
      default:
        break;
    }
  };
  route = (screen, data) => {
    console.log(screen);
    switch (screen) {
      case "landing":
        Landing.render(screen, this.walletVersion);
        break;
      case "assets":
      case "settings":
        Overview.render(screen, this.walletFiat, this.walletVersion, {
          totalAsset: this.userBalanceInFiat,
          assets: this.userAssets,
        });
        break;
      case "asset":
        if (data) {
          this.currentAsset = data; //Asset
        }
        AssetScreen.render(screen, this.currentAsset, this.walletFiat);
        break;
      case "transaction":
        Transaction.render(screen, this.currentAsset, this.walletFiat);
        break;
      case "bill":
        this.currentBill = data; //Bill
        BillScreen.render(screen, this.currentAsset, this.currentBill);
        break;
      case "address":
        AddressScreen.render(screen, this.currentAsset);
        break;
      case "mnemonic":
        MnemonicScreen.render(screen);
        break;
      default:
        break;
    }
  };
}
const viewController = new ViewController();

export default viewController;
