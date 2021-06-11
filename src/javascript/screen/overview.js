import Scaffold from "../layout/scaffold";
import header from "../layout/header";
import bottomNavigator from "../layout/bottom_navigatior";
import accountsContainer from "../layout/account_list";

customElements.define("scaffold-widget", Scaffold);

const overview = (user, fiat, screen) => {
  const scaffold = document.createElement("scaffold-widget");
  document.body.insertAdjacentElement("afterbegin", scaffold);
  scaffold.header = header(user.totalAsset, fiat.symbol);
  scaffold.bottomNavigator = bottomNavigator(screen);
  switch (screen) {
    case "accounts":
      scaffold.body = accountsContainer(user.accounts, fiat);
      break;
    case "settings":
      break;
    default:
      scaffold.body = accountsContainer(user.accounts, fiat);
      break;
  }
};

export default overview;
