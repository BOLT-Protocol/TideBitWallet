class ThirdPartySigninContainerElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "third-party-signin";
    this.innerHTML = `
        <div id="googleid-signin" class="third-party-signin__button"></div>
        <div id="appleid-signin" class="third-party-signin__button" data-color="black" data-border="true" data-type="sign-in"></div>
        `;
  }
}

class ThirdPartySigninContainer{
  constructor(){
    
  }
}

export default ThirdPartySigninContainer;
