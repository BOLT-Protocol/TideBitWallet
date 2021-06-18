import Scaffold from "../layout/scaffold";
import ThirdPartySigninContainer from "../layout/third_party_signin_container";

export default  landing = () =>
  new Scaffold(undefined, new ThirdPartySigninContainer(), undefined);
