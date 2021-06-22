import Scaffold from "../layout/scaffold";
import ThirdPartySigninContainer from "../layout/third_party_signin_container";
import route from "../controller/route";

const googleSignin = async (state) => {
  // await;
  const _state = JSON.parse(JSON.stringify(state));
  _state.screen = "accounts";
  route(_state);
};

const landing = (state) =>
  new Scaffold(
    undefined,
    new ThirdPartySigninContainer(state, "white", () => googleSignin(state)),
    undefined
  );

export default landing;
