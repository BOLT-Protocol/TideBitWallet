import Scaffold from "../layout/scaffold";
import ThirdPartySigninContainer from "../layout/third_party_signin_container";

class Landing {
  constructor() {}
  render(screen, version, wallet, debugMode) {
    this.body = new ThirdPartySigninContainer(
      wallet,
      version,
      "white",
      debugMode
    );
    this.scaffold = new Scaffold(this.header, this.body, this.footer);
    this.body.parent = this.scaffold;
    this.scaffold.view = screen;
  }
}

const landing = new Landing();
export default landing;
