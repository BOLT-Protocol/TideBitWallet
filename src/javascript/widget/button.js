class ButtonElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "button";
    this.innerHTML = `
        <div class="button__icon--leading button__icon"></div>
        <div class="button__text"></div>
        <div class="button__icon--suffix button__icon"></div>
        <span class="button__popup"></span>
        `;
    this.children[1].textContent = this.text;
    if (this.styleTag) {
      if (Array.isArray(this.styleTag)) {
        this.styleTag.forEach((v) => this.setAttribute(v, ""));
      } else {
        this.setAttribute(this.styleTag, "");
      }
    }
    if (this.leading)
      this.children[0].innerHTML = `<i class="far fa-${this.leading}"></i>`;
    if (this.suffix)
      this.children[2].innerHTML = `<i class="far fa-${this.suffix}"></i>`;
    this.addEventListener("click", async (e) => {
      this.onPressed();
      this.handlePopup();
    });
  }
  disconnectedCallback() {
    this.removeEventListener("click", async (e) => {
      this.onPressed();
      this.handlePopup();
    });
  }
  handlePopup = async () => {
    if (this.popup) {
      this.removeAttribute("popup");
      const result = await this.popup();
      this.children[3].textContent = result;
      this.setAttribute("popup", "");
      setTimeout(() => {
        this.removeAttribute("popup");
      }, 400);
    }
  };
  /**
   * @param {Boolean} val
   */
  set disabled(val) {
    if (val) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }
}
customElements.define("default-button", ButtonElement);

class Button {
  /**
   * @param {String} title
   * @param {Function} onPressed
   * @param {String[]} style
   * @param {String} leading - fontawsome icon name  ex.<i class="far fa-${name}"></i>
   * @param {String} suffix - fontawsome icon name
   * @param {Function} popup - return popup text
   */
  constructor(title, onPressed, { style, leading, suffix, popup }) {
    this.element = document.createElement("default-button");
    this.element.text = title;
    this.element.onPressed = onPressed;
    if (style) this.element.styleTag = style;
    if (popup) this.element.popup = popup;
    if (leading) this.element.leading = leading;
    if (suffix) this.element.suffix = suffix;
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
  /**
   * @param {Boolean} val
   */
  set disabled(val) {
    this.element.disabled = val;
  }
}

export default Button;
