import route from "../controller/route";
class AccountItemElement extends HTMLElement {
  constructor() {
    super(); // always call super() first in the constructor.
  }
  set id(val) {
    this.setAttribute("id", val);
  }
  static update(element, account, fiat) {
    if (element === undefined || element === null) return;
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
    element.publish = account.publish;
    element.children[0].insertAdjacentHTML(
      "afterbegin",
      `<img src=${account.image} alt=${account.symbol.toUpperCase()}>`
    );
    element.children[1].textContent = account.symbol.toUpperCase();
    element.children[2].textContent = account.balance;
    element.children[3].children[1].textContent = account.infiat;
    element.children[3].children[2].textContent = fiat.symbol;
    element.addEventListener("click", (e) =>
      route({ screen: "account", account, fiat })
    );
  }
  connectedCallback() {
    this.className = "account-item";
    this.id = this.account.id;
    AccountItemElement.update(this, this.account, this.fiat);
  }
  disconnectedCallback() {
    this.removeEventListener("click", (e) =>
      route({ screen: "account", account, fiat })
    );
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
}

customElements.define("account-item", AccountItemElement);
class AccountItem {
  constructor(account, fiat) {
    this.id = account.id;
    this.element = document.createElement("account-item");
    this.element.account = account;
    this.element.fiat = fiat;
  }
  update(account, fiat) {
    const element = document.querySelector(`[id=${this.id}]`);
    AccountItemElement.update(element, account, fiat);
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default AccountItem;
