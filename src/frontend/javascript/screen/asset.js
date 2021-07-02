// import Bill from "./model/bill";
import Scaffold from "../layout/scaffold";
import Header from "../layout/header";
import TarBarNavigator from "../layout/tab_bar_navigator";
import BillList from "../layout/bill_list";
import { currentView } from "../utils/utils";
class Asset {
  constructor() {}
  initialize(screen, asset, fiat, wallet) {
    console.log("wallet getAssetDetail"); // -- test
    wallet
      .getAssetDetail({ assetID: asset.id })
      .then((data) => {
        console.log(data); // -- test
        const asset = new Asset(data.asset);
        const bills = data.transactions.map((obj) => new Bill(obj));
        return {
          asset,
          bills,
        };
      })
      .then((obj) => {
        this.updateBills(obj.asset, obj.bills);
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
