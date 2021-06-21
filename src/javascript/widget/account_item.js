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
  set id(val) {
    this.setAttribute("id", val);
  }
  static update(element, state) {
    element.innerHTML = `
    <div class="account-item__icon"></div>
    <div class="account-item__symbol"></div>
    <div class="account-item__balance"></div>
    <div class="account-item__to-currency">
        <span class="almost-equal-to">&#8776;</span>
        <span class="balance"></span>
        <span class="currency-unit"></span>
    </div>
    `;
    element.exchange(state);
    element.publish = state.account.publish;
    element.children[0].insertAdjacentHTML(
      "afterbegin",
      `<img src=${
        state.account.image
      } alt=${state.account.symbol.toUpperCase()}>`
    );
    element.children[1].textContent =
      state.account.symbol.toUpperCase();
    element.children[2].textContent = state.account.balance;
    element.children[3].children[1].textContent = state.account.infiat;
    element.children[3].children[2].textContent =
      state.walletConfig.fiat.symbol;
    element.addEventListener("click", (e) => route(state));
  }
  connectedCallback() {
    this.className = "account-item";
    this.id = this.state.account.id;
    AccountItemElement.update(this, this.state);
  }
  disconnectedCallback() {
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
  exchange(state) {
    if (state.walletConfig.fiat) {
      state.account.infiat =
        state.account.inUSD / state.walletConfig.fiat.inUSD;
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
  update() {
    const element = document.querySelector(`[id=${this.id}]`);
    AccountItemElement.update(element, this.element.state);
  }
}

export default AccountItem;
