import route from "../controller/route";
import viewController from "../controller/view";
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
              this.asset
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
    this.addEventListener("click", (_) =>
      viewController.route("bill", this.bill)
    );
  }
  disconnectedCallback() {
    this.removeEventListener("click", (_) =>
      viewController.route("bill", this.bill)
    );
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
  constructor(asset, bill) {
    this.element = document.createElement("bill-item");
    this.element.asset = asset;
    this.element.bill = bill;
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}
export default BillItem;
