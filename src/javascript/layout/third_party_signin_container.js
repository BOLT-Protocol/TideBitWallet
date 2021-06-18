class ThirdPartySigninContainerElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "third-party-signin";
    this.innerHTML = `
    <div class="third-party-signin__logo"></div>
    <div class="third-party-signin__logo-text">${this.state.walletConfig.version}</div>
    <div class="third-party-signin__action">
        <div id="googleid-signin" class="third-party-signin__button">
            <div class="third-party-signin__icon">
                <img src='./image/btn_google_light_normal_ios.svg'/>
            </div>
            <div class="third-party-signin__text">Sign in with Google</div>
        </div>
        <div id="appleid-signin" class="third-party-signin__button signin-button" data-color="${this.colorMode}" data-border="true" data-type="sign-in"></div>
    </div>
    `;
    this.googleSignInButton = this.children[2].children[0];
    this.appleSignInButton = this.children[2].children[1];
    this.googleSignInButton.addEventListener("click", this.googleSignin);
    this.appleSignInButton.addEventListener("click", this.appleSignin);
  }
  disconnectedCallback(){
    this.googleSignInButton.removeEventListener("click", this.googleSignin);
    this.appleSignInButton.removeEventListener("click", this.appleSignin);
  }
}

customElements.define("third-party-signin", ThirdPartySigninContainerElement);
class ThirdPartySigninContainer {
  constructor(state, colorMode, googleSignin, appleSigin) {
    this.state = JSON.parse(JSON.stringify(state));
    this.element = document.createElement("third-party-signin");
    this.element.state = this.state;
    this.element.googleSignin = googleSignin;
    this.element.appleSigin = appleSigin;
    this.element.colorMode = colorMode;
  }
  render(parentElement) {
    parentElement.insertAdjacentElement("afterbegin", this.element);
  }
}

export default ThirdPartySigninContainer;
