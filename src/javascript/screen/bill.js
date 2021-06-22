import Scaffold from "../layout/scaffold";
import Header from "../layout/header";
import BillContent from "../layout/bill_content";
import { currentView } from "../utils/utils";
class Bill {
  constructor() {}
  initialize(screen, asset, bill) {
    const header = new Header(screen);
    const billContent = new BillContent(asset, bill);
    this.scaffold = new Scaffold(header, billContent);
    this.scaffold.element.view = screen;
    this.screen = screen;
  }
  render(screen, asset, bill) {
    const view = currentView();
    if (!view || view !== "bill" || !this.scaffold) {
      this.initialize(screen, asset, bill);
    }
  }
  // ++ Emily 2021/6/22
  update(event, asset, fiat, { bills, bill }) {
    if (event === "OnUpdateAccount") {
    } else if (event === "OnUpdateCurrency") {
    }
  }
}

const bill = new Bill();

export default bill;
