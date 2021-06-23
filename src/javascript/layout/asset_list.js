import AssetItem from "../widget/asset_item";

class AssetListElement extends HTMLElement {
  constructor() {
    super();
  }
  update() {
    this.replaceChildren();
    if (this.assets) {
      this.className = "asset-list";
      this.assets.forEach((asset) => asset.render(this));
    } else {
      this.innerHTML = `
      <div class="loading__text">Loading...</div>
      `;
    }
  }
  connectedCallback() {
    this.update();
  }
}

customElements.define("asset-list", AssetListElement);

class AssetList {
  constructor(assets, fiat) {
    this.element = document.createElement("asset-list");
    this.fiat = fiat;
    if (assets) {
      this.assets = assets;
      this.element.assets = this.assets.map((asset) => this.assetItem(asset));
    }
  }
  assetItem = (asset) => new AssetItem(asset, this.fiat);
  updateAssets(assets, fiat) {
    this.assets = assets;
    this.fiat = fiat;
    this.element.assets = this.assets.map((asset) => this.assetItem(asset));
    this.element.update();
  }
  updateAsset(asset) {
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
