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
    this.innerHTML = `<i class="fas fa-arrow-left">`;
    this.addEventListener("click", (e) => route(this.state));
  }
  disconnectedCallback() {
    this.removeEventListener("click", (e) => route(this.state));
  }
  set icon(iconHTML) {
    this.innerHTML = iconHTML;
  }
  set onClick(state) {
    this.state = JSON.parse(JSON.stringify(state));
  }
}

customElements.define("back-button", BackButtonElement);

class BackButton {
  constructor(state) {
    this.element = document.createElement("back-button");
    this.element.state = JSON.parse(JSON.stringify(state));
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("afterbegin", this.element);
  }
}

class HeaderElement extends HTMLElement {
  constructor() {
    super();
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
        this.innerHTML = accountHeader(this.state);
        this.insertAdjacentElement("afterbegin", new BackButton(this.state));
        break;
      default:
        this.classList = ["header header--default"];
        this.innerHTML = defaultHeader(state);
        this.insertAdjacentElement("afterbegin", new BackButton(this.state));
        break;
    }
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
    const backButton = document.createElement("back-button");
    const _state = JSON.parse(JSON.stringify(state));
    _state.screen = "accounts";
    backButton.onClick = _state;
    return [markup, backButton];
  };
  defaultHeader = (state) => {
    const { leadingHTML, screenTitle, actionHTML } = getHeaderInfo(
      state.screen
    );
    const _state = JSON.parse(JSON.stringify(state));
    _state.screen = "account";
    const markup = `
        <div class="header__title">${screenTitle}</div>
        <div class="header__action ${actionHTML ? "" : "disabled"}">${
      actionHTML ? actionHTML : '<i class="fas fa-ellipsis-h"></i>'
    }</div>
    `;
    const backButton = document.createElement("back-button");
    if (leadingHTML) backButton.icon = leadingHTML;
    backButton.onClick = _state;
    return [markup, backButton];
  };
}

customElements.define("header-widget", HeaderElement);

class Header {
  constructor(state) {
    this.element = document.createElement("header-widget");
    this.element.state = JSON.parse(JSON.stringify(state));
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("afterbegin", this.element);
  }
}

export default Header;
