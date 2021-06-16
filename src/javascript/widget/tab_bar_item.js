class TabBarItemElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "tab-bar__button";
    this.innerHTML = `
        <div class="tab-bar__icon"></div>
        <div class="tab-bar__text"></div>
    `;
    this.setAttribute(this.action, "");
    this.children[1].textContent = this.text;
    this.addEventListener("click", () => this.onPressed(this.state));
  }
  disconnectedCallback() {
    this.removeEventListener("click", this.onPressed);
  }
}
customElements.define("tab-bar-item", TabBarItemElement);

class TabBarItem {
  constructor(state, title, type, onPressed) {
    this.element = document.createElement("tab-bar-item");
    this.element.state = state;
    this.element.text = title;
    this.element.action = type;
    this.element.onPressed = onPressed;
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default TabBarItem;
