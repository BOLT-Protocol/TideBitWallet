import Scaffold from "../layout/scaffold";
import Header from "../layout/header";
import Form from "../layout/form";
import { currentView } from "../utils/utils";

/**
 * let fee = ui.getTransactionFee({ blockchainID, from, to, amount, data });
 * let transaction = ui.prepareTransaction({ to, amount, data, speed });
 * ui.sendTransaction(transaction);
 */

class Transaction {
  constructor() {}
  sendTransaction = (transaction) => {
    console.log("to", transaction.to);
    console.log("amount", transaction.amount);
    console.log("priority", transaction.priority);
    console.log("gasPrice", transaction.gasPrice);
    console.log("gas", transaction.gas);
    this.scaffold.openPopover("success", "Success!");
  };
  initialize(screen, asset, fiat, wallet) {
    this.wallet = wallet;
    this.header = new Header(screen);
    this.form = new Form(wallet, asset, fiat, (val) =>
      this.scaffold.openPopover(
        "confirm",
        "Are you sure to make this transaction?",
        () => this.sendTransaction(val),
        false
      )
    );
    this.scaffold = new Scaffold(this.header, this.form);
  }
  render(screen, asset, fiat, wallet) {
    const view = currentView();
    if (!view || view !== "transaction" || !this.scaffold) {
      this.initialize(screen, asset, fiat, wallet);
    }
  }
}

const transaction = new Transaction();

/**
 * getEstimateTime().then((timeString) => {
 *    const estimateTimeEl = document.querySelector('.estimate-time');
 *    estimateTimeEl.textContent = timeString;
 * }).catch((error) => {
 *    estimateTimeEl.textContent = "would take longer than you can expected";
 * })
 */
/**
 * feeObj = {
 *    gasPrice: {
 *        fast: '',
 *        standard: '',
 *        slow: '',
 *    },
 *    gasLimit: 21000
 * }
 */
/**
 * getTransactionFee().then((feeObj) => {
 *    const estimateFeeEl = document.querySelector('.estimate-fee');
 *    ++ get Setected tab index
 *    estimateFeeEl.textContent = `${parseFloat(feeObj.gasPrice[1]) * gasLimit}`;
 * }).catch((error) => {
 *    estimateTimeEl.textContent = "would surprise you!";
 * })
 */

export default transaction;
