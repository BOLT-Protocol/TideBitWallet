import BillItem from "./bill_item";

customElements.define("bill-item", BillItem);

const billList = (account, bills) => {
  const billList = document.createElement("div");
  billList.className = "bill-list";
  bills.forEach((bill) => {
    const billItem = document.createElement("bill-item");
    billItem.child = {
      account: account,
      bill: bill,
    };
    billList.insertAdjacentElement("beforeend", billItem);
  });
  return billList;
};

export default billList;
