import AccountItem from "../widget/account_item";

class AccountListElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "account-list";
    this.accounts.forEach((account) => account.render(this));
  }
}

customElements.define("account-list", AccountListElement);

class AccountList {
  constructor(state) {
    this.element = document.createElement("account-list");
    this.element.state = JSON.parse(JSON.stringify(state));
    this.element.accounts = state.user.accounts.map((account) => {
      const state = JSON.parse(JSON.stringify(this.element.state));
      state.account = account;
      state.screen = "account";
      return new AccountItem(state);
    });
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default AccountList;
