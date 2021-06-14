import header from "../layout/header";
import Input from "../widget/input";

// let fee = ui.getTransactionFee({ blockchainID, from, to, amount, data });
// let transaction = ui.prepareTransaction({ to, amount, data, speed });
// ui.sendTransaction(transaction);
const transaction = (scaffold, state) => {
  scaffold.header = header(state);
  const form = document.createElement("div");
  form.className = "form";
  scaffold.body = form;
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
};

export default transaction;
