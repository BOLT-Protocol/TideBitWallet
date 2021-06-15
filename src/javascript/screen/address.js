import { to } from "../utils/utils";
import header from "../layout/header";
import QRCode from "qrcode";
import Button from "../widget/button";

class Address extends HTMLElement {
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
  }
  /**
   * ETH || BTC
   */
  set coinbase(val) {
    this.setAttribute(val, "");
  }
  set address(address) {
    QRCode.toCanvas(
      this.children[2].children[0],
      address,
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
    this.children[3].textContent = address;
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
  }
}

customElements.define("address-content", Address);

const address = (scaffold, state) => {
  let _address = "0xd885833741f554a0e64ffd1141887d65e0dded01"; //ui.getReceiveAddress({ accountID });
  scaffold.header = header(state);
  const addressContent = document.createElement("address-content");
  scaffold.body = addressContent;
  addressContent.coinbase = state.account.symbol;
  addressContent.address = _address;
};

export default address;
