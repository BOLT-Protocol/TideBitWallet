import Scaffold from "../layout/scaffold";
import Header from "../layout/header";
import AssetList from "../layout/asset_list";
import SettingList from "../layout/setting_list";
import BottomNavigator from "../layout/bottom_navigator";
import SlidesContainer from "../layout/slider_container";
import { currentView } from "../utils/utils";

class Overview {
  constructor() {}
  initialize(screen, totalAsset, assets, fiat, version) {
    this.assets = JSON.parse(JSON.stringify(assets));
    this.header = new Header(screen, { fiat, totalAsset });
    this.assetList = new AssetList(assets, fiat);
    this.settingList = new SettingList(fiat, version);
    this.body = new SlidesContainer([this.assetList, this.settingList]);
    this.footer = new BottomNavigator(0);
    this.scaffold = new Scaffold(this.header, this.body, this.footer);
    this.scaffold.element.view = screen;
    this.screen = screen;
  }
  render(screen, totalAsset, assets, fiat, version) {
    const view = currentView();
    if (!view || (view !== "assets" && view !== "settings") || !this.scaffold) {
      this.initialize(screen, totalAsset, assets, fiat, version);
    } else {
      this.screen = screen;
      switch (this.screen) {
        case "assets":
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
   * @param {OnUpdateCurrency, {assets, fiat, totalAsset}} event
   * @param {OnUpdateAccount {asset, fiat, totalAsset}} data
   */
  update(event, totalAsset, fiat, { assets, asset } = {}) {
    if (event === "OnUpdateAccount") {
      this.header.update(this.screen, { fiat, totalAsset, asset });
      this.assetList.updateAsset(asset, fiat);
    } else if (event === "OnUpdateCurrency") {
      this.header.update(this.screen, { fiat, totalAsset });
      this.assetList.update(assets, fiat);
    }
  }
}

const overview = new Overview();

export default overview;
