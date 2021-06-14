class TabBarElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "tab-bar";
  }
}
customElements.define("tab-bar", TabBarElement);

class TabBar {
  constructor() {
    this.element = document.createElement("tab-bar");
  }
}
export default TabBar;
