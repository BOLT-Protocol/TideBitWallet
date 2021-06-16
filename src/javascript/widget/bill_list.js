import BillItem from "./bill_item";

class BillListElement extends HTMLElement{
  constructor(){
    super();
  }
  connectedCallback() {
    this.className = "bill-list";
    this.bills.forEach((bill) => bill.render(this));
  }
}

customElements.define("bill-list", BillListElement);

class BillList{
  constructor(state,bills){
    this.element = document.createElement("bill-list");
    this.element.state = JSON.parse(JSON.stringify(state));
    this.bills = bills.map(bill => ({...bill}));
    this.element.billItems = this.bills.map((bill=> {
      const state = JSON.parse(JSON.stringify(this.element.state));
      state.screen = "bill";
      return new BillItem(state, bill);
    }));
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default BillList;
