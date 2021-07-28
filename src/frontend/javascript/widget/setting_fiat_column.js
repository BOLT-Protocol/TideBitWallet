class SettingFiatColumnElement extends HTMLElement {
  constructor() {
    super();
  }
  set selected(value) {
    if (value) {
      this.setAttribute("selected", "");
    } else {
      this.removeAttribute("selected");
    }
  }
  connectedCallback() {
    this.className = "setting-fiat__column";
    this.innerHTML = `
      <div class="setting-fiat__title">${this.fiat.name}</div>
      <div class="setting-fiat__label"><i class="fas fa-check"></i></div>
      `;
    this.selected = this.fiat.name === this.selectedFiat;
    this.addEventListener("click", (_) => {
      this.callback(this.fiat);
    });
  }
  disconnectedCallback() {
    this.removeEventListener("click", (_) => {
      this.callback(this.fiat);
    });
  }
}
customElements.define("setting-fiat-column", SettingFiatColumnElement);

class SettingFiatColumn {
  constructor(fiat, selectedFiat, callback) {
    this.element = document.createElement("setting-fiat-column");
    this.element.fiat = fiat;
    this.element.selectedFiat = selectedFiat;
    this.element.callback = callback;
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default SettingFiatColumn;
