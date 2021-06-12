import header from "../layout/header";
// let fee = ui.getTransactionFee({ blockchainID, from, to, amount, data });
// let transaction = ui.prepareTransaction({ to, amount, data, speed }); 
// ui.sendTransaction(transaction);
const transaction = (scaffold, state) => {
    console.log(JSON.stringify(state));
    scaffold.header = header(state);
}

export default transaction;