import AccountItem from "../widget/account_item";

class AccountListElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "account-list";
    this.accounts.forEach((account) => account.render(this));
  }
  update() {
    this.replaceChildren();
    this.accounts.forEach((account) => account.render(this));
  }
}

customElements.define("account-list", AccountListElement);

class AccountList {
  constructor(state) {
    this.state = JSON.parse(JSON.stringify(state));
    this.element = document.createElement("account-list");
    const { accounts } = this.state.user;
    this.update(accounts);
  }
  update(accounts) {
    this.state.user.accounts = JSON.parse(JSON.stringify(accounts));
    this.element.accounts = accounts.map((account) => {
      const state = JSON.parse(JSON.stringify(this.state));
      state.account = account;
      state.screen = "account";
      return new AccountItem(state);
    });
    if(document.querySelector("account-list")){
      this.element.update();
    }
  }
  updateAccount(account) {
    const { accounts } = this.state.user;
    const index = accounts.findIndex((acc) => acc.id === account.id);
    if (index > -1) {
      this.state.user.accounts[index] = JSON.parse(JSON.stringify(account));
      const state = JSON.parse(JSON.stringify(this.state));
      state.account = this.state.user.accounts[index];
      state.screen = "account";
      this.element.accounts[index] = new AccountItem(state);
      this.element.accounts[index].update();
    } else {
      this.state.user.accounts.push(account);
      const state = JSON.parse(JSON.stringify(this.state));
      state.account = account;
      state.screen = "account";
      this.element.accounts.push(new AccountItem(state));
      this.element.accounts[this.element.accounts.length - 1].render(
        this.element
      );
    }
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default AccountList;
