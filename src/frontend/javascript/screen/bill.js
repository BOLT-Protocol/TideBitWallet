import Scaffold from "../layout/scaffold";
import Header from "../layout/header";
import BillContent from "../layout/bill_content";
import { currentView } from "../utils/utils";
class Bill {
  constructor() {}
  initialize(screen, asset, bill) {
    const header = new Header(screen);
    this.billContent = new BillContent(asset, bill);
    this.scaffold = new Scaffold(header, this.billContent);
    this.scaffold.view = screen;
    this.screen = screen;
  }
  render(screen, asset, bill) {
    const view = currentView();
    if (!view || view !== "bill" || !this.scaffold) {
      this.initialize(screen, asset, bill);
    }
  }
  update(asset, bill) {
    this.billContent = new BillContent(asset, bill);
    this.billContent.update();
  }
}

const bill = new Bill();

export default bill;
