// https://unicode-table.com/cn/2248/

import viewController from "../controller/updateView";

const getHeaderInfo = (screen) => {
  switch (screen) {
    case "transaction":
      return { screenTitle: "Send Coin" };
    case "bill":
      return { screenTitle: "Transaction Detail" };
    case "address":
      return { screenTitle: "My Wallet" };
  }
};

class BackButtonElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "header__leading";
    if (this.icon) {
      this.innerHTML = `<i class="fas fa-${icon}">`;
    } else {
      this.innerHTML = `<i class="fas fa-arrow-left">`;
    }
    this.addEventListener("click", (_) => viewController.route(this.screen));
  }
  disconnectedCallback() {
    this.removeEventListener("click", (_) => viewController.route(this.screen));
  }
}

customElements.define("back-button", BackButtonElement);

class BackButton {
  constructor(screen, icon) {
    this.element = document.createElement("back-button");
    this.element.screen = screen;
    this.element.icon = icon;
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("afterbegin", this.element);
  }
}

class HeaderElement extends HTMLElement {
  constructor() {
    super();
  }
  overviewHeader = (totalAsset, fiat) => {
    const markup = `
      <div class="header__title">Total Asset</div>
      <div class="header__title-sub">
        <span class="almost-equal-to">&#8776;</span>
        <span class="user-total-balance">${totalAsset}</span>
        <span class="currency-unit">${fiat.symbol}</span>
      </div>
    `;
    return markup;
  };
  accountHeader = (account, fiat) => {
    const markup = `
    <div class="header__icon">
      <img src=${account.image}  alt=${account.symbol.toUpperCase()}>
    </div>
    <div class="header__icon-title">${account.symbol.toUpperCase()}</div>
    <div class="header__title">${account.balance}</div>
    <div class="header__title-sub">
      <span class="almost-equal-to">&#8776;</span>
      <span class="balance">${account.infiat}</span>
      <span class="currency-unit">${fiat.symbol}</span>
    </div>
    `;
    return markup;
  };
  defaultHeader = (screen) => {
    const { screenTitle, actionHTML } = getHeaderInfo(screen);
    const markup = `
        <div class="header__title">${screenTitle}</div>
        <div class="header__action ${actionHTML ? "" : "disabled"}">${
      actionHTML ? actionHTML : '<i class="fas fa-ellipsis-h"></i>'
    }</div>
    `;
    return markup;
  };
  connectedCallback() {
    switch (this.screen) {
      case "accounts":
      case "settings":
        this.classList = ["header header--overview"];
        this.innerHTML = this.overviewHeader(this.totalAsset, this.fiat);
        break;
      case "account":
        this.classList = ["header header--account"];
        this.innerHTML = this.accountHeader(this.account, this.fiat);
        this.headerLeading = new BackButton("accounts");
        this.headerLeading.render(this);
        break;
      default:
        this.classList = ["header header--default"];
        this.innerHTML = this.defaultHeader(this.screen);
        this.headerLeading = new BackButton("account");
        this.headerLeading.render(this);
        break;
    }
  }
  update(screen, fiat, { totalAsset, account }) {
    switch (screen) {
      case "accounts":
      case "settings":
        if (totalAsset !== this.totalAsset) {
          this.totalAsset = totalAsset;
          document.querySelector(".user-total-balance").textContent =
            totalAsset;
        } else if (fiat.symbol != this.fiat.symbol) {
          this.fiat = JSON.parse(JSON.stringify(fiat));
          document.querySelector(".currency-unit").textContent = fiat.symbol;
        }
        break;
      case "account":
        this.fiat = JSON.parse(JSON.stringify(fiat));
        this.account = JSON.parse(JSON.stringify(account));
        this.innerHTML = this.accountHeader(account, fiat);
        this.headerLeading = new BackButton("accounts");
        this.headerLeading.render(this);
        break;
    }
  }
}

customElements.define("header-widget", HeaderElement);

class Header {
  constructor(screen, fiat, { totalAsset, account }) {
    this.element = document.createElement("header-widget");
    this.element.screen = screen;
    this.element.totalAsset = totalAsset;
    this.element.fiat = JSON.parse(JSON.stringify(fiat));
    if (account) this.element.account = JSON.parse(JSON.stringify(account));
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("afterbegin", this.element);
  }
  update(screen, fiat, { totalAsset, account }) {
    this.element.update(screen, fiat, { totalAsset, account });
  }
}

export default Header;
