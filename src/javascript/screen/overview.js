import header from "../layout/header";
import bottomNavigator from "../layout/bottom_navigator";
import accountList from "../widget/account_list";

const overview = (scaffold, state) => {
  scaffold.header = header(state);
  scaffold.bottomNavigator = bottomNavigator(state);
  switch (state.screen) {
    case "accounts":
      scaffold.body = accountList(state);
      break;
    case "settings":
      const container = document.createElement("div");
      container.innerHTML = `<div>This is Setting page</div>`;
      scaffold.body = container;
      break;
    default:
      scaffold.body = accountList(state);
      break;
  }
};

export default overview;
