class ThirdPartySigninContainerElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "third-party-signin";
    this.innerHTML = `
        <div id="googleid-signin" class="third-party-signin__button"></div>
        <div id="appleid-signin" class="third-party-signin__button signin-button" data-color="black" data-border="true" data-type="sign-in"></div>
        `;
  }
}

customElements.define("third-party-signin", ThirdPartySigninContainerElement);
class ThirdPartySigninContainer {
  constructor() {
    this.element = document.createElement("third-party-signin");
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("afterbegin", this.element);
  }
}

export default ThirdPartySigninContainer;
