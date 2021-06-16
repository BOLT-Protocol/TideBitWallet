import Form from "../widget/form";
import Header from "../layout/header";


/**
 * let fee = ui.getTransactionFee({ blockchainID, from, to, amount, data });
 * let transaction = ui.prepareTransaction({ to, amount, data, speed });
 * ui.sendTransaction(transaction);
 */

const transaction = (scaffold, state) => {
  const header = new Header(state);
  const form = new Form(state);
  header.render(scaffold.header);
  form.render( scaffold.body);
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
