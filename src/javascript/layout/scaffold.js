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
  set view(name) {
    this.setAttribute("view", name);
  }
  set id(val) {
    this.setAttribute("id", val);
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
   * @param {string} id
   */
  set id(id) {
    this.element.id = id;
  }
  /**
   * @param {string} name
   */
   set view(name) {
    this.element.view = name;
  }
}

export default Scaffold;
