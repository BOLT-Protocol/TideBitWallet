import Scaffold from "../layout/scaffold";
import ThirdPartySigninContainer from "../layout/third_party_signin_container";

const landing = () =>
  new Scaffold(undefined, new ThirdPartySigninContainer(), undefined);

export default landing;
