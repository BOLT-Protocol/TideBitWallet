// https://unicode-table.com/cn/2248/
import route from "../utils/route";
class BackButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", () => {
      if (this.state.screen) {
        route(this.state);
      }
    });
  }
  connectedCallback() {
    this.className = "header__leading";
    this.innerHTML = `<i class="fas fa-arrow-left">`;
  }
  set icon(iconHTML) {
    this.innerHTML = iconHTML;
  }
  set onClick(state){
    this.state = JSON.parse(JSON.stringify(state));
  }
 
}
customElements.define("back-button", BackButton);

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

const overviewHeader = (totalAsset, fiatSymbol) => {
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

const accountHeader = (state) => {
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
const defaultHeader = (state) => {
  const { leadingHTML, screenTitle, actionHTML } = getHeaderInfo(state.screen);
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

const header = (state) => {
  const header = document.createElement("header");
  let markup, backButton;
  switch (state.screen) {
    case "accounts":
    case "settings":
      header.classList = ["header header--overview"];
      markup = overviewHeader(
        state.user.totalAsset,
        state.walletConfig.fiat.symbol
      );
      break;
    case "account":
      header.classList = ["header header--account"];
      // markup = accountHeader(state.account, state.walletConfig.fiat);
      [markup, backButton] = accountHeader(state);
      header.insertAdjacentElement("afterbegin", backButton);
      break;
    default:
      header.classList = ["header header--default"];
      [markup, backButton] = defaultHeader(state);
      header.insertAdjacentElement("afterbegin", backButton);
  }
  header.insertAdjacentHTML("beforeend", markup);
  return header;
};

export default header;
