import Scaffold from "../layout/scaffold";
import ThirdPartySigninContainer from "../layout/third_party_signin_container";
import viewController from "../controller/view";

const googleSignin = async (screen) => {
  // https://stackoverflow.com/questions/44968953/how-to-create-a-login-using-google-in-chrome-extension/44987478
  const api = {
    apiURL: "https://service.tidewallet.io/api/v1",
    apiKey: "f2a76e8431b02f263a0e1a0c34a70466",
    apiSecret: "9e37d67450dc906042fde75113ecb78c",
  };
  const user = {};
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    console.log(token);
    let init = {
      method: "GET",
      async: true,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      contentType: "json",
    };
    fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", init)
      .then((response) => response.json())
      .then(function (data) {
        // get oauthID
        console.log(data);
        user.OAuthID = data.id;
        // get install ID
        chrome.storage.sync.get(["InstallID"], function (result) {
          user.InstallID = result.InstallID;
          console.log(user.OAuthID, user.InstallID);
          // ++ TideWalletJS
          // tidewallet.init({ user, api });
          viewController.route(screen);
        });
      });
  });
};

class Landing {
  constructor() {}
  render(screen, version) {
    this.scaffold = new Scaffold(
      this.header,
      new ThirdPartySigninContainer(version, "white", () =>
        googleSignin("assets")
      ),
      this.footer
    );
    this.scaffold.view = screen;
  }
}

const landing = new Landing();
export default landing;
