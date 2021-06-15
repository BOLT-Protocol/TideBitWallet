import header from "../layout/header";
import { addressFormatter } from "../utils/utils";

class Bill extends HTMLElement {
  constructor() {
    super();
    this.markup = () => `
        <div class="bill__header">
            <span class="bill__sign">${this.bill.sign}</span>
            <span class="bill__amount">${this.bill.amount}</span>
            <span class="bill__unit">${this.account.symbol}</span>
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
                <span class="bill__unit">${this.account.symbol}</span>
            </div>
        </div>
        <div class="bill__cell">
            <div class="bill__title">Transaction Id</div>
            <div class="bill__content">
                <span class="bill__asset-icon"><img src=${
                  this.account.image
                } alt="ETH"></span>
                <span class="bill__id"><a target="_blank" href=https://${
                  this.account.network
                }.etherscan.io/tx/${this.bill.txid}>${addressFormatter(
      this.bill.txid
    )}</a></span>
            </div>
        </div>
    `;
  }
  connectedCallback() {
    this.className = "bill";
  }
  set action(val) {
    this.setAttribute(val, "");
  }
  set status(val) {
    if (this.hasAttribute(val))return;
    if (this.hasAttribute("pending")) this.removeAttribute("pending");
    if (this.hasAttribute("confirming")) this.removeAttribute("confirming");
    if (this.hasAttribute("complete")) this.removeAttribute("complete");
    this.setAttribute(val, "");
  }
  set child(data) {
    this.bill = data.bill;
    this.account = data.account;
    this.insertAdjacentHTML("afterbegin", this.markup());
    this.status = this.bill.status.toLowerCase();
    this.action = this.bill.action.toLowerCase();
  }
}

customElements.define("bill-content", Bill);

const bill = (scaffold, state) => {
  const billContent = document.createElement("bill-content");
  billContent.child = {
    bill: state.bill,
    account: state.account,
  };
  scaffold.header = header(state);
  scaffold.body = billContent;
};

export default bill;
