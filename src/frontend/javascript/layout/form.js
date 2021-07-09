const BigNumber = require("bignumber.js");
import TabBar from "../widget/tar-bar";
import Input from "../widget/input";
import Button from "../widget/button";
import Transaction from "../model/transaction";

const getTransactionFee = async (
  wallet,
  assetId,
  { to, amount, data } = {}
) => {
  const fee = await wallet.getTransactionFee(assetId, to, amount, data);
  console.log(fee);
  return fee;
};

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
    this.buttons.forEach((button, index) =>
      button.element.removeEventListener("click", () => this.updateFee(index))
    );
    this.transactionButton.removeEventListener("click", this.sendTransaction);
  }
  async connectedCallback() {
    this.selected = 1;
    this.className = "form";
    this.addressInput = new Input({
      inputType: "text",
      label: "Send to",
      errorMessage: "Invalid Address",
      validation: async (value) => {
        let validateResult = value.startsWith("0x") && value.length === 42;
        if (validateResult)
          this.fee = await getTransactionFee(this.wallet, this.asset.id, {
            to: value,
            amount: this.amountInput.isValid
              ? this.amountInput.inputValue
              : undefined,
          });
        return validateResult;
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
      validation: async (value) => {
        let validateResult = parseFloat(value) > 0;
        if (validateResult)
          this.fee = await getTransactionFee(this.wallet, this.asset.id, {
            to: this.addressInput.isValid
              ? this.addressInput.inputValue
              : undefined,
            amount: value,
          });
        return validateResult;
      },
      pattern: `\d*.?\d*`,
    });
    this.gasPriceInput = new Input({
      inputType: "number",
      label: `Custom Gas Price (${this.asset?.symbol || "ETH"})`, //test
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
    this.tabBar = new TabBar(this.buttons, { defaultFocus: this.selected });
    this.buttons.forEach((button, index) =>
      button.element.addEventListener("click", () => this.updateFee(index))
    );
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
    this.availableAmount = this.asset;
    this.action.render(this.children[8]);
    if (this.asset.symbol === "ETH") {
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
    this.transactionButton.addEventListener("click", this.sendTransaction);
    this.fee = await getTransactionFee(this.wallet, this.asset.id);
    this.updateFee();
  }

  set fee(fee) {
    this.feePerUnit = Object.values(fee.feePerUnit);
    console.log(fee.feePerUnit)
    console.log(this.feePerUnit)
    this.feeUnit = fee.unit;
  }

  updateFee(index) {
    console.log("updateFee index", index);
    if (index !== undefined) this.selected = index;
    console.log("updateFee feePerUnit", this.feePerUnit[this.selected]);
    console.log("updateFee feeUnit", this.feeUnit);
    this.estimateFee = BigNumber(this.feePerUnit[this.selected])
      .multipliedBy(BigNumber(this.feeUnit))
      .toFixed();
    if (this.toggleButton.checked) {
      this.gasPriceInput.inputValue = this.feePerUnit[this.selected];
      this.gasInput.inputValue = this.feeUnit;
    }
  }

  sendTransaction() {
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
  }

  handleTabBar() {}

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
      this.updateFee();
      this.setAttribute("on", "");
    } else {
      console.log("handleToggle", this.selected);
      this.tabBar = new TabBar(this.buttons, { defaultFocus: this.selected });
      this.tabBar.render(toggleContent);
      this.removeAttribute("on");
    }
  }
  get onAdvanced() {
    return this.hasAttribute("on");
  }
  set availableAmount(asset) {
    this.children[1].children[1].textContent =
      asset.balance + " " + asset.symbol;
  }
  set estimateFee(fee) {
    this.children[6].children[1].textContent = fee + " " + this.asset.symbol;
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
  constructor(wallet, asset, fiat, callback) {
    this.element = document.createElement("transaction-form");
    this.element.wallet = wallet;
    this.element.asset = asset;
    this.element.fiat = fiat;
    this.element.callback = callback;
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default Form;
