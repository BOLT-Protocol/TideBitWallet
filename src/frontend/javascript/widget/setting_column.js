import ToggleSwitch from "./toggle_switch";

class SettingColumnElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "setting__column";
    this.addTitle(this.title);
    if (Array.isArray(this.items)) {
      this.items.forEach((item, index) => {
        this.addItem(item);
        this.children[index + 1].addEventListener(
          "click",
          item.next ? item.onPressed : null
        );
      });
    } else {
      this.addItem(this.items);
      this.children[index + 1].addEventListener(
        "click",
        items.next ? items.onPressed : null
      );
    }
  }
  disconnectedCallback() {
    if (Array.isArray(this.items)) {
      this.items.forEach((item, index) => {
        this.children[index + 1].removeEventListener("click", item.onPressed);
      });
    } else {
      addItem(this.items);
      this.children[index + 1].removeEventListener("click", items.onPressed);
    }
  }
  addTitle(title) {
    const markup = `<div class="setting__title">${title}</div>`;
    this.insertAdjacentHTML("afterbegin", markup);
  }
  addItem(item) {
    const markup = `
    <div class="setting__item">
        <div class="setting__item-name">${item.name}</div>
        <div class="setting__item-suffix">${item.label || ""}</div>
        <div class="setting__item-icon">${
          item.next ? `<i class="fas fa-chevron-right">` : ``
        }</i></div>
    </div>
    `;
    this.insertAdjacentHTML("beforeend", markup);
    if (!item.next) {
      this.toggleSwitch = new ToggleSwitch(item.onPressed);
      this.toggleSwitch.render(this.children[1].children[2]);
    }
  }
}

customElements.define("setting-column", SettingColumnElement);

class SettingColumn {
  constructor(setting) {
    this.element = document.createElement("setting-column");
    this.element.title = setting.title;
    this.element.items = setting.items.map((item) => ({ ...item }));
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default SettingColumn;
