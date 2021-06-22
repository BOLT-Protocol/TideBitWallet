import viewController from "../controller/view";
class AssetItemElement extends HTMLElement {
  constructor() {
    super(); // always call super() first in the constructor.
  }
  set id(val) {
    this.setAttribute("id", val);
  }
  static update(element, asset, fiat) {
    if (element === undefined || element === null) return;
    element.innerHTML = `
    <div class="asset-item__icon"></div>
    <div class="asset-item__symbol"></div>
    <div class="asset-item__balance"></div>
    <div class="asset-item__to-currency">
        <span class="almost-equal-to">&#8776;</span>
        <span class="balance"></span>
        <span class="currency-unit"></span>
    </div>
    `;
    element.publish = asset.publish;
    element.children[0].insertAdjacentHTML(
      "afterbegin",
      `<img src=${asset.image} alt=${asset.symbol.toUpperCase()}>`
    );
    element.children[1].textContent = asset.symbol.toUpperCase();
    element.children[2].textContent = asset.balance;
    element.children[3].children[1].textContent = asset.inFiat;
    element.children[3].children[2].textContent = fiat;
    element.addEventListener("click", (_) =>
      viewController.route("asset", asset)
    );
  }
  connectedCallback() {
    this.className = "asset-item";
    this.id = this.asset.id;
    AssetItemElement.update(this, this.asset, this.fiat);
  }
  disconnectedCallback() {
    this.removeEventListener("click", (_) =>
      viewController.route("asset", asset)
    );
  }
  get publish() {
    return this.hasAttribute("publish");
  }
  set publish(val) {
    if (val) {
      this.setAttribute("publish", "");
    } else {
      this.removeAttribute("publish");
    }
  }
}

customElements.define("asset-item", AssetItemElement);
class AssetItem {
  constructor(asset, fiat) {
    this.id = asset.id;
    this.element = document.createElement("asset-item");
    this.element.asset = asset;
    this.element.fiat = fiat;
  }
  update(asset, fiat) {
    const element = document.querySelector(`[id=${this.id}]`);
    AssetItemElement.update(element, asset, fiat);
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default AssetItem;
