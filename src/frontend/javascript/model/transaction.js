class Transaction {
  constructor({ publish, to, amount, priority, feePerUnit, feeUnit, message }) {
    this.publish = publish;
    this.to = to;
    this.amount = amount;
    this.priority = priority
    this.feePerUnit = feePerUnit;
    this.feeUnit = feeUnit;
    this.message = message;
  }
}

export default Transaction;
