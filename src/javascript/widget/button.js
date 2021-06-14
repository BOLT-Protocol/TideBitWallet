class ButtonElement extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", (e) => {
      this.action();
      if (this.popup.textContent) {
        if (!this.popup) {
          this.setAttribute("popup", "");
          setTimeout(() => {
            this.removeAttribute("popup");
          }, 300);
        } else {
          this.removeAttribute("popup");
        }
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
  set leading(element) {
    this.children[0].innerHTML = element;
  }
  set suffix(element) {
    this.children[2].insertAdjacentHTML("beforeend", element);
  }
  set onPressed(action) {
    this.action = action;
  }
  get popup() {
    this.hasAttribute("popup");
  }
  set popup(val) {
    this.children[3].textContent = val;
  }
}
customElements.define("default-button", ButtonElement);

class Button {
  constructor(
    parentElement,
    title,
    onPressed,
    { suffix, leading, popup, style }
  ) {
    this.element = document.createElement("default-button");
    parentElement.insertAdjacentElement("beforeend", this.element);
    this.element.text = title;
    this.element.onPressed = onPressed;
    this.element.style = style;
  }
}

export default Button;
