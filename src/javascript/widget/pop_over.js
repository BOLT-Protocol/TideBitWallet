class PopoverElement extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", (_) => {
      if (this.cancellable) this.handleCancel;
    });
  }
  connectedCallback() {
    this.className = "pop-over";
    this.innerHTML = `
    <div class="pop-over__content">
        <div class="pop-over__container>
            <div class="pop-over__icon"></div>
            <div class="pop-over__text"></div>
            <div class="pop-over__button-box">
                <div>Cancel</div>
                <div>Confirm</div>
            </div>
        </div>
    </div>
    `;
  }
  get textElement() {
    return this.children[0].children[0].children[1];
  }
  get cancelButton() {
    return this.children[0].children[0].children[2].children[0];
  }
  get confirmButton() {
    return this.children[0].children[0].children[2].children[1];
  }
  get open() {
    return this.hasAttribute("open");
  }
  get error() {
    return this.hasAttribute("error");
  }
  get success() {
    return this.hasAttribute("success");
  }
  get loading() {
    return this.hasAttribute("loading");
  }
  get confirm() {
    return this.hasAttribute("confirm");
  }
  set open(val) {
    // Reflect the value of the open property as an HTML attribute.
    if (val) {
      this.setAttribute("open", "");
    } else {
      this.removeAttribute("open");
    }
  }
  handleCancel = () => {
    if (this.open) {
      this.open = false;
      this.textElement.textContent = "";
    }
  };
  disconnectedCallback() {
    this.removeEventListener("click", (_) => {
      if (this.cancellable) this.handleCancel;
    });
  }
  static get observedAttributes() {
    return ["open"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.open) {
      if (this.confirm) {
        this.cancelButton.removeEventListener("click", this.handleCancel);
        this.confirmButton.removeEventListener("click", this.onConfirm);
      }
    }
  }

  errorPopup(text) {
    this.setAttribute("error", "");
    this.textElement.textContent = text || "Some thing went wrong";
  }
  successPopup(text) {
    this.setAttribute("success", "");
    this.textElement.textContent = text || "Success";
  }
  loadingPopup(text) {
    this.setAttribute("loading", "");
    this.textElement.textContent = text || "Loading";
  }
  confirmPopup(text, onConfirm) {
    this.setAttribute("confirm", "");
    this.cancellable = false;
    this.onConfirm = onConfirm;
    this.textElement.textContent = text || "Are you sure?";
    this.cancelButton.addEventListener("click", handleCancel);
    this.confirmButton.addEventListener("click", this.onConfirm);
  }
}

customElements.define("pop-over", PopoverElement);

class Popover {
  constructor() {
    this.element = document.createElement("pop-over");
  }
  set open(val) {
      
  }
  errorPopup(text) {
    this.element.errorPopup(text);
  }
  successPopup(text) {
    this.element.successPopup(text);
  }
  loadingPopup(text) {
    this.element.loadingPopup(text);
  }
  confirmPopup(text, onConfirm) {
    this.element.confirmPopup(text, onConfirm);
  }
}
export default Popover;
