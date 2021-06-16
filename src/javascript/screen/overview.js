import scaffold from "../layout/scaffold";
import Header from "../layout/header";
import AccountList from "../layout/account_list";
import SettingList from "../layout/setting_list";
import bottomNavigator from "../layout/bottom_navigator";

const overview = (scaffold, state) => {
  scaffold.bottomNavigator = bottomNavigator(state);
  const header = new Header(state);
  const accountList = new AccountList(state);
  const settingList = new SettingList(state);

  switch (state.screen) {
    case "accounts":
      header.render(scaffold.header);
      accountList.render(scaffold.body);
      break;
    case "settings":
      header.render(scaffold.header);
      settingList.render(scaffold.body);
      break;
    default:
      header.render(scaffold.header);
      accountList.render(scaffold.body);
      break;
  }
};

export default overview;
