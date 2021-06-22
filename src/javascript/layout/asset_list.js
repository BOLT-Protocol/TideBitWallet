import AssetItem from "../widget/asset_item";

class AssetListElement extends HTMLElement {
  constructor() {
    super();
  }
  update() {
    this.replaceChildren();
    this.assets.forEach((asset) => asset.render(this));
  }
  connectedCallback() {
    this.className = "asset-list";
    this.update();
  }
}

customElements.define("asset-list", AssetListElement);

class AssetList {
  constructor(assets, fiat) {
    this.updateAssets(assets);
    this.updateFiat(fiat);
    this.element = document.createElement("asset-list");
    this.element.assets = this.assets.map((asset) => this.assetItem(asset));
  }
  assetItem = (asset) => new AssetItem(asset, this.fiat);
  updateAssets(assets) {
    this.assets = JSON.parse(JSON.stringify(assets));
  }
  updateFiat(fiat) {
    this.fiat = JSON.parse(JSON.stringify(fiat));
  }
  update(assets, fiat) {
    this.updateAssets(assets);
    this.updateFiat(fiat);
    this.element.assets = this.assets.map((asset) => this.assetItem(asset));
    this.element.update();
  }
  updateAsset(asset, fiat) {
    updateFiat(fiat);
    const index = this.assets.findIndex((ass) => ass.id === asset.id);
    if (index > -1) {
      this.element.assets[index] = this.assetItem(asset);
      this.element.assets[index].update();
    } else {
      this.assets.push(asset);
      this.element.assets.push(this.assetItem(asset));
      this.element.assets[this.element.assets.length - 1].render(this.element);
    }
    if (document.querySelector("asset-list")) {
      this.element.update();
    }
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default AssetList;
