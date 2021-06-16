import scaffold from "../layout/scaffold";
import Header from "../layout/header";
import AccountList from "../layout/account_list";
import SettingList from "../layout/setting_list";
import BottomNavigator from "../layout/bottom_navigator";

const overview = (scaffold, state) => {
  const header = new Header(state);
  const bottomNavigator = new BottomNavigator(state);
  const accountList = new AccountList(state);
  const settingList = new SettingList(state);
  header.render(scaffold.header);

  switch (state.screen) {
    case "accounts":
      accountList.render(scaffold.body);
      bottomNavigator.render(scaffold.footer, 0);
      break;
    case "settings":
      settingList.render(scaffold.body);
      bottomNavigator.render(scaffold.footer, 1);
      break;
    default:
      accountList.render(scaffold.body);
      break;
  }
};

export default overview;
