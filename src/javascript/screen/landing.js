import Scaffold from "../layout/scaffold";
import ThirdPartySigninContainer from "../layout/third_party_signin_container";
import viewController from "../controller/view"

const googleSignin = async (screen) => {
  // await;
  viewController.route(screen);
};

class Landing {
  constructor() {}
  render(screen, version) {
    this.scaffold = new Scaffold(
      this.header,
      new ThirdPartySigninContainer(version, "white", () =>
        googleSignin(state)
      ),
      this.footer
    );
    this.scaffold.element.view = screen;
  }
}

const landing = new Landing();
export default landing;
