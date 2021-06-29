import TransactionService from "./transactionService";

/**
 @abstract
**/
class TransactionServiceDecorator extends TransactionService {
  service = null;

  get accountId() {
    return this.service.accountId;
  }

  get base() {
    return this.service.base;
  }

}

export default TransactionServiceDecorator;