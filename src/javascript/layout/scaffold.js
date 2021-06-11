// https://developers.google.com/web/fundamentals/web-components/customelements
export default class Scaffold extends HTMLElement {
  // Can define constructor arguments if you wish.
  constructor() {
    // If you define a constructor, always call super() first!
    // This is specific to CE and required by the spec.
    super();
  }

  connectedCallback() {
    // create an element with some default HTML:
    this.innerHTML = `<main></main>`;
    this.className = "scaffold";
  }

  /**
   * @param {HTMLElement} element
   */
  set header(element) {
    this.insertAdjacentElement("afterbegin", element);
  }

  /**
   * @param {HTMLElement} element
   */
  set body(element) {
    this.childNodes[1].insertAdjacentElement("afterbegin", element);
  }

  /**
   * @param {HTMLElement} element
   */
  set bottomNavigator(element) {
    this.insertAdjacentElement("beforeend", element);
  }
}

// module.exports.Scaffold;
