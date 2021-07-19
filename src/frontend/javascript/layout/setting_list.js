import viewController from "../controller/view";
import SettingColumn from "../widget/setting_column";

const getSettings = (fiat) => [
  {
    title: "Security center",
    items: [
      {
        name: "Reset Wallet",
        onPressed: () => {
          console.log("Reset Wallet Request");
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
        label: fiat,
        onPressed: () => {
          console.log("Popup options of fiat currency");
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
  constructor(fiat, version) {
    const settings = getSettings(fiat);
    this.element = document.createElement("setting-list");
    this.element.version = version;
    this.element.fiat = fiat;
    this.element.settings = settings.map(
      (setting) => new SettingColumn(setting)
    );
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default SettingList;
