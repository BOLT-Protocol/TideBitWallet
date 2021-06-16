import header from "../layout/header";
import bottomNavigator from "../layout/bottom_navigator";
import AccountList from "../widget/account_list";
import SettingList from "../widget/setting_list";

const overview = (scaffold, state) => {
  scaffold.header = header(state);
  scaffold.bottomNavigator = bottomNavigator(state);
  const accountList = new AccountList(state);
  const settingList = new SettingList(state);
  switch (state.screen) {
    case "accounts":
      accountList.render(scaffold.body);
      break;
    case "settings":
      settingList.render(scaffold.body);
      break;
    default:
      accountList.render(scaffold.body);
      break;
  }
};

export default overview;
