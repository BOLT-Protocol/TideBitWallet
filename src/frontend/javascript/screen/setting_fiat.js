import viewController from "../controller/view";
import Header from "../layout/header";
import Scaffold from "../layout/scaffold";
import SettingFiatList from "../layout/setting_fiat_list";
import { getUserInfo } from "../utils/utils";

class SettingFiat {
  constructor() {}
  updateFiat(scaffold, fiat, wallet) {
    scaffold.openPopover("loading");
    wallet
      .changeSelectedFiat(fiat)
      .then((_) => {
        getUserInfo(wallet)
          .then((_) => {
            scaffold.closePopover();
            viewController.route("settings", fiat);
          })
          .catch((e) => {
            console.log(e);
            this.scaffold.openPopover("error");
          });
      })
      .catch((e) => {
        console.log(e);
        this.scaffold.openPopover("error");
      });
  }
  render(screen, wallet, selectedfiat) {
    this.header = new Header(screen);
    this.settingFiatList = new SettingFiatList();
    this.scaffold = new Scaffold(this.header, this.settingFiatList);

    this.scaffold.openPopover("loading");
    wallet
      .getFiatList()
      .then((fiatList) => {
        this.scaffold.closePopover();
        this.settingFiatList.update(
          fiatList,
          selectedfiat,
          (fiat) => this.updateFiat(this.scaffold, fiat, wallet)
        );
      })
      .catch((e) => {
        console.log(e);
        this.scaffold.openPopover("error");
      });
  }
}

const SettingFiatScreen = new SettingFiat();

export default SettingFiatScreen;
