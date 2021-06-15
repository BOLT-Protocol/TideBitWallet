class ToggleViewElement extends HTMLElement {
  constructor() {
    super();
    this.toggle = false;
    this.addEventListener("click", this.handleSwitchView);
  }
  disconnectedCallback() {
    this.removeEventListener("click", this.handleSwitchView);
  }
  connectedCallback() {
    this.className = "toggle-view";
    this.innerHTML = `
    <div class="toggle-view__content"></div>
    <div class="toggle-view__content"></div>
    <div class="toggle-view__button"></div>
    `;
  }
  handleSwitchView() {
    this.toggle = !this.toggle;
  }
  get onElement() {
    return this.children[1];
  }
  get offElement() {
    return this.children[0];
  }
  set toggle(val) {
    if (val) {
      this.setAttribute("on", "");
    } else {
      this.removeAttribute("on");
    }
  }
}
