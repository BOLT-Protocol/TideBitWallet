import viewController from "../controller/view";
import Scaffold from "../layout/scaffold";
import ThirdPartySigninContainer from "../layout/third_party_signin_container";
import Asset from "../model/asset";
import { googleSignin, getInstallID } from "../utils/utils";

const getUserInfo = async (tidewallet, data = {}) => {
  const api = {
    apiURL: "https://service.tidewallet.io/api/v1",
    apiKey: "f2a76e8431b02f263a0e1a0c34a70466",
    apiSecret: "9e37d67450dc906042fde75113ecb78c",
  };
  const OAuthID = await googleSignin();
  const InstallID = await getInstallID();
  console.log("OAuthID :", OAuthID); // -- test
  console.log("InstallID :", InstallID); // -- test
  console.log("mnemonic :", data?.mnemonic); // -- test
  console.log("passphrase :", data?.passphrase); // -- test
  const result = await tidewallet.init({
    user: {
      OAuthID,
      InstallID,
      mnemonic: data?.mnemonic,
      password: data?.passphrase,
    },
    api,
  });
  console.log(result);
  if (result) {
    const fiat = await tidewallet.getFiat();
    console.log(fiat);
    viewController.updateFiat(fiat);
    viewController.route("assets");
    const dashboard = await tidewallet.overview();
    console.log(dashboard);
    const balance = dashboard?.balance;
    const assets = dashboard?.currencies?.map(
      (currency) => new Asset(currency)
    );
    console.log(balance, assets);
    viewController.updateUser({
      balance,
      assets,
    });
  }
};

class Landing {
  constructor() {}
  render(screen, version, wallet) {
    this.body = new ThirdPartySigninContainer(version, "white", (data) =>
      getUserInfo(wallet, data)
    );
    this.scaffold = new Scaffold(this.header, this.body, this.footer);
    this.body.parent = this.scaffold;
    this.scaffold.view = screen;
  }
}

const landing = new Landing();
export default landing;
