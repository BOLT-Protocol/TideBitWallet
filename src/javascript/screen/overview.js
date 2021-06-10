import Scaffold from "../layout/scaffold";
import header from "../layout/header";
import bottomNavigator from "../layout/bottom_navigatior";

customElements.define("scaffold-widget", Scaffold);

const overview = (user, wallet) => {
  const scaffold = document.createElement("scaffold-widget");
  document.body.insertAdjacentElement("afterbegin", scaffold);
  scaffold.header = header(user.totalAsset, wallet.currency);
  scaffold.bottomNavigator =  bottomNavigator();
  // ============================================================
  // const scaffold = document.createElement("div");
  // scaffold.className = ".scaffold";
  // scaffold.insertAdjacentHTML(
  //   "afterbegin",
  //   header(user.totalAsset, wallet.currency)
  // );
  // scaffold.insertAdjacentHTML(bottomNavigator());
  // return scaffold;
};

export default overview;
