import Popover from "../widget/pop_over";

// https://developers.google.com/web/fundamentals/web-components/customelements
class ScaffoldElement extends HTMLElement {
  // Can define constructor arguments if you wish.
  constructor() {
    // If you define a constructor, always call super() first!
    // This is specific to CE and required by the spec.
    super();
  }
  connectedCallback() {
    this.className = "scaffold";
    // create an element with some default HTML:
    this.innerHTML = `
    <header></header>
    <main></main>
    <footer></footer>
    `;
    if (this.header) this.header.render(this.children[0]);
    if (this.body) {
      if (Array.isArray(this.body)) {
        this.body.forEach((element) => element.render(this.children[1]));
      } else {
        this.body.render(this.children[1]);
      }
    }
    if (this.footer) this.footer.render(this.children[2]);
    this.popover = new Popover();
    this.popover.render(this);
  }
  updateHeader(newHeader) {
    this.header = newHeader;
    this.children[0].replaceChildren();
    this.header.render(this.children[0]);
  }
  updateBody(newBody) {
    this.body = newBody;
    this.children[1].replaceChildren();
    this.body.render(this.children[1]);
  }
  updateFooter(newFooter) {
    this.footer = newFooter;
    this.children[2].replaceChildren();
    this.footer.render(this.children[2]);
  }
}

customElements.define("scaffold-widget", ScaffoldElement);

class Scaffold {
  constructor(header, body, footer) {
    this.element = document.createElement("scaffold-widget");
    this.element.header = header;
    this.element.body = body;
    this.element.footer = footer;
    document.body.replaceChildren();
    document.body.insertAdjacentElement("beforeend", this.element);
  }

  /**
   * @param {String only 4 type: "error", "success", "loading", "confirm"} type
   * @param {String: show on the dialog} text
   * @param {function} onConfirm
   * @param {default true} cancellable
   */
  static openPopover(type, text, onConfirm, cancellable = true) {
    const popover = document.querySelector("pop-over");
    popover.open = true;
    if (cancellable) {
      popover.cancellable = cancellable;
    }
    switch (type) {
      case "error":
        popover.errorPopup(text);
        break;
      case "success":
        popover.successPopup(text);
        break;
      case "loading":
        popover.loadingPopup(text);
        break;
      case "confirm":
        popover.confirmPopup(text, onConfirm);
        break;
    }
  }
  static closePopover(timeout) {
    const popover = document.querySelector("pop-over");
    if (timeout !== undefined) {
      setTimeout(() => {
        popover.open = false;
      }, timeout);
    } else {
      popover.open = false;
    }
  }
  // render(parentElement) {
  //   parentElement.replaceChildren();
  //   parentElement.insertAdjacentElement("afterbegin", this.element);
  // }
  // updateHeader(newHeader) {
  //   this.element.updateHeader(newHeader);
  // }
  // updateBody(newBody) {
  //   this.element.updateBody(newBody);
  // }
  // updateFooter(newFooter) {
  //   this.element.updateFooter(newFooter);
  // }
}

export default Scaffold;
