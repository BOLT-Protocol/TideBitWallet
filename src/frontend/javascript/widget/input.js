import { randomHex } from "../utils/utils";

class InputElement extends HTMLElement {
  constructor() {
    super();
  }
  static get observedAttributes() {
    return ["focus", "has-value", "error"];
  }
  async handleInput(e) {
    this.inputValue =  e.target.value
    let checked;
    if (this.validator !== undefined) {
      this.isValid = await this.validator(e.target.value);
      checked = e.target.value === "" || (await this.validator(e.target.value));
    }
    if (checked !== undefined) {
      this.error = !checked;
    }
    // ++
    // https://stackoverflow.com/questions/8808590/number-input-type-that-takes-only-integers
    if (e.target.pattern === "d*") {
      //   this.value = this.value.replace(/[^0-9.]/g, '');
      //   this.value = this.value.replace(/(\..*)\./g, '$1');
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
      this.handleInput(e)
    );
    this.children[0].children[1].children[1].style.display = "none";
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
  get inputValue() {
    return this.children[0].children[1].children[0].value;
  }
  set inputValue(val) {
    if (val !== "") {
      this.hasValue = true;
    } else {
      this.hasValue = false;
    }
    this.children[0].children[1].children[0].value = val;
  }
  set inputType(val) {
    this.children[0].children[1].children[0].type = val;
  }
  set pattern(val) {
    this.children[0].children[1].children[0].pattern = val;
  }
  set label(val) {
    this.children[0].children[0].children[0].textContent = val;
  }
  set action(obj) {
    this.children[0].children[1].children[1].style.display = "inline-block";
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
    if (val === undefined) this.children[1].style.display = "none";
    this.children[1].textContent = val;
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
      this.handleInput(e)
    );
    this.children[0].children[1].children[1].removeEventListener("click", (e) =>
      obj.onPressed()
    );
  }
}

customElements.define("input-controller", InputElement);

class Input {
  constructor({
    inputType = "text",
    label,
    errorMessage = "",
    validation,
    action,
    pattern,
  }) {
    this.inputType = inputType;
    this.label = label;
    this.errorMessage = errorMessage;
    this.validation = validation;
    if (action !== undefined) this.action = action;
    this.pattern = pattern;
  }
  render(parentElement) {
    this.element = document.createElement("input-controller");
    parentElement.insertAdjacentElement("beforeend", this.element);
    this.element.inputType = this.inputType;
    this.element.label = this.label;
    this.element.errorMessage = this.errorMessage;
    this.element.validation = this.validation;
    if (this.action !== undefined) this.element.action = this.action;
    if (this.pattern !== undefined) this.element.pattern = this.pattern;
  }
  get inputValue() {
    return this.element?.inputValue;
  }

  set inputValue(value) {
    this.element.inputValue = value;
  }

  get isValid() {
    return this.element.isValid;
  }
}

export default Input;
