import Scaffold from "../layout/scaffold";
import Header from "../layout/header";
import BillContent from "../layout/bill_content";
import { currentView } from "../utils/utils";
class Bill {
  constructor() {}
  initialize(screen, asset, bill, wallet) {
    // ++ not necessary ui dont need more detail to show
    // this.asset = asset;
    // wallet
    //   .getTransactionDetail({ assetID: asset.id, transactionID: bill.id })
    //   .then((data) => {
    //     console.log(data); // -- test
    //     this.update(this.asset, new Bill(data));
    //   });
    const header = new Header(screen);
    this.billContent = new BillContent(asset, bill);
    this.scaffold = new Scaffold(header, this.billContent);
    this.scaffold.view = screen;
    this.screen = screen;
  }
  render(screen, asset, bill, wallet) {
    const view = currentView();
    if (!view || view !== "bill" || !this.scaffold) {
      this.initialize(screen, asset, bill, wallet);
    }
  }
  update(asset, bill) {
    this.billContent = new BillContent(asset, bill);
    this.billContent.update();
  }
}

const bill = new Bill();

export default bill;
