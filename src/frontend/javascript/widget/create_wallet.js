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
    this.automaticButton = new Button("Automatic", this.onAutomatic, {
      style: ["round", "fill"],
    });
    this.mnemonicButton = new Button("Mnemonic", this.onMnemonic, {
      style: ["round", "outline"],
    });
    this.automaticButton.render(this);
    this.mnemonicButton.render(this);
  }
}

customElements.define("create-wallet", CreateWalletElement);

class CreateWallet {
  constructor({onAutomatic, onMnemonic}) {
    this.element = document.createElement("create-wallet");
    this.element.onAutomatic = onAutomatic;
    this.element.onMnemonic = onMnemonic;
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default CreateWallet;
