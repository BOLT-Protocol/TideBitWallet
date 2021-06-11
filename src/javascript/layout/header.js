// https://unicode-table.com/cn/2248/
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
const accountHeader = (account, fiat) => {
  const markup = `
  <div class="header__leading"><i class="fas fa-arrow-left"></i></div>
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
const defaultHeader = (screen) => {
  const { leadingHTML, screenTitle, actionHTML } = getHeaderInfo(screen);
  const markup = `
      <div class="header__leading">${
        leadingHTML ? leadingHTML : '<i class="fas fa-arrow-left"></i>'
      }</div>
      <div class="header__title">${screenTitle}</div>
      <div class="header__action ${actionHTML ? "" : "disabled"}">${
    actionHTML ? actionHTML : '<i class="fas fa-ellipsis-h"></i>'
  }</div>
  `;
  return markup;
};

const header = (state) => {
  const header = document.createElement("header");
  let markup;
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
      markup = accountHeader(state.account, state.walletConfig.fiat.symbol);
      break;
    default:
      header.classList = ["header header--default"];
      markup = defaultHeader(state.screen);
  }

  header.insertAdjacentHTML("afterbegin", markup);
  return header;
};

export default header;
