import viewController from "../controller/view";

class BottomNavigatorItemElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "bottom-navigator__button";
    this.innerHTML = `
        <div class="bottom-navigator__icon"><i class="fas fa-${this.icon}"></i></div>
    `;
    this.addEventListener("click", () => viewController.route(this.screen));
  }
  disconnectedCallback() {
    this.removeEventListener("click", () => viewController.route(this.screen));
  }
}

customElements.define("bottom-navigator-item", BottomNavigatorItemElement);

class BottomNavigatorItem {
  constructor(item) {
    this.element = document.createElement("bottom-navigator-item");
    this.element.icon = item.icon;
    this.element.screen = item.screen;
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}
export default BottomNavigatorItem;
