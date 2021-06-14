class ButtonElement extends HTMLElement {
  constructor() {
    super();
    this.hasPopup = false;
    this.addEventListener("click", async (e) => {
      this.action();
      if (this.hasPopup) {
        if (this.popup) this.removeAttribute("popup");
        const result = await this.hint();
        this.children[3].textContent = result;
        this.setAttribute("popup", "");
        setTimeout(() => {
          this.removeAttribute("popup");
        }, 400);
      }
    });
  }
  connectedCallback() {
    this.className = "button";
    this.innerHTML = `
        <div class="button__icon--leading button__icon"></div>
        <div class="button__text"></div>
        <div class="button__icon--suffix button__icon"></div>
        <span class="button__popup"></span>
        `;
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
  set onPressed(action) {
    this.action = action;
  }
  set popup(hint) {
    this.hasPopup = true;
    this.hint = hint; // async
  }
}
customElements.define("default-button", ButtonElement);

class Button {
  constructor(
    parentElement,
    title,
    onPressed,
    { style, leading, suffix, popup }
  ) {
    this.element = document.createElement("default-button");
    parentElement.insertAdjacentElement("beforeend", this.element);
    this.element.text = title;
    this.element.onPressed = onPressed;
    if (style) this.element.style = style;
    if (popup) this.element.popup = popup;
    if (leading) this.element.leading = leading;
    if (suffix) this.element.suffix = suffix;
  }
}

export default Button;
