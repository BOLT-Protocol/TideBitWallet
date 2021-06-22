import account from "../screen/account";
import overview from "../screen/overview";
import { currentView } from "../utils/utils";

class ViewController {
  constructor(currentScreen, user, config) {
    this.currentAccount;
    this.currentBill;
    this.currentScreen = currentScreen;
    this.userBalanceInFiat = userBalanceInFiat;
    this.userAccounts = JSON.parse(JSON.stringify(user.accounts));
    this.walletFiat = JSON.parse(JSON.stringify(config.fiat));
    this.walletVersion = JSON.parse(JSON.stringify(config.version));
    this.walletMode = JSON.parse(JSON.stringify(config.mode));
  }
  updateAccounts = (accounts, userBalanceInFiat, walletFiat) => {
    this.userAccounts = JSON.parse(JSON.stringify(accounts));
    this.userBalanceInFiat = userBalanceInFiat;
    if (walletFiat) this.walletFiat = JSON.parse(JSON.stringify(walletFiat));
    const view = currentView();
    switch (view) {
      case "accounts":
      case "settings":
        overview.update(
          "OnUpdateCurrency",
          this.userBalanceInFiat,
          this.walletFiat,
          { accounts }
        );
        break;
      default:
        break;
    }
  };
  updateAccount = (account, userBalanceInFiat) => {
    this.userBalanceInFiat = userBalanceInFiat;
    const view = currentView();
    switch (view) {
      case "accounts":
      case "settings":
        overview.update(
          "OnUpdateAccount",
          this.userBalanceInFiat,
          this.walletFiat,
          { account }
        );
        break;
      case "acccount":
        // ++ 2021/6/22 Emily
        break;
      default:
        break;
    }
    overview.update("OnUpdateAccount", account);
  };
  updateBills = (bills) => {};
  updateBill = (bill) => {};
  updateAddress = (address) => {};
  route = (screen) => {
    switch (screen) {
      case "accounts":
      case "settings":
        overview.render(
          screen,
          this.userBalanceInFiat,
          this.userAccounts,
          this.walletFiat,
          this.walletVersion
        );
        break;
      case "account":
        account(data, this.walletFiat);
    }
  };
}

const viewController = new ViewController();

export default viewController;
