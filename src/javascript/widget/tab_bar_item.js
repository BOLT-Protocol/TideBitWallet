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
  constructor(state, title, type, onPressed) {
    this.state = state;
    this.text = title;
    this.action = type;
    this.onPressed = onPressed;
  }
  render(parentElement) {
    this.element = document.createElement("tab-bar-item");
    parentElement.insertAdjacentElement("beforeend", this.element);
    this.element.state = this.state;
    this.element.text = this.text;
    this.element.action = this.action;
    this.element.onPressed = this.onPressed;
  }
}

export default TabBarItem;
