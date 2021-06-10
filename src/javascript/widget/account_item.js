const _account = {
  name: "Bitcoin",
  symbol: "BTC",
  network: "mainnet",
  decimals: 8,
  pulish: true,
  image: "https://www.tidebit.one/icons/btc.png",
  balance: 0,
  toCurrency: 0,
};
const _wallet = {
  currency: "USD",
};
const accountItem = (account, wallet) => {
  const markup = `
    <div class="account-item ${_account.pulish ? "publish" : ""}"}>
        <div class="account-item__icon">
            <img src=${_account.image} alt="BTC">
        </div>
        <div class="account-item__symbol">${_account.symbol.toUpperCase()}</div>
        <div class="account-item__balance">${_account.balance}</div>
        <div class="account-item__to-currency">
            <span class="almost-equal-to">&#8776;</span>
            <span class="balance">${_account.balance}</span>
            <span class="currency-unit">${_wallet.currency}</span>
        </div>
    </div>
    `;
  return markup;
};
