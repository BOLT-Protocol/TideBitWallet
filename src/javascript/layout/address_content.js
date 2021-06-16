import QRCode from "qrcode";
import Button from "../widget/button";
import { to } from "../utils/utils";

class AddressContentElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "address";
    this.innerHTML = `
          <div class="address__header">Receiving address</div>
          <div class="address__subtitle">We automatically generate a new address for you after every transaction you
            receive
            to protect your privacy, so that would be not easy to track your entire payment history.</div>
          <div class="address__qrcode"><canvas></canvas></div>
          <div class="address__text"></div>
          <div class="address__button"></div>
          `;
    this.renderAddress();
    this.setCoinbase();
  }
  /**
   * ETH || BTC
   */
  setCoinbase() {
    this.setAttribute(this.state.account.symbol, "");
  }
  renderAddress = () => {
    QRCode.toCanvas(
      this.children[2].children[0],
      this.address,
      {
        version: "auto",
        errorCorrectionLevel: "high",
        color: {
          light: "#fff",
          dark: "#000",
        },
        toSJISFunc: QRCode.toSJIS,
      },
      (error) => {
        if (error) console.error(error);
        console.log("success!");
      }
    );
    this.children[3].textContent = this.address;
    const button = new Button("Copy Wallet Address", () => {}, {
      style: ["round", "outline"],
      suffix: "copy",
      popup: async () => {
        console.log("popup");
        // https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
        const [err, _] = await to(navigator.clipboard.writeText(address));
        return err ? "Error!" : "Copy";
      },
    });
    button.render(this.children[4]);
  };
}

customElements.define("address-content", AddressContentElement);

class AddressContent {
  constructor(state, address) {
    this.element = document.createElement("address-content");
    this.element.state = state;
    this.element.address = address;
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default AddressContent;
