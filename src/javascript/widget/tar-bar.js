class TabBarElement extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", this.onFocus);
  }
  onFocus(e) {
    Array.from(document.querySelectorAll("tab-bar > *")).forEach((el) =>
      el.removeAttribute("focus")
    );
    if (e.target.className === "button") e.target.setAttribute("focus", "");
    else e.target.parentElement.setAttribute("focus", "");
  }
  connectedCallback() {
    this.className = "tab-bar";
  }
  disconnectedCallback() {
    this.removeEventListener("click", this.onFocus);
  }
  get focus() {
    return Array.from(document.querySelectorAll("tab-bar > *")).findIndex(
      (el) => el.hasAttribute("focus")
    );
  }
  set focus(val) {
    if (val !== undefined) {
      document
        .querySelectorAll("tab-bar > *")
        [Number.isInteger(val) ? val : this.childElementCount - 2].setAttribute(
          "focus",
          ""
        );
    }
  }
}
customElements.define("tab-bar", TabBarElement);

class TabBar {
  constructor(children, defaultFocus) {
    this.children = children;
    this.focus = defaultFocus;
  }
  render(parentElement, position) {
    this.element = document.createElement("tab-bar");
    parentElement.insertAdjacentElement(position || "beforeend", this.element);
    if (Array.isArray(this.children)) {
      this.children.forEach((child) => child.render(this.element));
    }
    this.element.focus = this.focus;
  }
  get selected() {
    return this.element.focus;
  }
}
export default TabBar;
