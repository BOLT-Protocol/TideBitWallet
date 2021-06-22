import landing from "../screen/landing";
import overview from "../screen/overview";
import account from "../screen/asset";
import transaction from "../screen/transaction";
import address from "../screen/address";
import bill from "../screen/bill";
class Router {
  constructor(state) {
    this.state = JSON.parse(JSON.stringify(state));
  }
  route = (state) => {
    console.log(state);
    switch (state.screen) {
      case "landing":
        landing(state);
        break;
      case "accounts":
      case "settings":
        overview.render(state);
        break;
      case "account":
        account(state);
        break;
      case "transaction":
        transaction(state);
        break;
      case "address":
        address(state);
        break;
      case "bill":
        bill(state);
        break;
    }
  };
}

export default Router;
