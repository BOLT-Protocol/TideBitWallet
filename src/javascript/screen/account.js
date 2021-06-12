import header from "../layout/header";
import tabNavigator from "../layout/tab_bar_navigator";

const account = (scaffold, state) => {
  console.log(JSON.stringify(state));
  scaffold.header = header(state);
  scaffold.body = [tabNavigator(state)];
};

export default account;
