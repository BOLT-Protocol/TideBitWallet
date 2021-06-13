class Button extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", (e) => {
      this.action();
    });
  }
  connectedCallback() {
    this.className = "button";
    this.innerHTML = `
        <div class="button__icon--leading button__icon"></div>
        <div class="button__text"></div>
        <div class="button__icon--suffix button__icon"></div>
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
  set onPressed(action){
      this.action = action;
  }
}
customElements.define("default-button", Button);

export default Button;
