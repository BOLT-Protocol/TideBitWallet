import route from "../utils/route";
class AccountItem extends HTMLElement {
  constructor() {
    super(); // always call super() first in the constructor.
    this.markup = (account, fiat) => `
    <div class="account-item__icon">
        <img src=${account.image} alt=${account.symbol.toUpperCase()}>
    </div>
    <div class="account-item__symbol">${account.symbol.toUpperCase()}</div>
    <div class="account-item__balance">${account.balance}</div>
    <div class="account-item__to-currency">
        <span class="almost-equal-to">&#8776;</span>
        <span class="balance">${account.infiat}</span>
        <span class="currency-unit">${fiat.symbol}</span>
    </div>
      `;
    this.addEventListener("click", (event) => {
      if (this.account) {
        this.state.account = this.account;
        this.state.backward = "accounts";
        this.state.screen = "account";
        route(this.state);
      } else {
        return;
      }
    });
  }
  connectedCallback() {
    this.className = "account-item";
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
    if (this.fiat) {
      this.account.infiat = this.account.inUSD / this.fiat.inUSD;
      return;
    }
    return;
  }
  set child(data) {
    this.state = JSON.parse(JSON.stringify(data.state));
    this.account = JSON.parse(JSON.stringify(data.account));
    this.fiat = this.state.walletConfig.fiat;
    this.exchange();
    this.insertAdjacentHTML("afterbegin", this.markup(this.account, this.fiat));
    this.publish = this.account.publish;
    this.id = this.account.id;
  }
}

export default AccountItem;
