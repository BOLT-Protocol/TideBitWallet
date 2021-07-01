import Scaffold from "../layout/scaffold";
import ThirdPartySigninContainer from "../layout/third_party_signin_container";
import viewController from "../controller/view";
import { getInstallID, googleSignin } from "../utils/utils";

class Landing {
  constructor() {}
  render(screen, version, callback) {
    this.scaffold = new Scaffold(
      this.header,
      new ThirdPartySigninContainer(version, "white", callback),
      this.footer
    );
    this.scaffold.view = screen;
  }
}

const landing = new Landing();
export default landing;
