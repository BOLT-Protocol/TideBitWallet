import { addressFormatter } from "../utils/utils";

class BillElement extends HTMLElement {
  constructor() {
    super();
  }
  set id(val) {
    this.setAttribute("id", val);
  }
  connectedCallback() {
    this.className = "bill";
    this.innerHTML = `
    <div class="bill__header">
        <span class="bill__sign">${this.bill.sign}</span>
        <span class="bill__amount">${this.bill.amount}</span>
        <span class="bill__unit">${this.asset.symbol}</span>
    </div>
    <div class="bill__cell">
        <div class="bill__title">Status</div>
        <div class="bill__content">
            <span class="bill__status">${this.bill.status}</span>
            <span class="bill__status bill__confirmations">(${
              this.bill.confirmations
            } confirmation)</span>
            <span class="bill__status-icon"></span>
        </div>
    </div>
    <div class="bill__cell">
        <div class="bill__title">Time</div>
        <div class="bill__content">
            (${this.bill.dateTime})
        </div>
    </div>
    <div class="bill__cell">
        <div class="bill__title">${this.bill.direction}</div>
        <div class="bill__content">
        ${this.bill.address}
        </div>
    </div>
    <div class="bill__cell">
        <div class="bill__title">Fee</div>
        <div class="bill__content">
            <span class="bill__fee">${this.bill.fee}</span>
            <span class="bill__unit">${this.asset.symbol}</span>
        </div>
    </div>
    <div class="bill__cell">
        <div class="bill__title">Transaction Id</div>
        <div class="bill__content">
            <span class="bill__asset-icon"><img src=${
              this.asset.image
            } alt="ETH"></span>
            <span class="bill__id"><a target="_blank" href=https://${
              this.asset.network
            }.etherscan.io/tx/${this.bill.txid}>${addressFormatter(
      this.bill.txid
    )}</a></span>
        </div>
    </div>
    `;
    this.status = this.bill.status.toLowerCase();
    this.action = this.bill.action.toLowerCase();
    this.id = this.bill.id;
  }
  update() {
    if (this.status !== this.bill.status.toLowerCase())
      this.status = this.bill.status.toLowerCase();
    // this.children[2].children[1].textContent = this.bill.dateTime;
    this.children[1].children[1].innerHTML = `
    <span class="bill__status">${this.bill.status}</span>
    <span class="bill__status bill__confirmations">(${this.bill.confirmations} confirmation)</span>
    <span class="bill__status-icon"></span>
    `;
  }
  set action(val) {
    this.setAttribute(val, "");
  }
  set status(val) {
    if (this.hasAttribute(val)) return;
    if (this.hasAttribute("pending")) this.removeAttribute("pending");
    if (this.hasAttribute("confirming")) this.removeAttribute("confirming");
    if (this.hasAttribute("complete")) this.removeAttribute("complete");
    this.setAttribute(val, "");
  }
}

customElements.define("bill-content", BillElement);

class BillContent {
  constructor(asset, bill) {
    this.bill = bill;
    this.element =
      document.querySelector(`bill-content[id="${this.bill.id}"]`) ||
      document.createElement("bill-content");
    this.element.asset = asset;
    this.element.bill = bill;
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
  update() {
    this.element.update();
  }
}

export default BillContent;
