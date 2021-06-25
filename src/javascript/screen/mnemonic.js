import viewController from "../controller/view";
import Header from "../layout/header";
import Scaffold from "../layout/scaffold";
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
        <div class="mnemonic-form__text-area"></div>
        <div class="mnemonic-form__input"></div>
        <div class="mnemonic-form__input"></div>
        <div class="mnemonic-form__button"></div>
        `;
    this.passphraseInput = new Input({
      inputType: "text",
      label: "passphrase",
    });
    this.retypePassphraseInput = new Input({
      inputType: "text",
      label: "retype passphrase",
    });
    this.confirmButton = new Button(
      "confirm",
      () => viewController.route("screen"),
      {
        style: ["round", "fill"],
      }
    );
    this.passphraseInput.render(this.children[2]);
    this.retypePassphraseInput.render(this.children[3]);
    this.confirmButton.render(this.children[4]);
  }
}

customElements.define("mnemonic-form", MnemonicFormElement);

class MnemonicForm {
  constructor() {
    this.element = document.createElement("mnemonic-form");
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("afterbegin", this.element);
  }
}

class Mnemonic {
  constructor() {
    this.header = new Header("mnemonic");
    this.body = new MnemonicForm();
  }
  render() {
    this.scaffold = new Scaffold(this.header, this.body);
  }
}

const MnemonicScreen = new Mnemonic();

export default MnemonicScreen;
