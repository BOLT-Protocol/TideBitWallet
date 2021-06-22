import Scaffold from "../layout/scaffold";
import Header from "../layout/header";
import AccountList from "../layout/account_list";
import SettingList from "../layout/setting_list";
import BottomNavigator from "../layout/bottom_navigator";
import SlidesContainer from "../layout/slider_container";
import { currentView } from "../utils/utils";

class Overview {
  /**
   * total assets
   * current currency
   * assets list
   * page index
   */
  constructor() {}

  initialize(screen, totalAsset, accounts, fiat, version) {
    this.accounts = JSON.parse(JSON.stringify(accounts));
    this.header = new Header(screen, fiat, { totalAsset });
    this.accountList = new AccountList(accounts, fiat);
    this.settingList = new SettingList(fiat, version);
    this.body = new SlidesContainer([this.accountList, this.settingList]);
    this.footer = new BottomNavigator(this.state, 0);
    this.scaffold = new Scaffold(this.header, this.body, this.footer);
    this.scaffold.element.view = screen;
    this.screen = screen;
  }
  render(screen, totalAsset, accounts, fiat, version) {
    const view = currentView();
    if (
      !view ||
      (view !== "accounts" && view !== "settings") ||
      !this.scaffold
    ) {
      initialize(screen, totalAsset, accounts, fiat, version);
    } else {
      this.screen = screen;
      switch (this.screen) {
        case "accounts":
          this.body.focus = 0;
          break;
        case "settings":
          this.body.focus = 1;
          break;
      }
    }
  }
  /**
   *
   * @param {OnUpdateCurrency, {accounts, fiat, totalAsset}} event
   * @param {OnUpdateAccount {account, fiat, totalAsset}} data
   */
  update(event, totalAsset, fiat, { accounts, account }) {
    if (event === "OnUpdateAccount") {
      this.header.update(this.screen, fiat, { totalAsset, account });
      this.accountList.updateAccount(account, fiat);
    } else if (event === "OnUpdateCurrency") {
      this.header.update(this.screen, fiat, { totalAsset });
      this.accountList.update(accounts, fiat);
    }
  }
}

const overview = new Overview();

export default overview;
