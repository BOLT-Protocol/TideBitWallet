import BigNumber from "bignumber.js";
import Account from "./cores/Account";
import Trader from "./cores/Trader";
import User from "./cores/User";
import DBOperator from "./database/dbOperator";
import TideWalletCommunicator from "./cores/TideWalletCommunicator";
import TideWalletCore from "./cores/TideWalletCore";
import packageInfo from "../package.json";

class TideWallet {
  // eventType: ready, update, notice
  // notifier: { eventName: string, callback: function }
  notifiers = [];

  static Core = TideWalletCore;

  constructor() {
    return this;
  }

  async init({ user, api }) {
    const communicator = new TideWalletCommunicator(api);
    const db = new DBOperator();
    await db.init();
    const initObj = { TideWalletCommunicator: communicator, DBOperator: db };

    this.user = new User(initObj);

    const exist = await this.user.checkUser();
    if (!exist) {
      if (user.mnemonic && user.password) {
        this.core = await this.user.createUserWithSeed(
          user.OAuthID,
          seed,
          user.InstallID
        );
      } else {
        this.core = await this.user.createUser(user.OAuthID, user.InstallID);
      }
    }

    initObj.TideWalletCore = this.core;
    this.account = new Account(initObj);
    this.account.setMessenger();
    await this.account.init();

    this.trader = new Trader(initObj);
    await this.trader.getFiatList();

    const listener = this.account.messenger.subscribe((v) => {
      this.notice(v, "update");
    });
    return true;
  }

  on(eventName = "", callback) {
    if (typeof callback !== "function") return;
    const en = eventName.toLocaleLowerCase();
    let notifier = { callback };
    switch (en) {
      case "ready":
      case "update":
      case "notice":
        notifier.eventName = en;
        break;
    }
    return this.notifiers.push(notifier);
  }

  removeNotifier(notifierId) {
    delete this.notifiers[notifierId];
    return true;
  }

  async getWalletConfig() {
    const fiat = await this.trader.getSelectedFiat();
    const version = packageInfo.version;
    return { fiat, version };
  }

  async overview() {
    const currencies = await this.account.getAllCurrencies();
    const fiat = await this.trader.getSelectedFiat();
    const bnRate = fiat.exchangeRate;
    const balance = currencies.reduce((rs, curr) => {
      const bnBalance = new BigNumber(curr.balance);
      const bnRs = new BigNumber(rs);
      return bnRs
        .plus(
          this.trader.calculateToUSD({
            currencyId: curr.currencyId,
            amount: bnBalance,
          })
        )
        .toFixed();
    }, 0);
    const bnBalance = new BigNumber(balance);
    const balanceFiat = bnBalance.multipliedBy(bnRate).toFixed();

    const dashboard = {
      balance: balanceFiat,
      currencies,
    };
    return dashboard;
  }

  /**
   *
   * @param {object} accountInfo
   * @param {string} accountInfo.assetID
   */
  async getAssetDetail({ assetID }) {
    const asset = await this.account.getCurrencies(assetID);
    const transactions = await this.account.getTransactions(assetID);

    return { asset, transactions };
  }

  async getTransactionDetail({ assetID, transactionID }) {
    const txs = await this.account.getTransactions(assetID);
    const tx = txs.find((r) => r.txId === transactionID);
    return tx;
  }

  async getReceivingAddress({ accountID }) {
    const address = await this.account.getReceiveAddress(accountID);

    return address;
  }

  // ++ need help
  async getTransactionFee({ accountID, blockchainID, from, to, amount, data }) {
    const svc = this.account.getService(accountID);
    const fees = svc.getTransactionFee(blockchainID);

    return fees;
  }

  // need help
  async prepareTransaction() {}

  async sendTransaction({ accountID, blockchainID, transaction }) {
    const svc = this.account.getService(accountID);
    const res = svc.publishTransaction(blockchainID, transaction);

    return res;
  }

  async sync() {
    this.account.sync();
    return true;
  }

  async backup() {
    return this.user.getKeystore();
  }

  async close() {
    // release all resources
    this.account.close();
    for (const index in this.notifiers) {
      this.removeNotifier(index);
    }
    delete this.user;
    delete this.account;
    delete this.trader;
    return true;
  }

  notice(data, eventName = "") {
    const ev = eventName.toLocaleLowerCase();
    this.notifiers.forEach((notifier) => {
      if (!notifier) return;
      if (notifier.eventName !== ev) return;
      if (typeof notifier.callback !== "function") return;
      notifier.callback(data);
    });
  }
}

export default TideWallet;
