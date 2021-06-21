// https://unicode-table.com/cn/2248/
import route from "../utils/route";

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
    this.addEventListener("click", (e) => route(this.state));
  }
  disconnectedCallback() {
    this.removeEventListener("click", (e) => route(this.state));
  }
}

customElements.define("back-button", BackButtonElement);

class BackButton {
  constructor(state, screen, icon) {
    this.element = document.createElement("back-button");
    this.element.icon = icon;
    this.element.state = JSON.parse(JSON.stringify(state));
    this.element.state.screen = screen;
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("afterbegin", this.element);
  }
}

class HeaderElement extends HTMLElement {
  constructor() {
    super();
  }
  overviewHeader = (totalAsset, fiatSymbol) => {
    const markup = `
      <div class="header__title">Total Asset</div>
      <div class="header__title-sub">
        <span class="almost-equal-to">&#8776;</span>
        <span class="user-total-balance">${totalAsset}</span>
        <span class="currency-unit">${fiatSymbol}</span>
      </div>
    `;
    return markup;
  };
  accountHeader = (state) => {
    const account = state.account;
    const fiat = state.walletConfig.fiat;
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
  defaultHeader = (state) => {
    const { screenTitle, actionHTML } = getHeaderInfo(state.screen);
    const _state = JSON.parse(JSON.stringify(state));
    _state.screen = "account";
    const markup = `
        <div class="header__title">${screenTitle}</div>
        <div class="header__action ${actionHTML ? "" : "disabled"}">${
      actionHTML ? actionHTML : '<i class="fas fa-ellipsis-h"></i>'
    }</div>
    `;
    return markup;
  };
  updateHeader(state) {
    switch (state.screen) {
      case "accounts":
      case "overviews":
        if (state.totalAsset !== this.state.totalAsset) {
          document.querySelector(".user-total-balance").textContent =
            state.totalAsset;
          this.state = JSON.parse(JSON.stringify(state));
        } else if (
          state.walletConfig.fiat.symbol != this.state.walletConfig.fiat.symbol
        ) {
          document.querySelector(".currency-unit").textContent =
            state.walletConfig.fiat.symbol;
          this.state = JSON.parse(JSON.stringify(state));
        }
        break;
      case "account":
        this.innerHTML = this.accountHeader(this.state);
        this.headerLeading = new BackButton(this.state, "accounts");
        this.headerLeading.render(this);
        break;
    }
  }
  connectedCallback() {
    switch (this.state.screen) {
      case "accounts":
      case "settings":
        this.classList = ["header header--overview"];
        this.innerHTML = this.overviewHeader(
          this.state.user.totalAsset,
          this.state.walletConfig.fiat.symbol
        );
        break;
      case "account":
        this.classList = ["header header--account"];
        this.innerHTML = this.accountHeader(this.state);
        this.headerLeading = new BackButton(this.state, "accounts");
        this.headerLeading.render(this);
        break;
      default:
        this.classList = ["header header--default"];
        this.innerHTML = this.defaultHeader(this.state);
        this.headerLeading = new BackButton(this.state, "account");
        this.headerLeading.render(this);
        break;
    }
  }
}

customElements.define("header-widget", HeaderElement);

class Header {
  constructor(state) {
    this.element = document.createElement("header-widget");
    this.element.state = JSON.parse(JSON.stringify(state));
  }
  updateState(state) {
    this.element.updateHeader(state);
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("afterbegin", this.element);
  }
}

export default Header;
