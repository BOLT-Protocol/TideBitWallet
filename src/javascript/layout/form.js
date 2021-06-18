import TabBar from "../widget/tar-bar";
import Input from "../widget/input";
import Button from "../widget/button";
import Transaction from "../model/transaction";

class FormElement extends HTMLElement {
  constructor() {
    super();
  }
  disconnectedCallback() {
    if (this.toggle) {
      this.toggleButton.removeEventListener("change", (e) => {
        this.handleToggle(this.toggleContent);
      });
    }
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
    <p class="form__secondary-text form__align-start estimate-time">
        <span>Processing time</span>
        <span></span>
    </p>
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
    this.addressInput.render(this.children[0]);
    this.amountInput.render(this.children[0]);
    this.tabBar.render(this.children[5]);
    this.estimateTime = "10 ~ 30 minutes";
    this.availableAmount = this.state.account;
    this.action.render(this.children[8]);
    if (this.state.account.symbol === "ETH") {
      // -- test
      this.toggle = true;
      this.toggleButton = document.querySelector(
        ".form input[type='checkbox']"
      );
      this.toggleButton.addEventListener("change", (e) => {
        this.handleToggle(this.toggleContent);
      });
    } else {
      this.toggle = false;
    }
    this.transactionButton = this.children[this.childElementCount - 1];
    console.log(this.transactionButton);
    this.transactionButton.addEventListener("click", () => {
      console.log("transactionButton", this.callback);
      const to = this.addressInput.inputValue;
      const amount = this.amountInput.inputValue;

      let gasPrice, gas, priority;
      if (this.onAdvanced) {
        gasPrice = this.gasPrice.inputValue;
        gas = this.gas.inputValue;
        this.callback(new Transaction({ to, amount, gasPrice, gas }));
      } else {
        priority = this.tabBar.selected;
        this.callback(new Transaction({ to, amount, priority }));
      }
    });
  }

  /**
   *
   * @param {Boolean} val
   *
   */
  handleToggle(toggleContent) {
    toggleContent.replaceChildren();
    if (this.toggleButton.checked) {
      this.gasPriceInput.render(toggleContent);
      this.gasInput.render(toggleContent);
      this.setAttribute("on", "");
    } else {
      this.tabBar.render(toggleContent);
      this.removeAttribute("on");
    }
  }
  get onAdvanced() {
    return this.hasAttribute("on");
  }
  set availableAmount(account) {
    this.children[1].children[1].textContent =
      account.balance + " " + account.symbol;
  }
  set estimateFee(fee) {
    this.children[6].children[1].textContent = fee + " " + account.symbol;
  }
  set estimateTime(time) {
    this.children[3].children[1].textContent = time;
  }
  /**
   * @param {Array<Object>} HTMLElement
   */
  get toggleContent() {
    return this.children[5];
  }
  set onSubmit(element) {
    element.render(this.lastElementChild);
  }
  /**
   * @param {Boolean} val
   */
  set toggle(val) {
    if (val) {
      this.removeAttribute("disabled-toggle");
    } else {
      this.setAttribute("disabled-toggle", "");
    }
  }
}

customElements.define("transaction-form", FormElement);

class Form {
  constructor(state, callback) {
    this.state = JSON.parse(JSON.stringify(state));
    this.callback = callback;
  }
  render(parentElement) {
    this.element = document.createElement("transaction-form");
    this.element.state = this.state;
    this.element.callback = this.callback;
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default Form;
