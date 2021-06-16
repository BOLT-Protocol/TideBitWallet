import Header from "../layout/header";
import BillContent from "../widget/bill_content";

const bill = (scaffold, state) => {
  const header = new Header(state);
  const billContent = new BillContent(state);
  header.render(scaffold.header);
  billContent.render(scaffold.body);
};

export default bill;
