class PopoverElement extends HTMLElement {
  constructor() {
    super();
    this.click = 0;
    this.addEventListener("click", (_) => {
      this.click += 1;
      if ((this.success && this.click > 1) || this.error) {
        this.closePopover();
      }
    });
  }
  connectedCallback() {
    this.className = "pop-over";
    this.innerHTML = `
    <div class="pop-over__content">
        <div class="pop-over__container">
            <div class="pop-over__icon"><div class="lds-ring"><div></div><div></div><div></div><div></div></div></div>
            <div class="pop-over__text"></div>
        </div>
        <div class="pop-over__button-box">
            <div>Cancel</div>
            <div>Confirm</div>
        </div>
    </div>
    `;
  }
  get textElement() {
    return this.children[0].children[0].children[1];
  }
  get cancelButton() {
    return this.children[0].children[1].children[0];
  }
  get confirmButton() {
    return this.children[0].children[1].children[1];
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
  closePopover = () => {
    if (this.confirm) {
      this.removeAttribute("confirm");
    }
    if (this.error) {
      this.removeAttribute("error");
    }
    if (this.success) {
      this.removeAttribute("success");
    }
    if (this.loading || this.hasAttribute("loading")) {
      this.removeAttribute("loading");
    }
    if (this.open) {
      this.open = false;
      this.click = 0;
      this.textElement.replaceChildren();
    }
  };
  disconnectedCallback() {
    this.removeEventListener("click", (_) => {
      if (this.cancellable) this.closePopover;
    });
  }
  static get observedAttributes() {
    return ["open"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.open) {
      if (this.confirm) {
        this.cancelButton.removeEventListener("click", this.closePopover);
        this.confirmButton.removeEventListener("click", async (val) => {
          this.closePopover();
          this.loadingPopup();
          setTimeout(this.closePopover, 300);
          this.onConfirm(val);
        });
      }
    }
  }

  customPopup(customElement) {
    this.closePopover();
    this.setAttribute("open", "");
    customElement.render(this.children[0].children[0].children[1]);
  }

  errorPopup(text) {
    this.closePopover();
    this.setAttribute("error", "");
    this.setAttribute("open", "");
    this.children[0].children[0].children[1].textContent =
      text || "Some thing went wrong";
  }
  successPopup(text) {
    this.closePopover();
    this.setAttribute("success", "");
    this.setAttribute("open", "");
    this.children[0].children[0].children[1].textContent = text || "Success";
  }
  loadingPopup(text) {
    this.closePopover();
    this.setAttribute("loading", "");
    this.setAttribute("open", "");
    this.children[0].children[0].children[1].textContent = text || "Loading";
  }
  confirmPopup(text, onConfirm) {
    this.closePopover();
    this.setAttribute("open", "");
    this.setAttribute("confirm", "");
    // this.cancellable = false;
    this.onConfirm = onConfirm;
    this.children[0].children[0].children[1].textContent =
      text || "Are you sure?";
    this.children[0].children[1].children[0].addEventListener(
      "click",
      this.closePopover
    );
    this.children[0].children[1].children[1].addEventListener(
      "click",
      async (val) => {
        this.closePopover();
        this.onConfirm(val);
      }
    );
  }
}

customElements.define("pop-over", PopoverElement);

class Popover {
  constructor() {
    this.element = document.createElement("pop-over");
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
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
  customPopup(customElement) {
    this.element.customPopup(customElement);
  }
  /**
   * @param {Boolean} value
   */
  set open(value) {
    this.element.open = value;
  }
}
export default Popover;
