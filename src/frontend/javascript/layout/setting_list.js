import viewController from "../controller/view";
import SettingColumn from "../widget/setting_column";

const getSettings = (wallet, fiat) => [
  {
    title: "Security center",
    items: [
      {
        name: "Reset Wallet",
        onPressed: (scaffold) => {
          scaffold.openPopover(
            "confirm",
            "Are you sure to reset this wallet?",
            async () => {
              try {
                scaffold.openPopover("loading");
                await wallet.resetWallet();
                viewController("landing");
              } catch (error) {
                console.log(error);
                scaffold.openPopover("error");
              }
            },
            false
          );
        },
        next: true,
      },
    ],
  },
  {
    title: "General settings",
    items: [
      {
        name: "Fiat currency unit",
        label: {
          key: "fiat",
          value: fiat,
        },
        onPressed: () => {
          viewController.route("setting-fiat");
        },
        next: true,
      },
    ],
  },
  {
    title: "About",
    items: [
      {
        name: "Suggestions and feedback",
        onPressed: () => {
          console.log("Getting Complain");
        },
        next: true,
      },
      {
        name: "Terms of Service and Security policy",
        onPressed: () => {
          console.log("Ah!");
        },
        next: true,
      },
    ],
  },
  {
    title: "Developer Option",
    items: [
      {
        name: "Debug mode",
        onPressed: (debugMode) => viewController.route("landing", debugMode),
        next: false,
      },
    ],
  },
];
class SettingListElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "setting";
    this.innerHTML = `
    <div class="setting__list"></div>
    <div class="setting__text">${this.version}</div>
    `;
    this.settings.forEach((setting) => setting.render(this.children[0]));
  }
}

customElements.define("setting-list", SettingListElement);
class SettingList {
  constructor(wallet, fiat, version) {
    this.element = document.createElement("setting-list");
    this.element.version = version;
    const settings = getSettings(wallet, fiat);
    this.element.settings = settings.map(
      (setting) => new SettingColumn(setting)
    );
  }
  updateFiat(fiat) {
    const fiatSelector = document.querySelector(".setting__item-suffix[fiat]");
    fiatSelector.innerHTML = fiat;
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
  set parent(scaffold) {
    this.element.settings.forEach((settingEl) => (settingEl.parent = scaffold));
  }
}

export default SettingList;
