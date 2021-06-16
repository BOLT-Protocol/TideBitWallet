import route from "../utils/route";
import { addressFormatter } from "../utils/utils";

class BillItemElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.classList = ["bill-item"];
    this.innerHTML = `
    <div class="bill-item__main">
        <div class="bill-item__icon"></div>
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
              this.state.account
            )}</div>
            <div class="bill-item__time">${this.bill.dateTime}</div>
        </div>
    </div>
    <div class="bill-item__sub">
        <div class="bill-item__status">${this.bill.status}</div>
        <div class="bill-item__progress"><span style="width: ${
          this.bill.progress
        }"></span></div>
    </div>
    `;
    this.status = this.bill.status.toLowerCase();
    this.action = this.bill.action.toLowerCase();
    this.addEventListener("click", (e) => route(this.state));
  }
  disconnectedCallback() {
    this.removeEventListener("click", (e) => route(this.state));
  }
  static get observedAttributes() {
    return ["pending", "confirming", "complete"];
  }
  set status(val) {
    if (this.hasAttribute(val)) return;
    if (this.hasAttribute("pending")) this.removeAttribute("pending");
    if (this.hasAttribute("confirming")) this.removeAttribute("confirming");
    if (this.hasAttribute("complete")) this.removeAttribute("complete");
    this.setAttribute(val, "");
  }
  set action(val) {
    this.setAttribute(val, "");
  }
}

customElements.define("bill-item", BillItemElement);
class BillItem {
  constructor(state) {
    this.element = document.createElement("bill-item");
    this.element.state = state;
    this.element.bill = state.bill;
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}
export default BillItem;
