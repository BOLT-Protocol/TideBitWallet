import Scaffold from "../layout/scaffold";
import Header from "../layout/header";
import AssetList from "../layout/asset_list";
import SettingList from "../layout/setting_list";
import BottomNavigator from "../layout/bottom_navigator";
import SlidesContainer from "../layout/slider_container";
import { currentView } from "../utils/utils";

class Overview {
  constructor() {}
  refresh() {
    this.refreshButton = document.querySelector(".header__leading[refresh]");
    this.refreshButton.addEventListener("click", async (_) => {
      this.scaffold.openPopover("loading");
      try {
        console.log("sync");
        await this.wallet.sync();
        this.scaffold.closePopover();
      } catch (error) {
        console.log(error);
        this.scaffold.openPopover("error");
      }
    });
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
    this.header = new Header(screen, { fiat, totalAsset });
    this.assetList = new AssetList(assets, fiat);
    this.settingList = new SettingList(wallet, fiat, version);
    this.body = new SlidesContainer([this.assetList, this.settingList]);
    this.footer = new BottomNavigator(this.index);
    this.scaffold = new Scaffold(this.header, this.body, this.footer);
    this.scaffold.view = screen;
    this.settingList.parent = this.scaffold;
    this.wallet = wallet;
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
    this.refresh();
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
    this.refresh();
    this.assetList.updateAssets(assets, fiat);
    this.settingList.updateFiat(fiat);
  }
  updateAsset(index, totalAsset, asset) {
    this.header.update(this.screen, { totalAsset });
    this.refresh();
    this.assetList.updateAsset(index, asset);
  }
  addNewAsset(totalAsset, asset) {
    this.header.update(this.screen, { totalAsset });
    this.refresh();
    this.assetList.addNewAsset(asset);
  }
}

const overview = new Overview();

export default overview;
