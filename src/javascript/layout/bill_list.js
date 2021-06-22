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
  constructor(asset, bills) {
    this.element = document.createElement("bill-list");
    this.element.billItems = bills.map((bill) => new BillItem(asset, bill));
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default BillList;
