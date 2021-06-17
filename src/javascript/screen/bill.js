import Scaffold from "../layout/scaffold";
import Header from "../layout/header";
import BillContent from "../layout/bill_content";

const bill = (state) => {
  const header = new Header(state);
  const billContent = new BillContent(state);
  new Scaffold(header, billContent);
};

export default bill;
