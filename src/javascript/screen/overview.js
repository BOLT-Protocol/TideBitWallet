import Scaffold from "../layout/scaffold";
import Header from "../layout/header";
import AccountList from "../layout/account_list";
import SettingList from "../layout/setting_list";
import BottomNavigator from "../layout/bottom_navigator";
import SlidesContainer from "../layout/slider_container";

class Overview {
  /**
   * total assets
   * current currency
   * assets list
   * page index
   */
  constructor() {}
  initialize(state) {
    this.state = JSON.parse(JSON.stringify(state));
    this.header = new Header(this.state);
    this.accountList = new AccountList(this.state);
    this.body = new SlidesContainer([
      this.accountList,
      new SettingList(this.state),
    ]);
    this.footer = new BottomNavigator(this.state, 0);
    this.scaffold = new Scaffold(this.header, this.body, this.footer);
    this.scaffold.element.view = state.screen;
  }
  render(state) {
    const scaffold = document.querySelector("scaffold-widget");
    const view = scaffold?.attributes?.view?.value;
    if (
      !scaffold ||
      (view !== "accounts" && view !== "settings") ||
      !this.scaffold
    ) {
      this.initialize(state);
    } else {
      switch (state.screen) {
        case "accounts":
          this.body.focus = 0;
          break;
        case "settings":
          this.body.focus = 1;
          break;
      }
    }
  }
  //
  // OnUpdateCurrency ,
  // OnUpdateAccount
  update(event, data) {
    if (event === "OnUpdateAccount") {
      this.accountList.updateAccount(data);
    } else if (event === "OnUpdateCurrency") {
      this.accountList.update(data);
    }
  }
}

const overview = new Overview();

export default overview;
