import Button from "../widget/button";
import Input from "../widget/input";

class MnemonicFormElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "mnemonic-form";
    this.innerHTML = `
          <div class="mnemonic-form__text">Please use spaces to separate different mnemonic words</div>
          <div class="mnemonic-form__text-area">
              <div class="mnemonic-form__label">Enter mnemonic</div>
              <textarea rows="5"></textarea>
          </div>
          <div class="mnemonic-form__input"></div>
          <div class="mnemonic-form__input"></div>
          <div class="mnemonic-form__button"></div>
          `;
    this.passphraseInput = new Input({
      inputType: "text",
      label: "passphrase [Optional]",
    });
    this.retypePassphraseInput = new Input({
      inputType: "text",
      label: "retype passphrase [Optional]",
      errorMessage: "Retype passphrase is different from the first typed",
      validation: (value) => {
        return value === this.passphraseInput.inputValue;
      },
    });
    this.confirmButton = new Button("confirm", () => {}, {
      style: ["round", "fill-primary"],
    });
    // this.children[4].children[0].disabled = true;
    this.confirmButton.disabled = true;
    this.passphraseInput.render(this.children[2]);
    this.retypePassphraseInput.render(this.children[3]);
    this.confirmButton.render(this.children[4]);
    this.children[1].children[1].addEventListener("input", (e) => {
      this.inputValue = e.target.value;
      if (e.target.value) {
        // this.children[4].children[0].disabled = false;
        this.confirmButton.disabled = false;
      } else {
        // this.children[4].children[0].disabled = true;
        this.confirmButton.disabled = true;
      }
    });
    // confirmButton
    this.confirmButton.element.addEventListener("click", (_) => {
      if (!this.inputValue) return;
      this.parent?.openPopover("loading");
      this.callback({
        mnemonic: this.inputValue,
        passphrase: this.passphraseInput.inputValue || "",
      });
    });
  }
  disconnectedCallback() {}
}

customElements.define("mnemonic-form", MnemonicFormElement);

class MnemonicForm {
  constructor(callback) {
    this.element = document.createElement("mnemonic-form");
    this.element.callback = callback;
  }
  set parent(element) {
    this.element.parent = element;
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("afterbegin", this.element);
  }
}

export default MnemonicForm;
