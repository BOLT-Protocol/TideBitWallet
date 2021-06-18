import Scaffold from "../layout/scaffold";
import Header from "../layout/header";
import Form from "../layout/form";

/**
 * let fee = ui.getTransactionFee({ blockchainID, from, to, amount, data });
 * let transaction = ui.prepareTransaction({ to, amount, data, speed });
 * ui.sendTransaction(transaction);
 */

const sendTransaction = (transaction) => {
  console.log("to", transaction.to);
  console.log("amount", transaction.amount);
  console.log("priority", transaction.priority);
  console.log("gasPrice", transaction.gasPrice);
  console.log("gas", transaction.gas);
  Scaffold.openPopover('success', 'Success!');
  // Scaffold.closePopover(2000);
};

const transaction = (state) => {
  const header = new Header(state);
  const form = new Form(state, (val) =>
    Scaffold.openPopover(
      "confirm",
      "Are you sure to make this transaction?",
      () => sendTransaction(val),
      false
    )
  );
  new Scaffold(header, form);
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
};

export default transaction;
