// https://unicode-table.com/cn/2248/

const header = (userBalance, currencyUint) => {
  const header = document.createElement("header");
  header.classList=['header header--overview'];
  const markup = `
    <div class="header__title">Total Asset</div>
    <div class="header__title-sub">
      <span class="almost-equal-to">&#8776;</span>
      <span class="user-total-balance">${userBalance}</span>
      <span class="currency-unit">${currencyUint}</span>
    </div>
  `;
  header.insertAdjacentHTML('afterbegin', markup);
  return header;
};

export default header;
