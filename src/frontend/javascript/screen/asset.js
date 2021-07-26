import Scaffold from "../layout/scaffold";
import Header from "../layout/header";
import TarBarNavigator from "../layout/tab_bar_navigator";
import BillList from "../layout/bill_list";
import { currentView } from "../utils/utils";
import Bill from "../model/bill";
import AssetModel from "../model/asset";
class Asset {
  constructor() {}
  initialize(screen, asset, fiat, wallet) {
    console.log("wallet getAssetDetail"); // -- test
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
  }
  render(screen, asset, fiat, wallet) {
    const view = currentView();
    if (!view || view !== "asset" || !this.scaffold) {
      this.initialize(screen, asset, fiat, wallet);
    }
    this.reload = document.querySelector(".header__leading[refresh]");
    this.reload.addEventListener("click", async (_) => {
      this.scaffold.openPopover("loading");
      try {
        await wallet.sync();
        this.scaffold.closePopover();
      } catch (error) {
        this.scaffold.openPopover("error");
      }
    });
  }
  updateAsset(asset) {
    this.header.update(this.screen, { asset });
  }
  updateBills(asset, bills) {
    this.header.update(this.screen, { asset });
    this.billList.updateBills(bills);
    this.scaffold.closePopover();
  }
  updateBill(asset, billIndex, bill) {
    this.header.update(this.screen, { asset });
    this.billList.updateBill(billIndex, bill);
  }
  addNewBill(asset, bill) {
    this.header.update(this.screen, { asset });
    this.billList.addNewBill(bill);
  }
}

const asset = new Asset();

export default asset;
