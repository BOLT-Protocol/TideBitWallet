/**
 * @abstract
 * @property {string} id                    The transaction id
 * @property {string} direction             The direction
 * @property {BigNumber} amount             The amount
 * @property {string} status                The transaction status
 * @property {number} confirmations         The confirmations number
 * @property {string} address               The address is to or from address depending on direction
 * @property {BigNumber} fee                The fee
 * @property {string} txId                  The txId from API
 * @property {string} message               The transaction message
 * @property {string} sourceAddresses       The source addresses
 * @property {string} destinationAddresses  The destination addresses
 * @property {BigNumber} gasPrice           The gas price
 * @property {BigNumber} gasUsed            The gase used/limit
 */
export class Transaction {
  id;
  direction;
  amount;
  status;
  timestamp;
  confirmations;
  address;
  fee;
  txId;
  message;
  sourceAddresses;
  destinationAddresses;
  gasPrice;
  gasUsed;

  constructor(values) {
    Object.assign(this, values);
  }

  serializeTransaction() {}

  static createTransaction() {}
}

export const TRANSACTION_STATUS = {
  success: "success",
  fail: "fail",
  pending: "pending",
};

export const TRANSACTION_DIRECTION = {
  sent: "sent",
  received: "received",
  moved: "moved",
  unknown: "unknown",
};

export const TRANSACTION_PRIORITY = {
  slow: "slow",
  standard: "standard",
  fast: "fast",
};

/**
 * @property {number} v
 * @property {BigNumber} r
 * @property {BigNumber} s
 */
export class Signature {
  constructor({ v, r, s }) {
    this.v = v;
    this.r = r;
    this.s = s;
  }
}