import viewController from "../controller/view";
class AssetItemElement extends HTMLElement {
  constructor() {
    super(); // always call super() first in the constructor.
  }
  set id(val) {
    this.setAttribute("id", val);
  }
  update() {
    if (this === undefined || this === null) return;
    this.innerHTML = `
    <div class="asset-item__icon"></div>
    <div class="asset-item__symbol"></div>
    <div class="asset-item__balance"></div>
    <div class="asset-item__to-currency">
        <span class="almost-equal-to">&#8776;</span>
        <span class="balance"></span>
        <span class="currency-unit"></span>
    </div>
    `;
    this.publish = this.asset.publish;
    this.children[0].insertAdjacentHTML(
      "afterbegin",
      `<img src=${this.asset.image} alt=${this.asset.symbol.toUpperCase()}>`
    );
    this.children[1].textContent = this.asset.symbol.toUpperCase();
    this.children[2].textContent = this.asset.balance;
    this.children[3].children[1].textContent = this.asset.inFiat;
    this.children[3].children[2].textContent = this.fiat;
  }
  connectedCallback() {
    this.className = "asset-item";
    this.id = this.asset.id;
    this.update();
    this.addEventListener("click", (_) =>
      viewController.route("asset", this.asset)
    );
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
    this.asset = asset;
    this.fiat = fiat;
    this.element =
      document.querySelector(`asset-item[id="${this.asset.id}"]`) ||
      document.createElement("asset-item");
    this.element.asset = asset;
    this.element.fiat = fiat;
  }
  update() {
    this.element.update();
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default AssetItem;
