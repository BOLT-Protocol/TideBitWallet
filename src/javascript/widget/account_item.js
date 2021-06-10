
export default accountItem = (account, wallet) => {
  const markup = `
    <div class="account-item ${account.pulish ? "publish" : ""}"}>
        <div class="account-item__icon">
            <img src=${account.image} alt="BTC">
        </div>
        <div class="account-item__symbol">${account.symbol.toUpperCase()}</div>
        <div class="account-item__balance">${account.balance}</div>
        <div class="account-item__to-currency">
            <span class="almost-equal-to">&#8776;</span>
            <span class="balance">${account.balance}</span>
            <span class="currency-unit">${wallet.currency}</span>
        </div>
    </div>
    `;
  return markup;
};

class AccountItem extends HTMLElement{}