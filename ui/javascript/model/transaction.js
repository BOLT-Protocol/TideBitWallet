class Transaction {
  constructor({ publish, to, amount, priority, gasPrice, gasLimit, message }) {
    this.publish = publish;
    this.to = to;
    this.amount = amount;
    this.priority = priority;
    this.gasPrice = gasPrice;
    this.gasLimit = gasLimit;
    this.message = message;
  }
  // BTC
  // constructor({
  //     publish,
  //     to,
  //     amount,
  //     priority,
  //     message,
  // })
}

export default Transaction;
