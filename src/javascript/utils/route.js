import overview from "../screen/overview";
import account from "../screen/account";
import Scaffold from "../layout/scaffold";

customElements.define("scaffold-widget", Scaffold);

const setup = () => {
  document.body.replaceChildren();
  const root = document.createElement("scaffold-widget");
  document.body.insertAdjacentElement("afterbegin", root);
  return root;
};

const route = (state) => {
  const root = setup();
  switch (state.screen) {
    case "accounts":
    case "settings":
      overview(root, state);
      break;
    case "account":
    account(root, state);
  }
};

export default route;
