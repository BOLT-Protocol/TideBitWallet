class TabBarItemElement extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", () => this.onPressed(this.state));
  }
  connectedCallback() {
    this.className = "tab-bar__button";
    this.innerHTML = `
        <div class="tab-bar__icon"></div>
        <div class="tab-bar__text"></div>
    `;
  }
  disconnectedCallback() {
    this.removeEventListener("click", this.onPressed);
  }
  set action(val) {
    this.setAttribute(val, "");
  }
  set text(title) {
    this.children[1].textContent = title;
  }
}
customElements.define("tab-bar-item", TabBarItemElement);

class TabBarItem {
  constructor(state, parentElement, title, type, onPressed) {
    this.element = document.createElement("tab-bar-item");
    parentElement.insertAdjacentElement("beforeend", this.element);
    this.element.state = JSON.parse(JSON.stringify(state));
    this.element.text = title;
    this.element.action = type;
    this.element.onPressed = onPressed;
  }
}

export default TabBarItem;
