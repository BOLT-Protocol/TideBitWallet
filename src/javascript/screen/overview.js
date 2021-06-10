import header from "../layout/header";
import bottomNavigator from "../layout/bottom_navigatior";

// parentElement = document.querySelector(".scaffold");
const overview = (parentElement, user, wallet) => {
  header(parentElement, user.totalAsset, wallet.currency);
  bottomNavigator(parentElement);
};

export default overview;
