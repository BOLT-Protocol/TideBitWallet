import route from "../utils/route";
class AccountItemElement extends HTMLElement {
  constructor() {
    super(); // always call super() first in the constructor.
    this.addEventListener("click", (_) => {
      if (this.account) {
        this.state.account = this.account;
        this.state.screen = "account";
        route(this.state);
      } else {
        return;
      }
    });
  }
  connectedCallback() {
    this.className = "account-item";
    this.innerHTML = `
    <div class="account-item__icon"></div>
    <div class="account-item__symbol"></div>
    <div class="account-item__balance"></div>
    <div class="account-item__to-currency">
        <span class="almost-equal-to">&#8776;</span>
        <span class="balance"></span>
        <span class="currency-unit"></span>
    </div>
    `;
    this.exchange();
    this.publish = this.state.account.publish;
    this.children[0].insertAdjacentHTML(
      "afterbegin",
      `<img src=${
        this.state.account.image
      } alt=${this.state.account.symbol.toUpperCase()}>`
    );
    this.children[1].textContent = this.state.account.symbol.toUpperCase();
    this.children[2].textContent = this.state.account.balance;
    this.children[3].children[1].textContent = this.state.account.infiat;
    this.children[3].children[2].textContent =
      this.state.walletConfig.fiat.symbol;
    this.addEventListener("click", (e) => route(this.state));
  }
  disconnectedCallback() {
    console.log("accounts disconnected");
    this.removeEventListener("click", (e) => route(this.state));
  }
  get publish() {
    return this.hasAttribute("publish");
  }
  set publish(val) {
    if (val) {
      this.setAttribute("publish", "");
    } else {
      this.removeAttribute("publish");
    }
  }
  exchange() {
    if (this.state.walletConfig.fiat) {
      this.state.account.infiat =
        this.state.account.inUSD / this.state.walletConfig.fiat.inUSD;
      return;
    }
    return;
  }
}

customElements.define("account-item", AccountItemElement);
class AccountItem {
  constructor(state) {
    this.id = state.account.id;
    this.element = document.createElement("account-item");
    this.element.state = state;
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default AccountItem;
