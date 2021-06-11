import AccountItem from "../widget/account_item";

customElements.define("account-item", AccountItem);

const accountsContainer = (accounts, fiat) => {
  const accountList = document.createElement("div");
  accountList.className = "account-list";
  accounts.forEach((account) => {
    const accountItem = document.createElement("account-item");
    accountItem.child = {
      account: account,
      fiat: fiat,
    };
    accountList.insertAdjacentElement("beforeend", accountItem);
  });
  return accountList;
};

export default accountsContainer;
