// https://unicode-table.com/cn/2248/

const header = (parentElement, userBalance, currencyUint) => {
  const markup = `
  <header class="header header--overview">
    <div class="header__title">Total Asset</div>
    <div class="header__title-sub">
      <span class="almost-equal-to">&#8776;</span>
      <span class="user-total-balance">${userBalance}</span>
      <span class="currency-unit">${currencyUint}</span>
    </div>
  </header>;
  `;
  parentElement.insertAdjacentHTML("afterbegin", markup);
};

export default header;
