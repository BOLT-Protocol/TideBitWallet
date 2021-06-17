// https://developers.google.com/web/fundamentals/web-components/customelements
class ScaffoldElement extends HTMLElement {
  // Can define constructor arguments if you wish.
  constructor() {
    // If you define a constructor, always call super() first!
    // This is specific to CE and required by the spec.
    super();
  }
  connectedCallback() {
    // create an element with some default HTML:
    this.className = "scaffold";
    this.innerHTML = `
    <header></header>
    <main></main>
    <footer></footer>
    `;
    if (this.footer) this.header.render(this.children[0]);
    if (this.body)
      if (Array.isArray(this.body))
        this.body.forEach((children) => children.render(this.children[1]));
      else this.body.render(this.children[1]);
    if (this.footer) this.footer.render(this.children[2]);
  }
}

customElements.define("scaffold-widget", ScaffoldElement);

class Scaffold {
  constructor({ header, body, footer }) {
    this.element = document.createElement("scaffold-widget");
    this.element.header = header;
    this.element.body = body;
    this.element.footer = footer;
  }
  render() {
    document.body.replaceChildren();
    document.body.insertAdjacentElement("afterbegin", root);
  }
}

export default Scaffold;
