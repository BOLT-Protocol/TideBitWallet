class ButtonElement extends HTMLElement {
  constructor() {
    super();
    this.hasPopup = false;
    this.addEventListener("click", async (e) => {
      this.onPressed();
      this.handlePopup();
    });
  }
  handlePopup = async () => {
    if (this.hasPopup) {
      if (this.popup) this.removeAttribute("popup");
      const result = await this.hint();
      this.children[3].textContent = result;
      this.setAttribute("popup", "");
      setTimeout(() => {
        this.removeAttribute("popup");
      }, 400);
    }
  };
  connectedCallback() {
    this.className = "button";
    this.innerHTML = `
        <div class="button__icon--leading button__icon"></div>
        <div class="button__text"></div>
        <div class="button__icon--suffix button__icon"></div>
        <span class="button__popup"></span>
        `;
  }
  disconnectedCallback() {
    this.removeEventListener("click", async (e) => {
      this.action();
      this.handlePopup();
    });
  }
  set style(val) {
    if (Array.isArray(val)) {
      val.forEach((v) => this.setAttribute(v, ""));
    } else {
      this.setAttribute(v, "");
    }
  }
  set text(str) {
    console.log(str);
    this.children[1].textContent = str;
  }
  /**
   * @param {any} icon: To reference font awesome icon, you only need to know it's name
   */
  set leading(icon) {
    this.children[0].innerHTML = `<i class="far fa-${icon}"></i>`;
  }
  set suffix(icon) {
    this.children[2].innerHTML = `<i class="far fa-${icon}"></i>`;
    // this.children[2].insertAdjacentHTML("beforeend", `<i class="far fa-${icon}"></i>`);
  }
  set popup(hint) {
    this.hasPopup = true;
    this.hint = hint; // async
  }
}
customElements.define("default-button", ButtonElement);

class Button {
  constructor(title, onPressed, { style, leading, suffix, popup }) {
    this.title = title;
    this.onPressed = onPressed;
    this.style = style;
    this.popup = popup;
    this.leading = leading;
    this.suffix = suffix;
  }
  render(parentElement) {
    this.element = document.createElement("default-button");
    parentElement.insertAdjacentElement("beforeend", this.element);
    this.element.text = this.title;
    this.element.onPressed = this.onPressed;
    if (this.style) this.element.style = this.style;
    if (this.popup) this.element.popup = this.popup;
    if (this.leading) this.element.leading = this.leading;
    if (this.suffix) this.element.suffix = this.suffix;
  }
}

export default Button;
