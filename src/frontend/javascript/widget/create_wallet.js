import viewController from "../controller/view";
import Button from "./button";

class CreateWalletElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "create-wallet";
    this.innerHTML = `
    <div class="create-wallet__text">Two ways to create wallet:</div>
    `;
    this.automaticButton = new Button("Automatic", this.callback, {
      style: ["round", "fill"],
    });
    this.mnemonicButton = new Button(
      "Mnemonic",
      () => viewController.route("mnemonic"),
      {
        style: ["round", "outline"],
      }
    );
    this.automaticButton.render(this);
    this.mnemonicButton.render(this);
  }
}

customElements.define("create-wallet", CreateWalletElement);

class CreateWallet {
  constructor(callback) {
    this.element = document.createElement("create-wallet");
    this.element.callback = callback;
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default CreateWallet;
