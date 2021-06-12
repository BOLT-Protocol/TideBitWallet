import { addressFormatter } from "../utils/utils";

class BillItem extends HTMLElement {
  constructor() {
    super();
    this.markup = () => `
    <div class="bill-item__main">
        <div class="bill-item__icon">
            <img src=${
              this.bill.directionIcon
            } alt=${this.bill.action.toLowerCase()}>
        </div>
        <div class="bill-item__title">
            <div class="bill-item__action">${this.bill.action}</div>
            <div class="bill-item__detail">
                <span class="bill-item__direction">${this.bill.direction}</span>
                <span class="bill-item__address">${addressFormatter(
                  this.bill.address
                )}</span>
            </div>
        </div>
        <div class="bill-item__suffix">
            <div class="bill-item__amount">${this.bill.formattedAmount(
              this.account
            )}</div>
            <div class="bill-item__time">${this.bill.dateTime}</div>
        </div>
    </div>
    <div class="bill-item__sub">
        <div class="bill-item__status">${this.bill.status}</div>
        <div class="bill-item__progress"><span style="width: ${this.bill.progress}"></span></div>
    </div>
        `;
    this.addEventListener("click", () => {
      // let transactionDetail = ui.getTransactionDetail({ transactionID });
    });
  }
  connectedCallback() {
    this.classList = ["bill-item"];
  }
  static get observedAttributes() {
    return ["pending", "confirming", "complete"];
  }
  set status(val) {
    if (this.hasAttribute("pending")) this.removeAttribute("pending");
    if (this.hasAttribute("confirming")) this.removeAttribute("confirming");
    if (this.hasAttribute("complete")) this.removeAttribute("complete");
    this.setAttribute(val, "");
  }
  set action(val) {
    this.setAttribute(val, "");
  }
  set child(data) {
    this.account = data.account;
    this.bill = data.bill;
    this.insertAdjacentHTML("afterbegin", this.markup());
    this.status = this.bill.status.toLowerCase();
    this.action = this.bill.action.toLowerCase();
  }
}

export default BillItem;
