import Scaffold from "../layout/scaffold";
import ThirdPartySigninContainer from "../layout/third_party_signin_container";
import { googleSignin, getInstallID } from "../utils/utils";

const getUserInfo = async (tidewallet, { mnemonic, passphrase } = {}) => {
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
    const dashboard = await tidewallet.overview();
    console.log(dashboard);
    const balance = dashboard?.balance;
    const assets = dashboard?.currencies?.map(
      (currency) =>
        new Asset({
          id: currency.accountcurrencyId,
          symbol: currency.symbol,
          network: "Did not provide", //++ ropsten, mainnet, testnet
          publish: true, //++ Boolean "Did not provide",
          image: currency.image,
          balance: currency.balance,
          inFiat: "0", //++ string "Did not provide",
        })
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
  render(screen, version, callback) {
    this.body = new ThirdPartySigninContainer(version, "white", callback);
    this.scaffold = new Scaffold(this.header, this.body, this.footer);
    this.body.parent = this.scaffold;
    this.scaffold.view = screen;
  }
}

const landing = new Landing();
export default landing;
