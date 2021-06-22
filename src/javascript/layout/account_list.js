import AccountItem from "../widget/account_item";

class AccountListElement extends HTMLElement {
  constructor() {
    super();
  }
  update() {
    this.replaceChildren();
    this.accounts.forEach((account) => account.render(this));
  }
  connectedCallback() {
    this.className = "account-list";
    this.update();
  }
}

customElements.define("account-list", AccountListElement);

class AccountList {
  constructor(accounts, fiat) {
    this.updateAccounts(accounts);
    this.updateFiat(fiat);
    this.element = document.createElement("account-list");
    this.element.accounts = this.accounts.map((account) =>
      this.accountItem(account)
    );
  }
  accountItem = (account) => new AccountItem(account, this.fiat);
  updateAccounts(accounts) {
    this.accounts = JSON.parse(JSON.stringify(accounts));
  }
  updateFiat(fiat) {
    this.fiat = JSON.parse(JSON.stringify(fiat));
  }
  update(accounts, fiat) {
    this.updateAccounts(accounts);
    this.updateFiat(fiat);
    this.element.accounts = this.accounts.map((account) =>
      this.accountItem(account)
    );
    this.element.update();
  }
  updateAccount(account, fiat) {
    updateFiat(fiat);
    const index = this.accounts.findIndex((acc) => acc.id === account.id);
    if (index > -1) {
      this.element.accounts[index] = accountItem(account);
      this.element.accounts[index].update();
    } else {
      this.accounts.push(account);
      this.element.accounts.push(new AccountItem(state));
      this.element.accounts[this.element.accounts.length - 1].render(
        this.element
      );
    }
    if (document.querySelector("account-list")) {
      this.element.update();
    }
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default AccountList;
