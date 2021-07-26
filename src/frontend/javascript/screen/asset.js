import Scaffold from "../layout/scaffold";
import Header from "../layout/header";
import TarBarNavigator from "../layout/tab_bar_navigator";
import BillList from "../layout/bill_list";
import { currentView } from "../utils/utils";
import Bill from "../model/bill";
import AssetModel from "../model/asset";
class Asset {
  constructor() {}
  refresh() {
    this.refreshButton = document.querySelector(".header__leading[refresh]");
    this.refreshButton.addEventListener("click", async (_) => {
      this.scaffold.openPopover("loading");
      try {
        console.log("sync");
        await this.wallet.sync();
        this.scaffold.closePopover();
      } catch (error) {
        console.log(error);
        this.scaffold.openPopover("error");
      }
    });
  }
  initialize(screen, asset, fiat, wallet) {
    console.log("wallet getAssetDetail"); // -- test
    this.wallet = wallet;
    wallet.getAssetDetail(asset.id).then((data) => {
      console.log(data); // -- test
      const asset = new AssetModel(data.asset[0]);
      console.log(asset); // -- test
      const bills = data.transactions.map((obj) => new Bill(obj));
      this.updateBills(asset, bills);
    });
    this.header = new Header(screen, { asset, fiat });
    this.tarBarNavigator = new TarBarNavigator();
    this.billList = new BillList(asset, asset.bills);
    this.scaffold = new Scaffold(this.header, [
      this.tarBarNavigator,
      this.billList,
    ]);
    this.scaffold.id = asset.id;
    this.scaffold.view = screen;
    this.screen = screen;
    if (!asset?.bills) {
      this.scaffold.openPopover("loading");
    }
    this.refresh();
  }
  render(screen, asset, fiat, wallet) {
    const view = currentView();
    if (!view || view !== "asset" || !this.scaffold) {
      this.initialize(screen, asset, fiat, wallet);
    }
  }
  updateAsset(asset) {
    this.header.update(this.screen, { asset });
    this.refresh();
  }
  updateBills(asset, bills) {
    this.header.update(this.screen, { asset });
    this.refresh();
    this.billList.updateBills(bills);
    this.scaffold.closePopover();
  }
  updateBill(asset, billIndex, bill) {
    this.header.update(this.screen, { asset });
    this.refresh();
    this.billList.updateBill(billIndex, bill);
  }
  addNewBill(asset, bill) {
    this.header.update(this.screen, { asset });
    this.refresh();
    this.billList.addNewBill(bill);
  }
}

const asset = new Asset();

export default asset;
