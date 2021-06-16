import header from "../layout/header";
import bottomNavigator from "../layout/bottom_navigator";
import accountList from "../widget/account_list";
import SettingList from "../widget/setting_list";

const overview = (scaffold, state) => {
  scaffold.header = header(state);
  scaffold.bottomNavigator = bottomNavigator(state);
  switch (state.screen) {
    case "accounts":
      scaffold.body = accountList(state);
      break;
    case "settings":
      const settingList = new SettingList(state);
      settingList.render(scaffold.body);
      break;
    default:
      scaffold.body = accountList(state);
      break;
  }
};

export default overview;
