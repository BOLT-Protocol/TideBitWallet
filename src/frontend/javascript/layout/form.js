const BigNumber = require("bignumber.js");
import TabBar from "../widget/tar-bar";
import Input from "../widget/input";
import Button from "../widget/button";
import Transaction from "../model/transaction";
import viewController from "../controller/view";
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
    this.transactionButton.removeEventListener("click", () =>
      this.sendTransaction(
        this.addressInput.inputValue,
        this.amountInput.inputValue,
        this.feePerUnit[this.selected],
        this.feeUnit
      )
    );
  }
  async connectedCallback() {
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
    this.selected = 1;
    this.className = "form";
    this.addressInput = new Input({
      inputType: "text",
      label: "Send to",
      errorMessage: "Invalid Address",
      validation: (value) => this.verifyAddress(this.asset.id, value),
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
      validation: (value) =>
        this.verifyAmount(this.asset.id, value, this.feeInCurrencyUnit),
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
      (str) =>
        new Button(str, () => {}, {
          style: ["round", "grey"],
        })
    );
    this.tabBar = new TabBar(this.buttons, {
      defaultFocus: this.selected,
    });
    this.buttons.forEach((button, index) =>
      button.element.addEventListener("click", () => this.updateFee(index))
    );
    this.action = new Button("Next", () => {}, {
      style: ["round", "outline"],
    });
    this.addressInput.render(this.children[0]);
    this.amountInput.render(this.children[0]);
    this.tabBar.render(this.children[5]);
    this.estimateTime = "10 ~ 30 minutes";
    this.availableAmount = this.asset;
    this.action.render(this.children[8]);
    if (this.asset.accountType === "ETH" || "CFC") {
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
    this.transactionButton.addEventListener("click", () =>
      this.sendTransaction(
        this.addressInput.inputValue,
        this.amountInput.inputValue,
        this.feePerUnit[this.selected],
        this.feeUnit
      )
    );
    this.fee = await this.getTransactionFee();
    this.updateFee();
  }

  set fee(fee) {
    this.feePerUnit = Object.values(fee.feePerUnit);
    this.feeUnit = fee.unit;
    this.feeInCurrencyUnit = BigNumber(this.feePerUnit[this.selected])
      .multipliedBy(BigNumber(this.feeUnit))
      .toFixed();
  }

  updateFee(index) {
    if (index !== undefined) this.selected = index;
    this.feeInCurrencyUnit = BigNumber(this.feePerUnit[this.selected])
      .multipliedBy(BigNumber(this.feeUnit))
      .toFixed();
    this.estimateFee = this.feeInCurrencyUnit;
    if (this.toggleButton?.checked) {
      this.gasPriceInput.inputValue = this.feePerUnit[this.selected];
      this.gasInput.inputValue = this.feeUnit;
    }
  }

  async verifyAddress(id, address) {
    let validateResult = this.wallet.verifyAddress(id, address);
    console.log("verifyAddress", address);
    // let validateResult = address.startsWith("0x") && address.length === 42;
    if (validateResult)
      this.fee = await this.getTransactionFee({
        to: address,
        amount: this.amountInput.isValid
          ? this.amountInput.inputValue
          : undefined,
      });
    return validateResult;
  }

  async verifyAmount(id, amount, fee) {
    let validateResult = this.wallet.verifyAmount(id, amount, fee);
    // let validateResult = parseFloat(amount) > 0;
    if (validateResult)
      this.fee = await this.getTransactionFee({
        to: this.addressInput.isValid
          ? this.addressInput.inputValue
          : undefined,
        amount: amount,
      });
    return validateResult;
  }

  async getTransactionFee({ to, amount, data } = {}) {
    const fee = await this.wallet.getTransactionFee(
      this.asset.id,
      to,
      amount,
      data
    );
    console.log(fee);
    return fee;
  }

  /**
   * getEstimateTime().then((timeString) => {
   *    const estimateTimeEl = document.querySelector('.estimate-time');
   *    estimateTimeEl.textContent = timeString;
   * }).catch((error) => {
   *    estimateTimeEl.textContent = "would take longer than you can expected";
   * })
   */

  async sendTransaction(to, amount, feePerUnit, feeUnit) {
    const transaction = new Transaction({
      to,
      amount,
      feePerUnit,
      feeUnit,
      fee: this.feeInCurrencyUnit,
    });
    console.log(transaction);
    this.parent.openPopover(
      "confirm",
      "Are you sure to make this transaction?",
      async () => {
        this.parent.openPopover("loading");
        try {
          const response = await this.wallet.sendTransaction(
            this.asset.id,
            transaction
          );
          if (response) viewController.route("asset");
          else {
            this.parent.openPopover("error", "Transaction Failed");
          }
          // if (response) this.parent.openPopover("success", "Success!");
        } catch (e) {
          console.log(e);
          this.parent.openPopover("error");
        }
      },
      false
    );
  }

  /**
   *
   * @param {Boolean} val
   *
   */
  handleToggle(toggleContent) {
    toggleContent.replaceChildren();
    if (this.toggleButton?.checked) {
      this.gasPriceInput.render(toggleContent);
      this.gasInput.render(toggleContent);
      this.updateFee();
      this.setAttribute("on", "");
    } else {
      this.tabBar = new TabBar(this.buttons);
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
  constructor(wallet, asset, fiat) {
    this.element = document.createElement("transaction-form");
    this.element.wallet = wallet;
    this.element.asset = asset;
    this.element.fiat = fiat;
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
  set parent(element) {
    this.element.parent = element;
  }
}

export default Form;
