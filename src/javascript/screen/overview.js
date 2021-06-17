import Scaffold from "../layout/scaffold";
import Header from "../layout/header";
import AccountList from "../layout/account_list";
import SettingList from "../layout/setting_list";
import BottomNavigator from "../layout/bottom_navigator";

const overview = (state) => {
  const header = new Header(state);
  const bottomNavigator = new BottomNavigator(state);
  switch (state.screen) {
    case "accounts":
      bottomNavigator.focus = 0;
      const accountList = new AccountList(state);
      new Scaffold(header, accountList, bottomNavigator);
      break;
    case "settings":
      bottomNavigator.focus = 1;
      const settingList = new SettingList(state);
      new Scaffold(header, settingList, bottomNavigator);
      break;
    default:
      break;
  }
};

export default overview;
