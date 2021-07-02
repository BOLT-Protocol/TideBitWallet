import QRCode from "qrcode";
import Button from "../widget/button";
import { to } from "../utils/utils";

class AddressContentElement extends HTMLElement {
  constructor() {
    super();
  }
  set id(val) {
    this.setAttribute("id", val);
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
    this.id = this.asset.id;
    this.setCoinbase();
  }
  /**
   * ETH || BTC
   */
  setCoinbase() {
    this.setAttribute(this.asset.accountType, "");
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
      }
    );
    this.children[3].textContent = this.address;
    const button = new Button("Copy Wallet Address", () => {}, {
      style: ["round", "outline"],
      suffix: "copy",
      popup: async () => {
        // https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
        const [err, _] = await to(navigator.clipboard.writeText(this.address));
        return err ? "Error!" : "Copy";
      },
    });
    button.render(this.children[4]);
  };
}

customElements.define("address-content", AddressContentElement);

class AddressContent {
  constructor(asset) {
    this.asset = asset;
    this.element = document.createElement("address-content");
    this.element.asset = asset;
  }
  update(address) {
    this.element = document.querySelector(
      `address-content[id="${this.asset.id}"]`
    );
    this.element.address = address;
    this.element.renderAddress();
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default AddressContent;
