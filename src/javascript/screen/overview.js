import header from "../layout/header";
import bottomNavigator from "../layout/bottom_navigator";
import accountsContainer from "../layout/account_list";

const overview = (scaffold, state) => {
  scaffold.header = header(state.user.totalAsset, state.walletConfig.fiat.symbol);
  scaffold.bottomNavigator = bottomNavigator(state);
  switch (state.screen) {
    case "accounts":
      scaffold.body = accountsContainer(state.user.accounts, state.walletConfig.fiat);
      break;
    case "settings":
      const container = document.createElement("div");
      container.innerHTML = `<div>This is Setting page</div>`;
      scaffold.body = container;
      break;
    default:
      scaffold.body = accountsContainer(state.user.accounts, state.walletConfig.fiat);
      break;
  }
};

export default overview;
