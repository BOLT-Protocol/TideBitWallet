import header from "../layout/header";
import Input from "../widget/input";

/**
* let fee = ui.getTransactionFee({ blockchainID, from, to, amount, data });
* let transaction = ui.prepareTransaction({ to, amount, data, speed });
* ui.sendTransaction(transaction);
*/
const transaction = (scaffold, state) => {
  scaffold.header = header(state);
  const form = document.createElement("div");
  form.className = "form";
  scaffold.body = form;
  const _form = scaffold.body.children[0];
  console.log(_form);

  form.setAttribute(state?.account?.symbol || "ETH", ''); // -- test
  const addressInput = new Input(form, {
    inputType: "text",
    label: "Send to",
    errorMessage: "Invalid Address",
    validation: (value) => {
      return value.startsWith("0x");
    },
    action: {
      icon: `<i class="fas fa-qrcode"></i>`,
      onPressed: () => {
        console.log("action on pressed!");
      },
    },
  });
  const amountInput = new Input(form, {
    inputType: "number",
    label: "Amount",
    errorMessage: "Invalid Amount",
    validation: (value) => {
      return parseFloat(value) > 0;
    },
  });
  form.insertAdjacentHTML(
    "beforeend",
    `<p class="form__secondary-text form__align-end">
        <span>Balance:</span>
        <span>${state?.account?.balance || 2} ${state?.account?.symbol || 'ETH'}</span>
    </p>` // -- test
  );
  form.insertAdjacentHTML(
    "beforeend",
    `<p class="form__primary-text form__align-start">Transaction Fee</p>`
  );
  form.insertAdjacentHTML(
    "beforeend",
    `<p class="form__secondary-text form__align-start">
        <span>Processing time</span>
        <span class="estimate-time">10 ~ 30 minute</span>
    </p>`
  );
  form.insertAdjacentHTML(
    "beforeend",
    `<p class="form__tertiary-text form__align-start">Higher fees, faster transaction</p>`
  );
  /**
   * insert Tab
   */

  /**
   * getEstimateTime().then((timeString) => {
   *    const estimateTimeEl = document.querySelector('.estimate-time');
   *    estimateTimeEl.textContent = timeString;
   * }).catch((error) => {
   *    estimateTimeEl.textContent = "would take longer than you can expected";
   * })
   */
   form.insertAdjacentHTML(
    "beforeend",
    `<div class="form__column">
        <span class="form__tertiary-text">Estimated:</span>
        <span class="form__secondary-text estimate-fee">loading...</span>
    </div>`
  );
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
