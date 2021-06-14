class TabBarElement extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", this.onFocus);
  }
  onFocus(e) {
    Array.from(document.querySelectorAll("tab-bar > *")).forEach((el) =>
      el.removeAttribute("focus")
    );
    console.log(e.target);
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
    if (val) {
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
  constructor() {
    this.element = document.createElement("tab-bar");
  }
}
export default TabBar;
