import Scaffold from "../layout/scaffold";
import Header from "../layout/header";
import AssetList from "../layout/asset_list";
import SettingList from "../layout/setting_list";
import BottomNavigator from "../layout/bottom_navigator";
import SlidesContainer from "../layout/slider_container";
import { currentView } from "../utils/utils";

class Overview {
  constructor() {}
  async refresh(scaffold, wallet) {
    scaffold.openPopover("loading");
    try {
      console.trace("Overview sync");
      await wallet.sync();
      scaffold.closePopover();
    } catch (error) {
      console.log(error);
      scaffold.openPopover("error");
    }
  }
  getIndex(screen) {
    this.screen = screen;
    switch (this.screen) {
      case "assets":
        this.index = 0;
        break;
      case "settings":
        this.index = 1;
        break;
      default:
        this.index = 0;
        break;
    }
  }
  initialize(screen, wallet, fiat, version, { totalAsset, assets } = {}) {
    this.wallet = wallet;
    this.header = new Header(screen, {
      fiat,
      totalAsset,
      callback: async () => await this.refresh(this.scaffold, this.wallet),
    });
    this.assetList = new AssetList(assets, fiat);
    this.settingList = new SettingList(wallet, fiat, version);
    this.body = new SlidesContainer([this.assetList, this.settingList]);
    this.footer = new BottomNavigator(this.index);
    this.scaffold = new Scaffold(this.header, this.body, this.footer);
    this.scaffold.view = screen;
    this.settingList.parent = this.scaffold;
    if (!assets) {
      this.scaffold.openPopover("loading");
    }
  }
  render(screen, wallet, fiat, version, { totalAsset, assets } = {}) {
    const view = currentView();
    this.getIndex(screen);
    if (!view || (view !== "assets" && view !== "settings") || !this.scaffold) {
      this.initialize(screen, wallet, fiat, version, { totalAsset, assets });
    }
    this.body.focus = this.index;
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
    this.settingList.updateFiat(fiat);
  }
  updateAsset(index, totalAsset, fiat, asset) {
    this.scaffold.closePopover();
    this.header.update(this.screen, { fiat, totalAsset });
    this.assetList.updateAsset(index, asset);
  }
  addNewAsset(totalAsset, fiat, asset) {
    this.scaffold.closePopover();
    this.header.update(this.screen, { fiat, totalAsset });
    this.assetList.addNewAsset(asset);
  }
}

const overview = new Overview();

export default overview;
