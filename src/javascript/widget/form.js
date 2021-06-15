import TabBar from "../layout/tar-bar";
import Input from "./input";
import Button from "./button";
class FormElement extends HTMLElement {
  constructor() {
    super();
  }
  disconnectedCallback() {
    this.children[8].removeEventListener("click", this.handleToggle);
  }
  connectedCallback() {
    this.className = "form";
    this.addressInput = new Input({
      inputType: "text",
      label: "Send to",
      errorMessage: "Invalid Address",
      validation: (value) => {
        return value.startsWith("0x");
      },
      action: {
        icon: "qrcode",
        onPressed: () => {
          console.log("action on pressed!");
        },
      },
    });
    this.amountInput = new Input({
      inputType: "number",
      label: "Amount",
      errorMessage: "Invalid Amount",
      validation: (value) => {
        return parseFloat(value) > 0;
      },
      pattern: `\d*.?\d*`,
    });
    this.gasPriceInput = new Input({
      inputType: "number",
      label: `Custom Gas Price (${this.state?.account?.symbol || "ETH"})`, //test
      pattern: `\d*.?\d*`,
    });
    this.gasInput = new Input({
      inputType: "number",
      label: "Custom Gas (unit)",
      pattern: `\d*`,
    });
    this.buttons = ["Slow", "Standard", "Fast"].map(
      (str) => new Button(str, () => {}, { style: ["round", "grey"] })
    );
    this.tabBar = new TabBar(this.buttons, { defaultFocus: 1 });
    this.action = new Button("Next", () => {}, { style: ["round", "outline"] });
    this.innerHTML = `
    <div class="form__input"></div>
    <p class="form__secondary-text form__align-end">
      <span>Balance:</span>
      <span class="account-balance"></span>
    </p>
    <p class="form__primary-text form__align-start">Transaction Fee</p>
    <div class="estimate-time"></div>
    <p class="form__tertiary-text form__align-start">Higher fees, faster transaction</p>
    <div class="form__toggle-content"></div>
    <p class="form__column">
      <span class="form__tertiary-text">Estimated:</span>
      <span class="form__secondary-text estimate-fee">loading...</span>
    </p>
    <div class="form__toggle">
      <div class="form__toggle-controller">
        <p class="form__tertiary-text form__align-end">Advanced Settings</p>
        <div class="form__toggle-button">
          <input type="checkbox" name="toggle-button" id="toggle-button">
          <label for="toggle-button"></label>
        </div>
      </div>
    </div>
    <div class="form__button"></div>
    `;
    this.toggle = false;
    this.addressInput.render(this.children[0]);
    this.amountInput.render(this.children[0]);
    this.tabBar.render(this.children[5]);
    this.availableAmount = this.state.account;
    this.action.render(this.children[8]);
  }
  /**
   *
   * @param {Boolean} val
   *
   */
  handleToggle() {
    this.toggle = !this.toggle;
    this.children[5].replaceChildren();
    if (this.toggle) {
      this.gasPriceInput.render(this.children[5]);
      this.gasInput.render(this.children[5]);
      this.children[8].setAttribute("on", "");
    } else {
      this.tabBar.render(this.children[5]);
      this.children[8].removeAttribute("on");
    }
  }
  set availableAmount(account) {
    this.children[1].children[1].textContent =
      account.balance + " " + account.symbol;
  }
  set estimateFee(fee) {
    this.children[6].children[1].textContent = fee + " " + account.symbol;
  }
  set estimateTime(time) {
    const markup = `
    <p class="form__secondary-text form__align-start">
        <span>Processing time</span>
        <span>${time}</span>
    </p>
    `;
    this.children[3].insertAdjacentHTML("afterbegin", markup);
  }
  /**
   * @param {Array<Object>} HTMLElement
   */
  set toggleContent(content) {
    this.content = content;
  }
  set onSubmit(element) {
    element.render(this.lastElementChild);
  }
  /**
   * @param {Boolean} val
   */
  set toggle(val) {
    if (val) {
      this.children[7].removeAttribute("disabled");
      this.children[7].addEventListener("click", this.handleToggle);
    } else {
      this.children[7].setAttribute("disabled", "");
      this.children[7].removeEventListener("click", this.handleToggle);
    }
  }
}

customElements.define("transaction-form", FormElement);

class Form {
  constructor(state) {
    this.state = JSON.parse(JSON.stringify(state));
  }
  render(parentElement) {
    this.element = document.createElement("transaction-form");
    this.element.state = this.state;
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default Form;
