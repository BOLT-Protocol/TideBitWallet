import SettingFiatColumn from "../widget/setting_fiat_column";

class SettingFiatListElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "setting-fiat__list";
  }
}

customElements.define("setting-fiat-list", SettingFiatListElement);

class SettingFiatList {
  constructor() {
    this.element = document.createElement("setting-fiat-list");
  }
  update(fiatList, selectedFiat, callback) {
    const fiatColumns = fiatList.map(
      (fiat) => new SettingFiatColumn(fiat, selectedFiat, callback)
    );
    fiatColumns.forEach((fiatColumn) => fiatColumn.render(this.element));
  }

  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default SettingFiatList;
