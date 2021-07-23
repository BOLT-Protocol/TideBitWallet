// https://unicode-table.com/cn/2248/

import viewController from "../controller/view";
import { formateDecimal } from "../utils/utils";

const getHeaderInfo = (screen) => {
  switch (screen) {
    case "transaction":
      return { screenTitle: "Send Coin" };
    case "bill":
      return { screenTitle: "Transaction Detail" };
    case "address":
      return { screenTitle: "My Wallet" };
    case "mnemonic":
      return { screenTitle: "" };
    case "setting-fiat":
      return { screenTitle: "Fiat" };
  }
};

class BackButtonElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "header__leading";
    if (this.icon) {
      this.innerHTML = `<i class="fas fa-${icon}">`;
    } else {
      this.innerHTML = `<i class="fas fa-arrow-left">`;
    }
    this.addEventListener("click", (_) => viewController.route(this.screen));
  }
  disconnectedCallback() {
    this.removeEventListener("click", (_) => viewController.route(this.screen));
  }
}

customElements.define("back-button", BackButtonElement);

class BackButton {
  constructor(screen, icon) {
    this.element = document.createElement("back-button");
    this.element.screen = screen;
    this.element.icon = icon;
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("afterbegin", this.element);
  }
}

class HeaderElement extends HTMLElement {
  constructor() {
    super();
  }
  overviewHeader = (totalAsset, fiat) => {
    const markup = `
      <div class="header__title">Total Asset</div>
      <div class="header__title-sub">
        <span class="almost-equal-to">&#8776;</span>
        <span class="user-total-balance">${
          totalAsset ? formateDecimal(totalAsset, 18) : "Loading..."
        }</span>
        <span class="currency-unit">${totalAsset ? fiat : ""}</span>
      </div>
    `;
    return markup;
  };
  assetHeader = (asset, fiat) => {
    const markup = `
    <div class="header__icon">
      <img src=${asset.image}  alt=${asset.symbol.toUpperCase()}>
    </div>
    <div class="header__icon-title">${asset.symbol.toUpperCase()}</div>
    <div class="header__title">${formateDecimal(asset.balance, 18)}</div>
    <div class="header__title-sub">
      <span class="almost-equal-to">&#8776;</span>
      <span class="balance">${asset.inFiat}</span>
      <span class="currency-unit">${fiat}</span>
    </div>
    `;
    return markup;
  };
  defaultHeader = (screen) => {
    const { screenTitle, actionHTML } = getHeaderInfo(screen);
    const markup = `
        <div class="header__title">${screenTitle}</div>
        <div class="header__action ${actionHTML ? "" : "disabled"}">${
      actionHTML ? actionHTML : '<i class="fas fa-ellipsis-h"></i>'
    }</div>
    `;
    return markup;
  };
  connectedCallback() {
    switch (this.screen) {
      case "assets":
      case "settings":
        this.classList = ["header header--overview"];
        this.innerHTML = this.overviewHeader(this.totalAsset, this.fiat);
        break;
      case "asset":
        this.classList = ["header header--asset"];
        this.innerHTML = this.assetHeader(this.asset, this.fiat);
        this.headerLeading = new BackButton("assets");
        this.headerLeading.render(this);
        break;

      default:
        this.classList = ["header header--default"];
        this.innerHTML = this.defaultHeader(this.screen);
        this.headerLeading =
          this.screen === "mnemonic"
            ? new BackButton("landing")
            : this.screen === "setting-fiat"
            ? new BackButton("settings")
            : new BackButton("asset");
        this.headerLeading.render(this);
        break;
    }
  }
  update(screen, { fiat, totalAsset, asset } = {}) {
    switch (screen) {
      case "assets":
      case "settings":
        if (totalAsset !== this.totalAsset) {
          this.totalAsset = totalAsset;
          document.querySelector(".user-total-balance").textContent =
            totalAsset;
        }
        if (!this.fiat || (fiat && this.fiat !== fiat)) {
          this.fiat = fiat;
        }
        document.querySelector(".currency-unit").textContent = this.fiat;
        break;
      case "asset":
        if (!this.fiat || (fiat && this.fiat !== fiat)) {
          this.fiat = fiat;
        }
        this.asset = JSON.parse(JSON.stringify(asset));
        this.innerHTML = this.assetHeader(asset, this.fiat);
        this.headerLeading = new BackButton("assets");
        this.headerLeading.render(this);
        break;
    }
  }
}

customElements.define("header-widget", HeaderElement);

class Header {
  constructor(screen, { fiat, totalAsset, asset } = {}) {
    this.element = document.createElement("header-widget");
    this.element.screen = screen;
    if (totalAsset) this.element.totalAsset = totalAsset;
    if (fiat) this.element.fiat = fiat;
    if (asset) this.element.asset = JSON.parse(JSON.stringify(asset));
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("afterbegin", this.element);
  }
  update(screen, { fiat, totalAsset, asset }) {
    this.element.update(screen, { fiat, totalAsset, asset });
  }
}

export default Header;
