import route from "../utils/route";

class BottomNavigatorItemElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "bottom-navigator__button";
    this.innerHTML = `
        <div class="bottom-navigator__icon"><i class="fas fa-${this.icon}"></i></div>
    `;
    this.addEventListener("click", () => route(this.state));
  }
  disconnectedCallback() {
    this.removeEventListener("click", route(this.state));
  }
}

customElements.define("bottom-navigator-item", BottomNavigatorItemElement);

class BottomNavigatorItem {
  constructor(state, item) {
    this.state = JSON.parse(JSON.stringify(state));
    this.state.screen = item.screen;
    this.element = document.createElement("bottom-navigator-item");
    this.element.state = this.state;
    this.element.icon = item.icon;
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}
export default BottomNavigatorItem;
