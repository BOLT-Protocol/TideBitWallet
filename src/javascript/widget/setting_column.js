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
        this.children[index + 1].addEventListener("click", item.onPressed);
      });
    } else {
      this.addItem(this.items);
      this.children[index + 1].addEventListener("click", items.onPressed);
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
        <div class="setting__item-icon"><i class="fas fa-chevron-right"></i></div>
    </div>
    `;
    this.insertAdjacentHTML("beforeend", markup);
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
