import "../widget/button";
import header from "../layout/header";
import QRCode from "qrcode";

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
  set coinbase(val){
      this.setAttribute(val,'');
  }
  set address(address) {
    const button = document.createElement("default-button");
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
    this.children[4].insertAdjacentElement("afterbegin", button);
    button.style = ["round", "outline"];
    button.text = "Copy Wallet Address";
    button.suffix = `<i class="far fa-copy"></i>`;
    button.onPressed = () => {
      navigator.clipboard.writeText(address).then(
        function () {
          console.log("Async: Copying to clipboard was successful!");
          button.popup = true;
          setTimeout(()=>{
            button.popup = false;
          },300);
        },
        function (err) {
          console.error("Async: Could not copy text: ", err);
        }
      );
    };
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
