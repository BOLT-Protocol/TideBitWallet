import TransactionService from "./transactionService";

class TransactionServiceBase extends TransactionService {
  /**
   * @override
   */
  verifyAddress() {
    // Override by decorator
  }
  /**
   * @override
   */
  extractAddressData() {
    // Override by decorator
  }
  /**
   * @override
   */
  prepareTransaction() {
    // Override by decorator
  }
}

export default TransactionServiceBase;
