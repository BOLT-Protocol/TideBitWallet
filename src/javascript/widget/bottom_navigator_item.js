class BottomNavigatorItemElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "bottom-navigator__button";
    this.innerHTML = `
        <div class="bottom-navigator__icon"><i class="fas fa-${this.icon}"></i></div>
    `;
    this.addEventListener("click", () => this.onPressed(this.state));
  }
  disconnectedCallback() {
    this.removeEventListener("click", () => this.onPressed(this.state));
  }
}

customElements.define("bottom-navigator-item", BottomNavigatorItemElement);

class BottomNavigatorItem {
  constructor(state, item, onPressed) {
    this.element = document.createElement("bottom-navigator-item");
    this.element.state = JSON.parse(JSON.stringify(state));
    this.element.onPressed = onPressed;
    this.element.icon = item.icon;
    this.element.state.screen = item.screen;
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}
export default BottomNavigatorItem;
