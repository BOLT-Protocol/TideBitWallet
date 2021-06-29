import AccountService from "./accountService";

/**
 @abstract
**/
class AccountServiceDecorator extends AccountService {
  service = null;

  get accountId() {
      return this.service.accountId;
  }

  get base() {
    return this.service.base;
  }
}

export default AccountServiceDecorator;
