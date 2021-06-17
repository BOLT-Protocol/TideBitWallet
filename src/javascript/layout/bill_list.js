import BillItem from "../widget/bill_item";

class BillListElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "bill-list";
    this.billItems.forEach((billItem) => billItem.render(this));
  }
}

customElements.define("bill-list", BillListElement);

class BillList {
  constructor(state, bills) {
    this.element = document.createElement("bill-list");
    this.element.state = JSON.parse(JSON.stringify(state));
    this.element.bills = bills;
    this.element.billItems = bills.map((bill) => {
      const state = JSON.parse(JSON.stringify(this.element.state));
      state.bill = bill;
      state.screen = "bill";
      return new BillItem(state);
    });
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default BillList;
