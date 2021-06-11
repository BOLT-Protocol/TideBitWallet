import Scaffold from "../layout/scaffold";
import header from "../layout/header";
import bottomNavigator from "../layout/bottom_navigatior";
import accountsContainer from "../layout/account_list";

customElements.define("scaffold-widget", Scaffold);

const overview = (user, fiat) => {
  const scaffold = document.createElement("scaffold-widget");
  document.body.insertAdjacentElement("afterbegin", scaffold);
  scaffold.header = header(user.totalAsset, fiat.symbol);
  scaffold.bottomNavigator = bottomNavigator();
  scaffold.body = accountsContainer(user.accounts, fiat);
  // ============================================================
  // const scaffold = document.createElement("div");
  // scaffold.className = ".scaffold";
  // scaffold.insertAdjacentHTML(
  //   "afterbegin",
  //   header(user.totalAsset, wallet.currency)
  // );
  // scaffold.insertAdjacentHTML(bottomNavigator());
  // return scaffold;
};

export default overview;
