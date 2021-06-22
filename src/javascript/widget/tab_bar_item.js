import viewController from "../controller/view";
class TabBarItemElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "tab-bar__button";
    this.innerHTML = `
        <div class="tab-bar__icon"></div>
        <div class="tab-bar__screen"></div>
    `;
    this.setAttribute(this.action, "");
    this.children[1].textContent = this.text;
    this.addEventListener("click", () => viewController.route(this.screen));
  }
  disconnectedCallback() {
    this.removeEventListener("click", () => viewController.route(this.screen));
  }
}
customElements.define("tab-bar-item", TabBarItemElement);

class TabBarItem {
  constructor(item) {
    this.element = document.createElement("tab-bar-item");
    this.element.text = item.title;
    this.element.screen = item.screen;
    this.element.action = item.title.toLowerCase();
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default TabBarItem;
