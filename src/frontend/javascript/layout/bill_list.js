import BillItem from "../widget/bill_item";

class BillListElement extends HTMLElement {
  constructor() {
    super();
  }
  update() {
    this.replaceChildren();
    if (this.billItems) {
      this.className = "bill-list";
      this.billItems.forEach((billItem) => billItem.render(this));
    } else {
      this.innerHTML = `
      <div class="loading__text">Loading...</div>
      `;
    }
  }
  connectedCallback() {
    this.update();
  }
}

customElements.define("bill-list", BillListElement);

class BillList {
  constructor(asset, bills) {
    this.element = document.createElement("bill-list");
    this.asset = asset;
    if (bills) {
      this.bills = bills;
      this.element.billItems = this.bills.map((bill) => this.billItem(bill));
    }
  }
  billItem = (bill) => new BillItem(this.asset, bill);
  updateBills = (bills) => {
    this.bills = bills;
    this.element.billItems = this.bills.map((bill) => this.billItem(bill));
    this.element.update();
  };
  updateBill(index, bill) {
    this.element.billItems[index] = this.billItem(bill);
    this.element.billItems[index].update();
  }
  addNewBill(bill) {
    this.element.billItems.push(this.billItem(bill));
    this.element.billItems[this.element.billItems.length - 1].render(this.element);
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default BillList;
