import { currentView } from "../utils/utils";
import AssetScreen from "../screen/asset";
import Landing from "../screen/landing";
import Overview from "../screen/overview";
import BillScreen from "../screen/bill";
import AddressScreen from "../screen/address";
import Transaction from "../screen/transaction";
import MnemonicScreen from "../screen/mnemonic";
import SettingFiatScreen from "../screen/setting_fiat";

class ViewController {
  constructor() {
    this.currentAsset;
    this.currentBill;
    this.currentScreen;
  }
  setup(wallet) {
    this.wallet = wallet;
    this.version = wallet.getVersion();
    this.mode = "development"; // wallet.getMode(); // ++
  }
  /**
   *
   * @param {Array of Objects} assets
   * @param {string} userBalanceInFiat
   * @param {Object} fiat
   * @param {string} fiat.name
   */
  updateAssets = (assets, userBalanceInFiat, fiat) => {
    this.userAssets = assets;
    this.userBalanceInFiat = userBalanceInFiat || this.userBalanceInFiat;
    if (fiat) this.fiat = fiat;
    const view = currentView();
    switch (view) {
      case "assets":
      case "settings":
        Overview.updateAssets(this.userBalanceInFiat, this.fiat.name, assets);
        break;
      default:
        break;
    }
  };
  updateAsset = (asset, userBalanceInFiat, fiat) => {
    if (fiat) this.fiat = fiat;
    const index = this.userAssets.findIndex((ass) => ass.id === asset.id);
    this.userBalanceInFiat = userBalanceInFiat || this.userBalanceInFiat;
    const view = currentView();
    switch (view) {
      case "assets":
      case "settings":
        if (index > -1) {
          this.userAssets[index] = asset;
          Overview.updateAsset(
            index,
            this.userBalanceInFiat,
            this.fiat.name,
            asset
          );
        } else {
          this.userAssets.push(asset);
          Overview.addNewAsset(this.userBalanceInFiat,  this.fiat.name,asset);
        }
        break;
      case "asset":
        if (asset.id !== this.currentAsset.id) return;
        AssetScreen.updateAsset(asset);
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
        BillScreen.update(asset, bill);
        break;
      default:
        break;
    }
  };
  route = (screen, data) => {
    switch (screen) {
      case "landing":
        Landing.render(screen, this.version, this.wallet, data);
        break;
      case "assets":
      case "settings":
        if (data) this.fiat = data;
        Overview.render(screen, this.wallet, this.fiat?.name, this.version, {
          totalAsset: this.userBalanceInFiat,
          assets: this.userAssets,
        });
        break;
      case "asset":
        if (data) {
          this.currentAsset = data; //Asset
        }
        AssetScreen.render(
          screen,
          this.currentAsset,
          this.fiat.name,
          this.wallet
        );
        break;
      case "transaction":
        Transaction.render(
          screen,
          this.currentAsset,
          this.fiat.name,
          this.wallet
        );
        break;
      case "bill":
        this.currentBill = data; //Bill
        BillScreen.render(
          screen,
          this.currentAsset,
          this.currentBill,
          this.wallet
        );
        break;
      case "address":
        AddressScreen.render(screen, this.currentAsset, this.wallet);
        break;
      case "mnemonic":
        MnemonicScreen.render(screen, data); // data is a callback function
        break;
      case "setting-fiat":
        SettingFiatScreen.render(screen, this.wallet, this.fiat.name);
      default:
        break;
    }
  };
}

const viewController = new ViewController();

export default viewController;
