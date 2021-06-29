import {
  Transaction,
  TRANSACTION_DIRECTION,
  TRANSACTION_STATUS,
  Signature,
} from "./tranasction.model";
import { encodeToRlp } from "../helpers/ethereumUtils";
import BigNumber from "bignumber.js";

class ETHTransaction extends Transaction {
  nonce;
  to;
  signature;

  constructor(values) {
    super(values);
    this.nonce = values.nonce;
    this.to = values.to;
    this.signature = values.signature;
  }

  serializeTransaction() {
    return encodeToRlp(this);
  }

  static createTransaction({
    from,
    to,
    amount,
    gasPrice,
    gasUsed,
    message,
    chainId,
    fee,
    nonce,
  }) {
    return new ETHTransaction({
      amount,
      gasPrice,
      gasUsed,
      message,
      chainId,
      direction: TRANSACTION_DIRECTION.sent,
      status: TRANSACTION_STATUS.pending,
      destinationAddresses: to,
      sourceAddresses: from,
      fee,
      nonce,
      to,
      signature: new Signature({
        v: chainId,
        r: BigNumber(0),
        s: BigNumber(0),
      }),
    });
  }
}

export default ETHTransaction;
