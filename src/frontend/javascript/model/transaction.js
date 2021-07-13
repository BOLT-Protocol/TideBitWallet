class Transaction {
  constructor({ to, amount, feePerUnit, feeUnit, fee, message }) {
    this.to = to;
    this.amount = amount;
    this.feePerUnit = feePerUnit;
    this.feeUnit = feeUnit;
    this.fee = fee;
    this.message = message;
  }
}

export default Transaction;
