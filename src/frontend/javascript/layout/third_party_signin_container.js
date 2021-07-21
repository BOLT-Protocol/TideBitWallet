import viewController from "../controller/view";
import * as utils from "../utils/utils";
import CreateWallet from "../widget/create_wallet";
class ThirdPartySigninContainerElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "third-party-signin";
    this.innerHTML = `
    <div class="third-party-signin__logo"></div>
    <div class="third-party-signin__logo-text">${this.version}</div>
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
    this.init = async () => {
      this.parent?.openPopover("loading");
      const [success, user] = await utils.initUser({
        tidewallet: this.wallet,
        debugMode: this.debugMode,
      });
      if (!success) {
        this.parent?.openPopover("error");
        return;
      }
      if (user) {
        this.parent?.customPopup(
          new CreateWallet({
            onAutomatic: async () => {
              this.parent?.openPopover("loading");
              const result = await utils.createUser({
                tidewallet: this.wallet,
                user,
              });
              if (!result) {
                this.parent?.openPopover("error");
                return;
              }
            },
            onMnemonic: async () => {
              viewController.route("mnemonic", async (data) => {
                await utils.createUser({
                  tidewallet: this.wallet,
                  user: {
                    ...user,
                    mnemonic: data.mnemonic,
                    password: data.passphrase,
                  },
                });
              });
            },
          })
        );
      }
    };
    this.googleSignInButton = this.children[2].children[0];
    this.appleSignInButton = this.children[2].children[1];
    this.googleSignInButton.addEventListener("click", this.init);
  }
  disconnectedCallback() {
    this.googleSignInButton.removeEventListener("click", async () => {
      this.parent?.openPopover("loading");
      const [success, user] = await utils.initUser({
        tidewallet: this.wallet,
        debugMode: this.debugMode,
      });
      if (!success) {
        this.parent?.openPopover("error");
        return;
      }
      if (user) {
        this.parent?.customPopup(
          new CreateWallet({
            onAutomatic: async () => {
              this.parent?.openPopover("loading");
              const result = await utils.createUser({
                tidewallet: this.wallet,
                user,
              });
              if (!result) {
                this.parent?.openPopover("error");
                return;
              }
            },
            onMnemonic: async () => {
              viewController.route("mnemonic", async (data) => {
                await utils.createUser({
                  tidewallet: this.wallet,
                  user: {
                    ...user,
                    mnemonic: data.mnemonic,
                    password: data.passphrase,
                  },
                });
              });
            },
          })
        );
      }
    });
  }
}

customElements.define("third-party-signin", ThirdPartySigninContainerElement);
class ThirdPartySigninContainer {
  constructor(wallet, version, colorMode, debugMode) {
    this.version = version;
    this.element = document.createElement("third-party-signin");
    this.element.wallet = wallet;
    this.element.colorMode = colorMode;
    this.element.version = version;
    this.debugMode = debugMode;
  }
  set parent(element) {
    this.element.parent = element;
    if (this.debugMode !== undefined) {
      this.element.parent?.openPopover("loading");
      utils.initUser({
        tidewallet: this.element.wallet,
        debugMode: this.debugMode,
      });
    }
  }
  render(parentElement) {
    this.parentElement = parentElement;
    parentElement.insertAdjacentElement("afterbegin", this.element);
  }
}

export default ThirdPartySigninContainer;
