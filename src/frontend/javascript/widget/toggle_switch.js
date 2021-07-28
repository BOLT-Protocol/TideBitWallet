import mode from "../constant/config";

class ToggleSwitchElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "form__toggle";
    this.innerHTML = `
    <div class="form__toggle-button">
        <input type="checkbox" name="toggle-button" id="toggle-button" ${
          mode.debug ? "checked" : null
        }>
        <label for="toggle-button"></label>
    </div>
    `;

    this.children[0].children[0].addEventListener("change", (e) =>
      this.onPressed(e.target.checked)
    );
  }
  disconnectedCallback() {
    this.children[0].children[0].removeEventListener("change", (e) =>
      this.onPressed(e.target.checked)
    );
  }
}

customElements.define("toggle-switch", ToggleSwitchElement);

class ToggleSwitch {
  constructor(onPressed) {
    this.element = document.createElement("toggle-switch");
    this.element.onPressed = onPressed;
  }

  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
}

export default ToggleSwitch;
