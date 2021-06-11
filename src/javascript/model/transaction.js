class transaction {
  constructor(id, txid, amount, direction, confirmation, timestamp, fee) {
    this.id = id;
    this.txid = txid;
    this.amount = amount;
    this.direction = direction;
    this.confirmation = confirmation;
    this.timestamp = timestamp;
    this.fee = fee;
  }
}
