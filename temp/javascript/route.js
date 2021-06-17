import overview from "../screen/overview";
import account from "../screen/account";
import transaction from "../screen/transaction";
import address from "../screen/address";
import bill from "../screen/bill";

const route = (state) => {

  switch (state.screen) {
    case "accounts":
    case "settings":
      overview(root, state);
      break;
    case "account":
      account(root, state);
      break;
    case "transaction":
      transaction(root, state);
      break;
    case "address":
      address(root, state);
      break;
    case "bill":
      bill(root, state);
      break;
  }
};

export default route;
