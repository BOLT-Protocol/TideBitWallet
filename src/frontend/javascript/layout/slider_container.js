class SlidesContainerElement extends HTMLElement {
  constructor() {
    super();
  }
  set focus(index) {
    this.setAttribute("focus", index);
  }
  static get observedAttributes() {
    return ["focus"];
  }
  connectedCallback() {
    this.className = "slides-container";
    this.childrenData.forEach((childData) => {
      const slidesNode = document.createElement("div");
      slidesNode.className = "slides";
      this.insertAdjacentElement("beforeend", slidesNode);
      childData.render(slidesNode);
    });
    this.focus = 0;
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "focus") {
      if (oldValue) this.children[oldValue].style.display = "none";
      this.children[newValue].style.display = "block";
    }
  }
  // disconnectedCallback() {}
}
customElements.define("slides-container", SlidesContainerElement);

class SlidesContainer {
  constructor(children) {
    this.element = document.createElement("slides-container");
    this.element.childrenData = children;
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.element);
  }
  set focus(index) {
    this.element.focus = index;
  }
}
export default SlidesContainer;
