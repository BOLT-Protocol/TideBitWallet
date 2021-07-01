import viewController from "./frontend/javascript/controller/view";
import { googleSignin, getInstallID } from "./frontend/javascript/utils/utils";

const getUserInfo = async (tidewallet) => {
  const api = {
    apiURL: "https://service.tidewallet.io/api/v1",
    apiKey: "f2a76e8431b02f263a0e1a0c34a70466",
    apiSecret: "9e37d67450dc906042fde75113ecb78c",
  };
  const OAuthID = await googleSignin();
  const InstallID = await getInstallID();
  console.log(OAuthID, InstallID);
  const result = await tidewallet.init({ user: { OAuthID, InstallID }, api });
  console.log(result);
  if (result) {
    const fiat = await tidewallet.getFiat();
    console.log(fiat);
    viewController.updateFiat(fiat);
    viewController.route("assets");
    const user = await tidewallet.overview();
    console.log(user);
    viewController.updateUser(user);
  }
};

const tidewallet = new window.TideWallet();
viewController.updateConfig(tidewallet, tidewallet.getVersion());

tidewallet.on("ready", (data) => {
  console.log("TideWallet is Ready", data);
});
tidewallet.on("update", (data) => {
  console.log("TideWallet Data Updated", data);
});
tidewallet.on("notice", (data) => {
  console.log("TideWallet Say Hello", data);
});

viewController.route("landing", () => getUserInfo(tidewallet));
