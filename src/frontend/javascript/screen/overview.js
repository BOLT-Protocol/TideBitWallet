import Scaffold from "../layout/scaffold";
import Header from "../layout/header";
import AssetList from "../layout/asset_list";
import SettingList from "../layout/setting_list";
import BottomNavigator from "../layout/bottom_navigator";
import SlidesContainer from "../layout/slider_container";
import { currentView } from "../utils/utils";

class Overview {
  constructor() {}
  initialize(screen, fiat, version, { totalAsset, assets } = {}) {
    this.header = new Header(screen, { fiat, totalAsset });
    this.assetList = new AssetList(assets, fiat);
    this.settingList = new SettingList(fiat, version);
    this.body = new SlidesContainer([this.assetList, this.settingList]);
    this.footer = new BottomNavigator(0);
    this.scaffold = new Scaffold(this.header, this.body, this.footer);
    this.scaffold.view = screen;
    this.settingList.parent = this.scaffold;
    this.screen = screen;
    if (!assets) {
      this.scaffold.openPopover("loading");
    }
  }
  render(screen, fiat, version, { totalAsset, assets } = {}) {
    const view = currentView();
    if (!view || (view !== "assets" && view !== "settings") || !this.scaffold) {
      this.initialize(screen, fiat, version, {
        totalAsset,
        assets,
      });
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
   * @param {List of Asset} assets
   * @param {Asset} asset
   * @param {totalAsset} String
   * @param {fiat} String
   */
  updateAssets(totalAsset, fiat, assets) {
    this.scaffold.closePopover();
    this.header.update(this.screen, { fiat, totalAsset });
    this.assetList.updateAssets(assets, fiat);
  }
  updateAsset(index, totalAsset, asset) {
    this.header.update(this.screen, { totalAsset });
    this.assetList.updateAsset(index, asset);
  }
  addNewAsset(totalAsset, asset) {
    this.header.update(this.screen, { totalAsset });
    this.assetList.addNewAsset(asset);
  }
}

const overview = new Overview();

export default overview;
