import * as utils from "../utils/utils";

class Bill {
  constructor({
    id,
    txid,
    amount,
    fee,
    note,
    timestamp,
    direction,
    sourceAddresses,
    destinationAddresses,
    confirmations,
    status,
  }) {
    this.id = id;
    this.txid = txid;
    this.amount = amount;
    this.fee = fee;
    this.message = note;
    this.timestamp = timestamp;
    this._direction = direction;
    this.from = sourceAddresses;
    this.to = destinationAddresses;
    this.confirmations = confirmations;
    this._status = status;
  }

  get dateTime() {
    return utils.dateFormatter(this.timestamp);
  }

  get status() {
    if (this._status === "fail") return "Failed";
    else if (this.confirmations === 0) return "Pending";
    else if (this.confirmations > 0 && this.confirmations <= 6)
      return "Confirming";
    else if (this.confirmations > 6) return "Completed";
    else return "Failed";
  }
  get action() {
    switch (this._direction) {
      case "receive":
      case "received":
        return "Receive";
      case "sent":
      case "send":
        return "Send";
      default:
        return "Unknown";
    }
  }
  get direction() {
    switch (this._direction) {
      case "receive":
      case "received":
        return "Receive from";
      case "sent":
      case "send":
        return "Transfer to";
      default:
        return "Unknown";
    }
  }
  get address() {
    switch (this._direction) {
      case "receive":
      case "received":
        return this.from;
      case "sent":
      case "send":
        return this.to;
      default:
        return "Unknown";
    }
  }
  get progress() {
    if (this.confirmations > 6) return "100%";
    return ((this.confirmations / 6) * 100).toString() + "%";
  }
  get sign() {
    switch (this._direction) {
      case "receive":
      case "received":
        return "+";
      case "sent":
      case "send":
        return "-";
      default:
        return "Unknown";
    }
  }
  formattedAmount(asset) {
    switch (this._direction) {
      case "receive":
      case "received":
        return this.sign + " " + this.amount + " " + asset.symbol;
      case "sent":
      case "send":
        return this.sign + " " + this.amount + " " + asset.symbol;
      default:
        return "Unknown";
    }
  }
}

export default Bill;
