import { randomHex } from "../utils/utils";

class InputElement extends HTMLElement {
  constructor() {
    super();
  }
  static get observedAttributes() {
    return ["focus", "has-value", "error"];
  }
  handleInput(e) {
    if (this.value !== "") {
      this.hasValue = true;
    } else {
      this.hasValue = false;
    }
    const checked = this.value === "" || this.validator(this.value);
    if (checked !== undefined) {
      this.error = !checked;
    }
  }
  connectedCallback() {
    this.className = "input__controller";
    this.id = randomHex(6);
    this.innerHTML = `
    <div class="input__field">
        <label class="input__label" for=${this.id}><p></p></label>
        <div class="input__content">
            <input type="text" class="input__input" id=${this.id}>
            <div class="input__action"></i></div>
        </div>
    </div>
    <div class="input__error-message"></div>
    `;
    this.children[0].children[1].children[0].addEventListener(
      "focus",
      (e) => (this.focus = true)
    );
    this.children[0].children[1].children[0].addEventListener(
      "focusout",
      (e) => (this.focus = false)
    );
    // this.children[0].children[1].children[0].addEventListener("change", (e) => {
    this.children[0].children[1].children[0].addEventListener("input", (e) =>
      handleInput(e)
    );
  }
  get hasValue() {
    return this.hasAttribute("has-value");
  }
  set focus(val) {
    if (val) {
      Array.from(document.querySelectorAll("input__controller")).forEach(
        (controller) => (controller.focus = false)
      );
      this.setAttribute("focus", "");
    } else {
      this.removeAttribute("focus");
    }
  }
  set hasValue(val) {
    if (val) {
      this.setAttribute("has-value", "");
    } else {
      this.removeAttribute("has-value");
    }
  }
  set error(val) {
    if (val) {
      this.setAttribute("error", "");
    } else {
      this.removeAttribute("error");
    }
  }
  set inputType(val) {
    this.children[0].children[1].children[0].type = val;
  }
  set label(val) {
    this.children[0].children[0].children[0].textContent = val;
  }
  set action(obj) {
    this.children[0].children[1].children[1].insertAdjacentHTML(
      "afterbegin",
      `<i class="far fa-${obj.icon}"></i>`
    );
    this.children[0].children[1].children[1].addEventListener("click", (e) =>
      obj.onPressed()
    );
  }
  set validation(val) {
    this.validator = val;
  }
  set errorMessage(val) {
    this.children[1].textContent = val;
  }
  get value() {
    return this.children[0].children[1].children[0].value;
  }
  disconnectedCallback() {
    // target.removeEventListener('');
    this.children[0].children[1].children[0].removeEventListener(
      "focus",
      (e) => (this.focus = true)
    );
    this.children[0].children[1].children[0].removeEventListener(
      "focusout",
      (e) => (this.focus = false)
    );
    this.children[0].children[1].children[0].removeEventListener("input", (e) =>
      handleInput(e)
    );
    this.children[0].children[1].children[1].removeEventListener("click", (e) =>
      obj.onPressed()
    );
  }
}

customElements.define("input-controller", InputElement);

class Input {
  constructor(
    parentElement,
    { inputType = "text", label, errorMessage = "", validation, action }
  ) {
    this.element = document.createElement("input-controller");
    parentElement.insertAdjacentElement("beforeend", this.element);
    this.element.inputType = inputType;
    this.element.label = label;
    this.element.errorMessage = errorMessage;
    this.element.validation = validation;
    if (action !== undefined) this.element.action = action;
  }
}

export default Input;
