import SettingColumn from "../widget/setting_column";

const getSettings = (state) => [
  {
    title: "Security center",
    items: [
      {
        name: "Reset Wallet",
        onPressed: () => {
          console.log("Reset Wallet Request");
        },
      },
    ],
  },
  {
    title: "General settings",
    items: [
      {
        name: "Fiat currency unit",
        label: state.walletConfig.fiat.symbol,
        onPressed: () => {
          console.log("Popup options of fiat currency");
        },
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
      },
      {
        name: "Terms of Service and Security policy",
        onPressed: () => {
          console.log("Ah!");
        },
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
    <div class="setting__text">${this.state.walletConfig.version}</div>
    `;
    this.settings.forEach((setting) => setting.render(this.children[0]));
  }
}

customElements.define("setting-list", SettingListElement);
class SettingList {
  constructor(state) {
    this.element = document.createElement("setting-list");
    const settings = getSettings(state);
    this.element.state = JSON.parse(JSON.stringify(state));
    this.element.settings = settings.map(
      (setting) => new SettingColumn(setting)
    );
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default SettingList;
