import viewController from "../controller/view";
import Header from "../layout/header";
import Scaffold from "../layout/scaffold";
import SettingFiatList from "../layout/setting_fiat_list";

class SettingFiat {
  constructor() {}
  updateFiat(scaffold, fiat, wallet) {
    // -- test
    scaffold.openPopover("loading");
    console.log(fiat);
    scaffold.closePopover();
    viewController.route("settings", fiat);
    // -- test

    // ++
    // scaffold.openPopover("loading");
    // wallet
    //   .changeSelectedFiat(fiat)
    //   .then((_) => {
    //     scaffold.closePopover();
    //     viewController.route("settings", fiat);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //     this.scaffold.openPopover("error");
    //   });
  }
  render(screen, wallet, selectedfiat) {
    this.header = new Header(screen);
    this.settingFiatList = new SettingFiatList();
    this.scaffold = new Scaffold(this.header, this.settingFiatList);
    // -- test
    this.settingFiatList.update(
      ["CNY", "USD", "EUR", "JPY", "HKD", "TWD"],
      selectedfiat,
      (fiat) => this.updateFiat(this.scaffold, fiat, wallet)
    );
    // -- test

    // ++
    // this.scaffold.openPopover("loading");
    // wallet
    //   .getFiatList()
    //   .then((fiatList) => {
    //     this.scaffold.closePopover();
    //     this.settingFiatList.update(fiatList, selectedfiat);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //     this.scaffold.openPopover("error");
    //   });
  }
}

const SettingFiatScreen = new SettingFiat();

export default SettingFiatScreen;
