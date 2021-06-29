/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/background.js":
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ui_javascript_utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ui/javascript/utils/utils */ "./ui/javascript/utils/utils.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index */ "./src/index.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_index__WEBPACK_IMPORTED_MODULE_1__);


chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    InstallID: (0,_ui_javascript_utils_utils__WEBPACK_IMPORTED_MODULE_0__.randomHex)(32)
  });
});

/***/ }),

/***/ "./src/constants/config.js":
/*!*********************************!*\
  !*** ./src/constants/config.js ***!
  \*********************************/
/***/ ((module) => {

// const env = 'production';
const env = 'development';
const apiVersion = '/api/v1';
const apiKey = 'yourKey';
const apiSecret = 'yourSecret';
const url = env === 'production' ? 'https://service.tidewallet.io' : 'https://staging.tidewallet.io';
const network_publish = false; // const network_publish = true;

module.exports = {
  url: url + apiVersion,
  apiKey,
  apiSecret,
  installId: '',
  network_publish
};

/***/ }),

/***/ "./src/cores/Account.js":
/*!******************************!*\
  !*** ./src/cores/Account.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  Subject
} = __webpack_require__(/*! rxjs */ "rxjs");

const {
  ACCOUNT
} = __webpack_require__(/*! ../models/account.model */ "./src/models/account.model.js");

const AccountServiceBase = __webpack_require__(/*! ../services/accountServiceBase */ "./src/services/accountServiceBase.js");

const EthereumService = __webpack_require__(/*! ../services/ethereumService */ "./src/services/ethereumService.js");

const {
  network_publish
} = __webpack_require__(/*! ../constants/config */ "./src/constants/config.js");

const TransactionBase = __webpack_require__(/*! ../services/transactionService */ "./src/services/transactionService.js");

const ETHTransaction = __webpack_require__(/*! ../services/transactionServiceETH */ "./src/services/transactionServiceETH.js");

const BigNumber = __webpack_require__(/*! bignumber.js */ "bignumber.js");

class AccountCore {
  static instance;
  _currencies = {};
  _messenger = null;
  _settingOptions = [];
  _DBOperator = null;

  get currencies() {
    return this._currencies;
  }

  get messenger() {
    return this._messenger;
  }

  set currencies(currs) {
    this._currencies = currs;
  }

  get settingOptions() {
    return this._settingOptions;
  }

  set settingOptions(options) {
    this._settingOptions = options;
  }

  constructor({
    TideWalletCommunicator,
    DBOperator,
    TideWalletCore
  }) {
    if (!AccountCore.instance) {
      this._messenger = null;
      this._isInit = false;
      this._debugMode = false;
      this._services = [];
      this._DBOperator = DBOperator;
      this._TideWalletCommunicator = TideWalletCommunicator;
      this._TideWalletCore = TideWalletCore;
      AccountCore.instance = this;
    }

    return AccountCore.instance;
  }

  setMessenger() {
    this._messenger = new Subject();
  }

  async init(debugMode = false) {
    this._debugMode = debugMode;
    this._isInit = true;
    await this._initAccounts();
  }

  async _initAccounts() {
    const chains = await this._getNetworks(network_publish);
    const accounts = await this._getAccounts();
    await this._getSupportedCurrencies();

    for (const acc of accounts) {
      let blockIndex = chains.findIndex(chain => chain.networkId === acc.networkId);

      if (blockIndex > -1) {
        let svc;

        let _ACCOUNT;

        switch (chains[blockIndex].coinType) {
          case 60:
          case 603:
            svc = new EthereumService(new AccountServiceBase(this), this._TideWalletCommunicator, this._DBOperator);
            _ACCOUNT = ACCOUNT.ETH;
            break;

          case 8017:
            svc = new EthereumService(new AccountServiceBase(this), this._TideWalletCommunicator, this._DBOperator);
            _ACCOUNT = ACCOUNT.CFC;
            break;

          default:
        }

        if (svc && !this._currencies[acc.accountid]) {
          this._currencies[acc.accountId] = [];

          this._services.push(svc);

          svc.init(acc.accountId, _ACCOUNT);
          await svc.start();
        }
      }
    }

    this._addAccount(accounts);
  }
  /**
   * close all services
   * @method close
   */


  async sync() {
    if (this._isInit) {
      this._services.forEach(svc => {
        svc.synchro(true);
      });
    }
  }
  /**
   * close all services
   * @method close
   */


  close() {
    this._isInit = false;

    this._services.forEach(svc => {
      svc.stop();
    });

    delete this._services;
    this._services = [];
    delete this.accounts;
    this.accounts = [];
    delete this.currencies;
    this.currencies = {};
    delete this._settingOptions;
    this._settingOptions = [];
  }
  /**
   * Get service by accountId
   * @method getService
   * @param {string} accountId The accountId
   * @returns {Object} The service
   */


  getService(accountId) {
    return this._services.find(svc => svc.accountId === accountId);
  }

  async _getNetworks(publish = true) {
    let networks = await this._DBOperator.networkDao.findAllNetworks();

    if (!networks || networks.length < 1) {
      try {
        const res = await this._TideWalletCommunicator.BlockchainList();
        const enties = res.map(n => this._DBOperator.networkDao.entity({
          network_id: n["blockchain_id"],
          network: n["name"],
          coin_type: n["coin_type"],
          chain_id: n["network_id"],
          publish: n["publish"]
        }));
        networks = enties;
        await this._DBOperator.networkDao.insertNetworks(enties);
      } catch (error) {}
    }

    if (this._debugMode || !publish) {
      return networks;
    }

    if (publish) {
      return networks.filter(n => n.publish);
    }
  }

  async _getAccounts() {
    let result = await this._DBOperator.accountDao.findAllAccounts();

    if (result.length < 1) {
      result = await this._addAccount(result);
      return result;
    }

    return result;
  }

  async _addAccount(local) {
    try {
      const res = await this._TideWalletCommunicator.AccountList();
      let list = res ?? [];
      const user = await this._DBOperator.userDao.findUser();

      for (const account of list) {
        const id = account["account_id"];
        const exist = local.findIndex(el => el.accountId === id) > -1;

        if (!exist) {
          const entity = this._DBOperator.accountDao.entity({ ...account,
            user_id: user.userId,
            network_id: account["blockchain_id"]
          });

          await this._DBOperator.accountDao.insertAccount(entity);
          local.push(entity);
        }
      }
    } catch (error) {}

    return local;
  }

  async _getSupportedCurrencies() {
    const local = await this._DBOperator.currencyDao.findAllCurrencies();

    if (local.length < 1) {
      await this._addSupportedCurrencies(local);
    }
  }

  async _addSupportedCurrencies(local) {
    try {
      const res = await this._TideWalletCommunicator.CurrencyList();
      let list = res;
      list = list.filter(c => local.findIndex(l => l.currencyId === c["currency_id"] > -1)).map(c => this._DBOperator.currencyDao.entity(c));
      await this._DBOperator.currencyDao.insertCurrencies(list);
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * Get currency list by accountId
   * @method getCurrencies
   * @param {string} accountId The accountId
   * @returns {Array} The currency list
   */


  getCurrencies(accountId) {
    return this._currencies[accountId];
  }
  /**
   * Get all currency list
   * @method getAllCurrencies
   * @returns {Array} The currency list
   */


  getAllCurrencies() {
    return Object.values(this._currencies).reduce((list, curr) => list.concat(curr), []);
  }
  /**
   * Get transaction list by accountcurrencyId
   * @method getTransactions
   * @param {string} accountcurrencyId The accountcurrencyId
   * @returns {Array} The transaction list
   */


  async getTransactions(accountcurrencyId) {
    const txs = await this._DBOperator.transactionDao.findAllTransactionsById(accountcurrencyId);
    return txs;
  }
  /**
   * Get receive address by accountcurrencyId
   * @method getReceiveAddress
   * @param {string} accountId The accountId
   * @returns {string} The address
   */


  async getReceiveAddress(accountcurrencyId) {
    const svc = this.getService(accountcurrencyId);
    const address = await svc.getReceivingAddress(accountcurrencyId);
    return address;
  }
  /**
   * Send transaction
   * @method sendTransaction
   * @param {string} accountcurrencyId The accountcurrencyId
   * @param {object} param The transaction content
   * @param {number} param.amount
   * @param {string} param.to
   * @param {number} param.gasPrice
   * @param {number} param.gasUsed
   * @param {string} param.gasPrice
   * @param {number} param.keyIndex
   * @returns {boolean}} success
   */


  async sendTransaction(accountCurrency, {
    amount,
    to,
    gasPrice,
    gasUsed,
    message
  }) {
    let safeSigner;

    switch (accountCurrency.accountType) {
      case ACCOUNT.ETH:
      case ACCOUNT.CFC:
        safeSigner = this._TideWalletCore.getSafeSigner("m/84'/3324'/0'/0/0");
        const svc = this.getService(accountCurrency.accountId);
        const address = svc.getReceivingAddress(accountCurrency.accountcurrencyId);

        const account = this._accounts.find(acc => acc.accountId === svc.accountId);

        const nonce = await svc.getNonce(account.networkId, address);
        const txSvc = new ETHTransaction(new TransactionBase(), safeSigner);
        const signedTx = txSvc.prepareTransaction({
          amount: BigNumber(amount),
          to,
          gasPrice: BigNumber(gasPrice),
          gasUsed: BigNumber(gasUsed),
          message,
          nonce
        });
        const [success, tx] = await svc.publishTransaction(account.networkId, signedTx);
        console.log(signedTx); //-- debug info

        console.log(tx); //-- debug info

        return success;

      default:
        return null;
    }
  }

}

module.exports = AccountCore;

/***/ }),

/***/ "./src/cores/PaperWallet.js":
/*!**********************************!*\
  !*** ./src/cores/PaperWallet.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const keyStore = __webpack_require__(/*! key-store */ "key-store");

const bitcoin = __webpack_require__(/*! bitcoinjs-lib */ "bitcoinjs-lib");

const Cryptor = __webpack_require__(/*! ../helpers/Cryptor */ "./src/helpers/Cryptor.js");

class PaperWallet {
  static EXT_PATH = "m/84'/3324'/0'";
  static EXT_CHAININDEX = 0;
  static EXT_KEYINDEX = 0;
  static KEYSTOREID = 'keyObject';
  /**
   * keyObject: {
   *  metadata:
   *    { nonce: 'rFTRLcQhKxN4XoAql3u0NXxZ7P0Xy1h7', iterations: 10000 },
   *  public: {},
   *  private: 
   *    'wz+zDOrp7ZOUZVuG/7AfJM9GhgHXlsiXwg478GmTm9r3uFGOcFRzY2ldVN1cmSURI6YKJS2EjIMBSVh5caZcBg26sLA124+k2PPV+VrYFoYidTMvZG1XzdUQvkybP/cwQN9OedCO8fOyIwoYeqA1RGMVhjHyoqM7bdGdjknmDibrKj5pG+uu1CU+fbPVQ/TUMig='
   * }
   */

  /**
   * @method createWallet
   * @param {string} privateKey
   * @param {string} password
   * @returns {object} keyObject
   */

  static async createWallet(privateKey, password) {
    try {
      let storage = {};
      const keystore = keyStore.createStore(data => {
        storage = data;
      });
      await keystore.saveKey(PaperWallet.KEYSTOREID, password, privateKey);
      return storage;
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * @method recoverFromJson
   * @param {string} keyObjectJson
   * @param {string} password
   * @returns {string} privateKey
   */


  static recoverFromJson(keyObjectJson, password) {
    try {
      const keyObject = PaperWallet.jsonToWallet(keyObjectJson);
      let storage = {};
      const keystore = keyStore.createStore(data => {
        storage = data;
      }, keyObject);
      const pk = keystore.getPrivateKeyData(PaperWallet.KEYSTOREID, password);
      return pk;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  /**
   * @method updatePassword
   * @param {object} oriKeyObject
   * @param {string} oriPassword
   * @param {string} newPassword
   * @return {object} keyObject
   */


  static updatePassword(oriKeyObject, oriPassword, newPassword) {
    const pk = PaperWallet.recoverFromJson(PaperWallet.walletToJson(oriKeyObject), oriPassword);
    return PaperWallet.createWallet(pk.toString('hex'), newPassword);
  }
  /**
   * @method magicSeed
   * @param {string} pk
   * @returns {string} pk used keccak256 twice
   */


  static magicSeed(pk) {
    if (pk.length < 128) {
      return Cryptor.keccak256round(pk, 2);
    }

    return pk;
  }
  /**
   * @method getPubKey
   * @param {Buffer} seed bip seed
   * @param {number} chainIndex - integer for hdwallet chainIndex
   * @param {number} keyIndex - integer for hdwallet keyIndex
   * @param {object} options
   * @param {string} [path] - default EXT_PATH
   * @param {boolean} [compressed] - default true
   * @returns {string}
   */


  static getPubKey(seed, chainIndex, keyIndex, options = {}) {
    const {
      path = PaperWallet.EXT_PATH,
      compressed = true
    } = options;
    const dPath = `${path}/${chainIndex}/${keyIndex}`;
    const root = bitcoin.bip32.fromSeed(seed);
    const child = root.derivePath(dPath);

    if (!compressed) {
      return bitcoin.ECPair.fromPublicKey(child.publicKey, {
        compressed: false
      }).publicKey.toString('hex');
    }

    return child.publicKey.toString('hex');
  }
  /**
   * @method getPriKey
   * @param {Buffer} seed bip seed
   * @param {number} chainIndex - integer for hdwallet chainIndex
   * @param {number} keyIndex - integer for hdwallet keyIndex
   * @param {object} options
   * @param {string} [options.path] - default EXT_PATH
   * @returns {string}
   */


  static getPriKey(seed, chainIndex, keyIndex, options = {}) {
    const {
      path = PaperWallet.EXT_PATH
    } = options;
    const dPath = `${path}/${chainIndex}/${keyIndex}`;
    const root = bitcoin.bip32.fromSeed(seed);
    const child = root.derivePath(dPath);
    return child.privateKey.toString('hex');
  }
  /**
   * @method getExtendedPublicKey
   * @param {Buffer} seed 
   * @returns {string}
   */


  static getExtendedPublicKey(seed) {
    let root = bitcoin.bip32.fromSeed(seed);
    root = root.derivePath(PaperWallet.EXT_PATH);
    const xPub = root.neutered().toBase58();
    return xPub;
  }
  /**
   * @method walletToJson
   * @param {object} wallet - keyObject
   * @returns {string} wallet to string
   */


  static walletToJson(wallet) {
    return JSON.stringify(wallet);
  }
  /**
   * @method jsonToWallet
   * @param {string} walletStr - keyObject string
   * @returns {object} keyObject
   */


  static jsonToWallet(walletStr) {
    return JSON.parse(walletStr);
  }

}

module.exports = PaperWallet;

/***/ }),

/***/ "./src/cores/SafeSigner.js":
/*!*********************************!*\
  !*** ./src/cores/SafeSigner.js ***!
  \*********************************/
/***/ ((module) => {

class SafeSigner {
  constructor(signFunction) {
    this.signFunction = signFunction;
  }

  sign(data) {
    return this.signFunction(data);
  }

}

module.exports = SafeSigner;

/***/ }),

/***/ "./src/cores/Signer.js":
/*!*****************************!*\
  !*** ./src/cores/Signer.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "buffer")["Buffer"];
const EthUtils = __webpack_require__(/*! ethereumjs-util */ "ethereumjs-util");

const {
  BN,
  ecsign
} = EthUtils;
const ZERO32 = Buffer.alloc(32, 0);
const EC_GROUP_ORDER = Buffer.from('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141', 'hex');
const THROW_BAD_HASH = 'Expected Hash';
const THROW_BAD_PRIVATE = 'Expected Private';

class Signer {
  static instance;

  constructor() {
    if (!Signer.instance) {
      this._paperWallet = null;
      Signer.instance = this;
    }

    return Signer.instance;
  }
  /**
   * init
   * @param {TideWalletcore} TideWalletcore 
   * @returns 
   */


  init(TideWalletcore) {
    this._TideWalletcore = TideWalletcore;
  }

  static _isScalar(x) {
    return x.length == 32;
  }

  static _compare(a, b) {
    const aa = new BN(a);
    const bb = new BN(b);
    if (aa.eq(bb)) return 0;
    if (aa.gt(bb)) return 1;
    return -1;
  }

  static _isPrivate(x) {
    if (!Signer._isScalar(x)) return false;
    return Signer._compare(x, ZERO32) > 0 && // > 0
    Signer._compare(x, EC_GROUP_ORDER) < 0; // < G
  }

  static _sign(hashData, privateKey) {
    if (!Buffer.isBuffer(hashData) || !Signer._isScalar(hashData)) throw new Error(THROW_BAD_HASH);
    if (!Buffer.isBuffer(privateKey) || !Signer._isPrivate(privateKey)) throw new Error(THROW_BAD_PRIVATE);
    const sig = ecsign(hashData, privateKey);
    return sig;
  }

  async sign({
    keyPath,
    data
  }) {
    return this._TideWalletcore.signBuffer({
      keyPath,
      data
    });
  }

}

module.exports = Signer;

/***/ }),

/***/ "./src/cores/TideWalletCommunicator.js":
/*!*********************************************!*\
  !*** ./src/cores/TideWalletCommunicator.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const HTTPAgent = __webpack_require__(/*! ../helpers/httpAgent */ "./src/helpers/httpAgent.js");

class TideWalletCommunicator {
  static instance;

  constructor({
    apiURL,
    apiKey,
    apiSecret
  }) {
    if (!TideWalletCommunicator.instance) {
      if (!apiURL) throw new Error('Invalid apiURL');
      if (!apiKey) throw new Error('Invalid apiKey');
      if (!apiSecret) throw new Error('Invalid apiSecret');
      this.apiURL = apiURL;
      this.apiKey = apiKey;
      this.apiSecret = apiSecret;
      this.httpAgent = new HTTPAgent({
        apiURL
      });
      this.token;
      this.tokenSecret;
      TideWalletCommunicator.instance = this;
    }

    return TideWalletCommunicator.instance;
  } // 0. Get User ID and Secret

  /**
   * oathRegister
   * @param {string} installID 
   * @param {*} appUUID 
   * @param {*} extendPublicKey 
   * @param {*} fcmToken 
   * @returns 
   */


  async oathRegister(userIdentifier) {
    let userId = '';
    let userSecret = '';

    try {
      const body = {
        id: userIdentifier
      };
      const res = await this.httpAgent.post(this.apiURL + '/user/id', body);

      if (res.success) {
        userId = res.data['user_id'];
        userSecret = res.data['user_secret'];
      }

      return {
        userId,
        userSecret
      };
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 7. User Regist

  /**
   * register
   * @param {string} installID 
   * @param {string} appUUID 
   * @param {string} extendPublicKey 
   * @param {string} fcmToken
   * @returns {
   *  token: string,
   *  tokenSecret: string,
   *  userID: string
   * }
   */


  async register(installID, appUUID, extendPublicKey, fcmToken = '') {
    try {
      const body = {
        wallet_name: 'TideWallet3',
        extend_public_key: extendPublicKey,
        install_id: installID,
        app_uuid: appUUID,
        fcm_token: fcmToken
      };
      const res = await this.httpAgent.post(this.apiURL + '/user', body);

      if (res.success) {
        this.token = res.data.token;
        this.tokenSecret = res.data.tokenSecret;
        this.httpAgent.setToken(res.data.token);
        return {
          success: true,
          token: res.data.token,
          tokenSecret: res.data.tokenSecret,
          userID: res.data.user_id
        };
      }

      this.token = null;
      this.tokenSecret = null;
      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 9. User Token Verify

  /**
   * login
   * @param {string} token 
   * @param {string} tokenSecret 
   * @returns {
   *  userID: string,
   * }
   */


  async login(token, tokenSecret) {
    try {
      const res = await this.httpAgent.get(this.apiURL + '/token/verify?token=' + token);

      if (res.success) {
        this.token = token;
        this.tokenSecret = tokenSecret;
        this.httpAgent.setToken(token);
        return {
          userID: res.data.user_id
        };
      }

      this.token = null;
      this.tokenSecret = null;
      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 1. List Supported Blockchains

  /**
   * BlockchainList
   * @returns [{
   *  blockchain_id: string,
   *  name: string,
   *  coin_type: number,
   *  network_id: number,
   *  publish: boolean
   * }]
   */


  async BlockchainList() {
    try {
      const res = await this.httpAgent.get(this.apiURL + '/blockchain');

      if (res.success) {
        return res.data;
      }

      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 2. Get Blockchain Detail

  /**
   * BlockchainDetail
   * @param {string} blockchainID 
   * @returns {
   *  blockchain_id: string,
   *  name: string,
   *  coin_type: number,
   *  network_id: number,
   *  publish: boolean
   * }
   */


  async BlockchainDetail(blockchainID) {
    try {
      if (!blockchainID) return {
        message: 'invalid input'
      };
      const res = await this.httpAgent.get(this.apiURL + '/blockchain/' + blockchainID);

      if (res.success) {
        return res.data;
      }

      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 3. List Supported Currencies

  /**
   * CurrencyList
   * @returns [{
   *  currency_id: string,
   *  blockchain_id: string,
   *  name: string,
   *  symbol: stirng,
   *  type: number,
   *  description: string,
   *  publish: boolean,
   *  address: string | null,
   *  decimals: number,
   *  total_supply: string | null,
   *  exchange_rate: string,
   *  contract: string | null,
   *  icon": string
   * }]
   */


  async CurrencyList() {
    try {
      const res = await this.httpAgent.get(this.apiURL + '/currency');

      if (res.success) {
        return res.data;
      }

      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 4. Get Currency Detail

  /**
   * CurrencyDetail
   * @param {*} currencyID 
   * @returns {
   *  currency_id: string,
   *  blockchain_id: string,
   *  name: string,
   *  symbol: stirng,
   *  type: number,
   *  description: string,
   *  publish: boolean,
   *  address: string | null,
   *  decimals: number,
   *  total_supply: string | null,
   *  exchange_rate: string,
   *  contract: string | null,
   *  icon": string
   * }
   */


  async CurrencyDetail(currencyID) {
    try {
      if (!currencyID) return {
        message: 'invalid input'
      };
      const res = await this.httpAgent.get(this.apiURL + '/currency/' + currencyID);

      if (res.success) {
        return res.data;
      }

      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 5. List Supported Tokens

  /**
   * TokenList
   * @param {string} blockchainID 
   * @returns [{
   *  currency_id: string,
   *  blockchain_id: stirng,
   *  name: string,
   *  symbol: string,
   *  type: number,
   *  description: string,
   *  publish: boolean
   *  address: string | null,
   *  decimals: number,
   *  total_supply: string,
   *  exchange_rate: string | null,
   *  contract: string,
   *  icon": string
   * }]
   */


  async TokenList(blockchainID) {
    try {
      const res = await this.httpAgent.get(this.apiURL + '/blockchain/' + blockchainID + '/token');

      if (res.success) {
        return res.data;
      }

      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 6. Get Token Detail

  /**
   * TokenDetail
   * @param {string} blockchainID 
   * @param {string} currencyID 
   * @returns {
   *  currency_id: string,
   *  blockchain_id: stirng,
   *  name: string,
   *  symbol: string,
   *  type: number,
   *  description: string,
   *  publish: boolean
   *  address: string | null,
   *  decimals: number,
   *  total_supply: string,
   *  exchange_rate: string | null,
   *  contract: string,
   *  icon": string
   * }
   */


  async TokenDetail(blockchainID, currencyID) {
    try {
      const res = await this.httpAgent.get(this.apiURL + '/blockchain/' + blockchainID + '/token/' + currencyID);

      if (res.success) {
        return res.data;
      }

      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 10. User Token Renew

  /**
   * AccessTokenRenew
   * @returns {
   *  token: string,
   *  tokenSecret: string
   * }
   */


  async AccessTokenRenew({
    token,
    tokenSecret
  }) {
    try {
      const body = {
        token,
        tokenSecret
      };
      const res = await this.httpAgent.post(this.apiURL + '/token/renew', body);

      if (res.success) {
        this.token = res.data.token;
        this.tokenSecret = res.data.tokenSecret;
        this.httpAgent.setToken(this.token);
        return res.data;
      }

      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 11. Account Token Regist

  /**
   * TokenRegist
   * @param {string} blockchainID 
   * @param {string} contractAddress 
   * @returns {
   *  token_id: string
   * }
   */


  async TokenRegist(blockchainID, contractAddress) {
    try {
      if (!blockchainID || !contractAddress) return {
        message: 'invalid input'
      };
      if (!this.httpAgent.getToken()) return {
        message: 'need login'
      };
      const res = await this.httpAgent.post(this.apiURL + '/wallet/blockchain/' + blockchainID + '/contract/' + contractAddress, {});

      if (res.success) {
        return res.data;
      }

      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 12. Get Account List

  /**
   * AccountList
   * @returns [{
   *  blockchain_id: string,
   *  currency_id: string,
   *  purpose: number,
   *  account_index: string,
   *  curve_type: number,
   *  number_of_external_key: number,
   *  number_of_internal_key: number,
   *  balance: string,
   *  tokens: [tokenDetail]
   * }]
   */


  async AccountList() {
    try {
      if (!this.httpAgent.getToken()) return {
        message: 'need login'
      };
      console.log(this.apiURL + '/wallet/accounts');
      const res = await this.httpAgent.get(this.apiURL + '/wallet/accounts');

      if (res.success) {
        return res.data;
      }

      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 13. Get Account Detail

  /**
   * AccountDetail
   * @param {string} accountID 
   * @returns {
   *  blockchain_id: string,
   *  currency_id: string,
   *  purpose: number,
   *  account_index: string,
   *  curve_type: number,
   *  number_of_external_key: number,
   *  number_of_internal_key: number,
   *  balance: string,
   *  tokens: [tokenDetail]
   * }
   */


  async AccountDetail(accountID) {
    try {
      if (!accountID) return {
        message: 'invalid input'
      };
      if (!this.httpAgent.getToken()) return {
        message: 'need login'
      };
      const res = await this.httpAgent.get(this.apiURL + '/wallet/account/' + accountID);

      if (res.success) {
        return res.data;
      }

      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 14. Get Receive Address

  /**
   * AccountReceive
   * @param {string} accountID 
   * @returns {
   *  address: string,
   *  keyIndex: number
   * }
   */


  async AccountReceive(accountID) {
    try {
      if (!accountID) return {
        message: 'invalid input'
      };
      if (!this.httpAgent.getToken()) return {
        message: 'need login'
      };
      const res = await this.httpAgent.get(this.apiURL + '/wallet/account/address/' + accountID + '/receive');

      if (res.success) {
        return res.data;
      }

      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 15. Get Change Address

  /**
   * AccountChange
   * @param {string} accountID 
   * @returns {
   *  address: string,
   *  keyIndex: number
   * }
   */


  async AccountChange(accountID) {
    try {
      if (!accountID) return {
        message: 'invalid input'
      };
      if (!this.httpAgent.getToken()) return {
        message: 'need login'
      };
      const res = await this.httpAgent.get(this.apiURL + '/wallet/account/address/' + accountID + '/change');

      if (res.success) {
        return res.data;
      }

      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 16. List Transactions

  /**
   * ListTransactions
   * @param {string} accountID 
   * @returns [{
   *   txid: string,
   *   status: string,
   *   confirmations: number,
   *   amount: string,
   *   blockchain_id: string,
   *   symbol: string,
   *   direction: string,
   *   timestamp: number,
   *   source_addresses: array<string>,
   *   destination_addresses: string,
   *   fee: string,
   *   gas_price: string | null,
   *   gas_used: string | null
   * }]
   */


  async ListTransactions(accountID) {
    try {
      if (!accountID) return {
        message: 'invalid input'
      };
      if (!this.httpAgent.getToken()) return {
        message: 'need login'
      };
      const res = await this.httpAgent.get(this.apiURL + '/wallet/account/txs/' + accountID);

      if (res.success) {
        return res.data;
      }

      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 17. Get Transaction Detail（暫時保留，與 list 資料重複性太高）

  /**
   * TransactionDetail
   * @param {string} txid 
   * @returns {
   *   txid: string,
   *   status: string,
   *   confirmations: number,
   *   amount: string,
   *   blockchain_id: string,
   *   symbol: string,
   *   direction: string,
   *   timestamp: number,
   *   source_addresses: array<string>,
   *   destination_addresses: string,
   *   fee: string,
   *   gas_price: string | null,
   *   gas_used: string | null
   * }
   */


  async TransactionDetail(txid) {
    try {
      if (!txid) return {
        message: 'invalid input'
      };
      if (!this.httpAgent.getToken()) return {
        message: 'need login'
      };
      const res = await this.httpAgent.get(this.apiURL + '/wallet/account/tx/' + txid);

      if (res.success) {
        return res.data;
      }

      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 18. List Unspent Transaction Outputs

  /**
   * GetUTXO
   * @param {string} accountID 
   * @returns [{
   *   txid: string
   *   vout: number
   *   type: string
   *   amount: string
   *   script: string
   *   timestamp: number
   * }]
   */


  async GetUTXO(accountID) {
    try {
      if (!accountID) return {
        message: 'invalid input'
      };
      if (!this.httpAgent.getToken()) return {
        message: 'need login'
      };
      const res = await this.httpAgent.get(this.apiURL + '/wallet/account/txs/uxto/' + accountID);

      if (res.success) {
        return res.data;
      }

      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 19. Get Fee

  /**
   * GetFee
   * @param {string} blockchainID 
   * @returns {
   *  slow: string,
   *  standard: string,
   *  fast: string
   * }
   */


  async GetFee(blockchainID) {
    try {
      if (!blockchainID) return {
        message: 'invalid input'
      };
      const res = await this.httpAgent.get(this.apiURL + '/blockchain/' + blockchainID + '/fee');

      if (res.success) {
        return res.data;
      }

      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 20. Get Gas Limit

  /**
   * GetGasLimit
   * @param {string} blockchainID 
   * @param {string} fromAddress 
   * @param {string} toAddress 
   * @param {string} value 
   * @param {string} data 
   * @returns {
   *  gasLimit: string
   * }
   */


  async GetGasLimit(blockchainID, body) {
    try {
      const {
        fromAddress,
        toAddress,
        value,
        data
      } = body;
      if (!blockchainID || !fromAddress || !toAddress || !value || !data) return {
        message: 'invalid input'
      };
      const res = await this.httpAgent.post(this.apiURL + '/blockchain/' + blockchainID + '/gas-limit', body);

      if (res.success) {
        return res.data;
      }

      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 21. Get Nonce

  /**
   * GetNonce
   * @param {string} blockchainID 
   * @param {string} address 
   * @returns {
   *  nonce: string
   * }
   */


  async GetNonce(blockchainID, address) {
    try {
      if (!blockchainID || !address) return {
        message: 'invalid input'
      };
      if (!this.httpAgent.getToken()) return {
        message: 'need login'
      };
      const res = await this.httpAgent.get(this.apiURL + '/blockchain/' + blockchainID + '/address/' + address + '/nonce');

      if (res.success) {
        return res.data;
      }

      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 22. Publish Transaction

  /**
   * PublishTransaction
   * @param {string} blockchainID 
   * @param {string} accountID 
   * @param {string} hex - transaction hex string
   * @returns {}
   */


  async PublishTransaction(blockchainID, body) {
    try {
      const {
        hex
      } = body;
      if (!hex) return {
        message: 'invalid input'
      };
      if (!this.httpAgent.getToken()) return {
        message: 'need login'
      };
      const res = await this.httpAgent.post(this.apiURL + '/blockchain/' + blockchainID + '/push-tx/', body);

      if (res.success) {
        return res.data;
      }

      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 23. List Fiat Currency Rate

  /**
   * FiatsRate
   * @returns [{
   *  currency_id: string,
   *  name: string,
   *  rate: string
   * }]
   */


  async FiatsRate() {
    try {
      const res = await this.httpAgent.get(this.apiURL + '/fiats/rate');

      if (res.success) {
        return res.data;
      }

      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 24. List Crypto Currency Rate

  /**
   * CryptoRate
   * @returns [{
   *  currency_id: string,
   *  name: string,
   *  rate: string
   * }]
   */


  async CryptoRate() {
    try {
      const res = await this.httpAgent.get(this.apiURL + '/crypto/rate');

      if (res.success) {
        return res.data;
      }

      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  } // 25. Get Token Info

  /**
   * TokenInfo
   * @param {string} blockchainID 
   * @param {string} contractAddress 
   * @returns {
   *  symbol: string,
   *  name": string,
   *  contract: string,
   *  decimal: number
   *  total_supply: string,
   *  description: string | null,
   *  imageUrl: string
   * }
   */


  async TokenInfo(blockchainID, contractAddress) {
    try {
      if (!blockchainID || !contractAddress) return {
        message: 'invalid input'
      };
      const res = await this.httpAgent.get(this.apiURL + '/blockchain/' + blockchainID + '/contract/' + contractAddress);

      if (res.success) {
        return res.data;
      }

      return Promise.reject({
        message: res.message,
        code: res.code
      });
    } catch (error) {
      return Promise.reject({
        message: error
      });
    }
  }

}

module.exports = TideWalletCommunicator;

/***/ }),

/***/ "./src/cores/TideWalletCore.js":
/*!*************************************!*\
  !*** ./src/cores/TideWalletCore.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "buffer")["Buffer"];
const PaperWallet = __webpack_require__(/*! ./PaperWallet */ "./src/cores/PaperWallet.js");

const Signer = __webpack_require__(/*! ./Signer */ "./src/cores/Signer.js");

const SafeSigner = __webpack_require__(/*! ./SafeSigner */ "./src/cores/SafeSigner.js");

const Cryptor = __webpack_require__(/*! ../helpers/Cryptor */ "./src/helpers/Cryptor.js");

const rlp = __webpack_require__(/*! ../helpers/rlp */ "./src/helpers/rlp.js");

class TideWalletCore {
  static instance;

  constructor() {
    if (!TideWalletCore.instance) {
      this._userInfo = {};
      TideWalletCore.instance = this;
    }

    return TideWalletCore.instance;
  }
  /**
   * initial
   * @param {Object} userInfo
   * @param {String} userInfo.id
   * @param {String} userInfo.thirdPartyId
   * @param {String} userInfo.installId
   * @param {Number} userInfo.timestamp
   * @param {string} userInfo.keystore
   * @returns 
   */


  setUserInfo(userInfo) {
    this._userInfo = userInfo;
    console.log(userInfo);
  }
  /**
   * get nonce
   * @param {String} userIdentifier
   * @returns {String}
   */


  _getNonce(userIdentifier) {
    const cafeca = 0xcafeca;
    let nonce = cafeca;

    const getString = nonce => Cryptor.keccak256round(Buffer.concat([Buffer.from(userIdentifier, "utf8"), rlp.toBuffer(nonce)]).toString("hex"), 1).slice(0, 3).toLowerCase();

    while (getString(nonce) != "cfc") {
      nonce = Number(nonce) + 1;
    }

    return nonce;
  }
  /**
   * get password
   * @param {Object} userInfo
   * @param {String} userInfo.userIdentifier
   * @param {String} userInfo.userId
   * @param {String} userInfo.installId
   * @param {Number} userInfo.timestamp
   * @returns {String} password
   */


  _getPassword({
    userIdentifier,
    userId,
    installId,
    timestamp
  }) {
    const userIdentifierBuff = Buffer.from(userIdentifier, "utf8").toString("hex");
    const installIdBuff = Buffer.from(installId).toString("hex");
    const pwseed = Cryptor.keccak256round(Buffer.concat([Buffer.from(Cryptor.keccak256round(Buffer.concat([Buffer.from(Cryptor.keccak256round(userIdentifierBuff || this._userInfo.thirdPartyId, 1)), Buffer.from(Cryptor.keccak256round(userId || this._userInfo.id, 1))]).toString())), Buffer.from(Cryptor.keccak256round(Buffer.concat([Buffer.from(Cryptor.keccak256round(rlp.toBuffer(rlp.toBuffer(timestamp).toString("hex").slice(3, 6)).toString("hex"), 1)), Buffer.from(Cryptor.keccak256round(installIdBuff || this._userInfo.installId, 1))]).toString()))]).toString());
    const password = Cryptor.keccak256round(pwseed);
    return password;
  }

  _generateUserSeed({
    userIdentifier,
    userId,
    userSecret
  }) {
    const nonce = this._getNonce(userIdentifier);

    const userIdentifierBuff = Buffer.from(userIdentifier, "utf8").toString("hex");

    const _main = Buffer.concat([Buffer.from(userIdentifierBuff, "utf8"), rlp.toBuffer(nonce)]).toString().slice(0, 16);

    const _extend = Cryptor.keccak256round(rlp.toBuffer(nonce).toString("hex"), 1).slice(0, 8);

    const seed = Cryptor.keccak256round(Buffer.concat([Buffer.from(Cryptor.keccak256round(Buffer.concat([Buffer.from(Cryptor.keccak256round(_main, 1)), Buffer.from(Cryptor.keccak256round(_extend, 1))]).toString())), Buffer.from(Cryptor.keccak256round(Buffer.concat([Buffer.from(Cryptor.keccak256round(userId, 1)), Buffer.from(Cryptor.keccak256round(userSecret, 1))]).toString()))]).toString());
    return {
      seed,
      _extend
    };
  }
  /**
   * generate Credential Data
   * @param {Object} userInfo
   * @param {String} userInfo.userIdentifier
   * @param {String} userInfo.userId
   * @param {String} userInfo.userSecret
   * @param {String} userInfo.installId
   * @param {Number} userInfo.timestamp
   * @returns {Object} result
   * @returns {String} result.key
   * @returns {String} result.password
   * @returns {String} result.extend
   */


  _generateCredentialData({
    userIdentifier,
    userId,
    userSecret,
    installId,
    timestamp
  }) {
    const {
      seed,
      _extend
    } = this._generateUserSeed({
      userIdentifier,
      userId,
      userSecret
    });

    const key = Cryptor.keccak256round(seed);

    const password = this._getPassword({
      userIdentifier,
      userId,
      installId,
      timestamp
    });

    return {
      key,
      password,
      extend: _extend
    };
  }
  /**
   * createWallet
   * @param {Object} userInfo
   * @param {String} userInfo.userIdentifier
   * @param {String} userInfo.userId
   * @param {String} userInfo.userSecret
   * @param {String} userInfo.installId
   * @param {Number} userInfo.timestamp
   * @returns {Object} result
   * @returns {object} result.wallet - keyObject
   * @returns {String} result.extendPublicKey
   */


  async createWallet({
    userIdentifier,
    userId,
    userSecret,
    installId,
    timestamp
  }) {
    const credentialData = this._generateCredentialData({
      userIdentifier,
      userId,
      userSecret,
      installId,
      timestamp
    });

    const wallet = await PaperWallet.createWallet(credentialData.key, credentialData.password);
    const privateKey = PaperWallet.recoverFromJson(PaperWallet.walletToJson(wallet), credentialData.password);
    const seed = await PaperWallet.magicSeed(privateKey);

    const _seed = Buffer.from(seed);

    const extendPublicKey = PaperWallet.getExtendedPublicKey(_seed);
    return {
      wallet,
      extendPublicKey
    };
  }
  /**
   * createWalletWithSeed
   * @param {Object} userInfo
   * @param {String} userInfo.seed
   * @param {String} userInfo.userIdentifier
   * @param {String} userInfo.userId
   * @param {String} userInfo.installId
   * @param {Number} userInfo.timestamp
   * @returns {Object} result
   * @returns {object} result.wallet - keyObject
   * @returns {String} result.extendPublicKey
   */


  async createWalletWithSeed({
    seed,
    userIdentifier,
    userId,
    installId,
    timestamp
  }) {
    const password = this._getPassword({
      userIdentifier,
      userId,
      installId,
      timestamp
    });

    const wallet = await PaperWallet.createWallet(seed, password);

    const _seed = Buffer.from(seed);

    const extendPublicKey = PaperWallet.getExtendedPublicKey(_seed);
    return {
      wallet,
      extendPublicKey
    };
  }
  /**
   * _getSeedByKeyStore
   * @returns {string} seed
   */


  async _getSeedByKeyStore() {
    const password = this._getPassword({
      userIdentifier: this._userInfo.thirdPartyId,
      userId: this._userInfo.id,
      installId: this._userInfo.installId,
      timestamp: this._userInfo.timestamp
    });

    const keystore = this._userInfo.keystore;
    const pk = PaperWallet.recoverFromJson(keystore, password);
    const seed = PaperWallet.magicSeed(pk);
    return seed;
  }
  /**
   * getExtendedPublicKey
   * @returns {string} extPK
   */


  async getExtendedPublicKey() {
    const seed = await this._getSeedByKeyStore();
    const extPK = PaperWallet.getExtendedPublicKey(Buffer.from(seed));
    return extPK;
  }

  getSafeSigner(keyPath) {
    const safeSigner = new SafeSigner(data => {
      return this.signBuffer({
        keyPath,
        data
      });
    });
  } //////////////////////////////////////////////////////////////////////
  // /**
  //  * 
  //  * @param {object} param
  //  * @param {object} param.keyPath
  //  * @param {number} param.keyPath.chainIndex
  //  * @param {number} param.keyPath.keyIndex
  //  * @param {Buffer} param.buffer -  hash data buffer
  //  * @returns 
  //  */
  // async sign({ keyPath, buffer }) {
  //   return this._signer.sign(buffer, keyPath.chainIndex, keyPath.keyIndex);
  // }

  /**
   * 
   * @param {object} param
   * @param {string} param.keyPath
   * @param {Buffer} param.data -  hash data buffer
   * @returns 
   */


  async signBuffer({
    keyPath,
    data
  }) {
    const {
      chainIndex,
      keyIndex,
      options
    } = Cryptor.pathParse(keyPath);
    const seed = await this._getSeedByKeyStore();
    const privateKey = PaperWallet.getPriKey(Buffer.from(seed, 'hex'), chainIndex, keyIndex, options);
    return Signer._sign(data, Buffer.from(privateKey, 'hex'));
  }

  async signData({
    keyPath,
    jsonData
  }) {
    return true;
  }

  async signTransaction({
    keyPath,
    coinType,
    value,
    data
  }) {
    return true;
  }

}

module.exports = TideWalletCore;

/***/ }),

/***/ "./src/cores/Trader.js":
/*!*****************************!*\
  !*** ./src/cores/Trader.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const BigNumber = __webpack_require__(/*! bignumber.js */ "bignumber.js");

class Trader {
  static syncInterval = 24 * 60 * 60 * 1000;
  static instance;

  constructor({
    TideWalletCommunicator,
    DBOperator
  }) {
    if (!Trader.instance) {
      this._fiats = [];
      this._cryptos = [];
      this._TideWalletCommunicator = TideWalletCommunicator;
      this._DBOperator = DBOperator;
      Trader.instance = this;
    }

    return Trader.instance;
  }

  async getFiatList() {
    const local = await this._DBOperator.exchangeRateDao.findAllExchageRates();
    const now = Date.now();

    if (!Array.isArray(local) || !local[0] || now - local[0].lastSyncTime > Trader.syncInterval) {
      try {
        const fiats = await this._TideWalletCommunicator.FiatsRate();
        const cryptos = await this._TideWalletCommunicator.CryptoRate();
        const rates = [...fiats.map(e => this._DBOperator.exchangeRateDao.entity({ ...e,
          timestamp: now,
          type: 'fiat'
        })), ...cryptos.map(e => this._DBOperator.exchangeRateDao.entity({ ...e,
          timestamp: now,
          type: 'currency'
        }))];
        await this._DBOperator.exchangeRateDao.insertExchangeRates(rates);
        this._fiats = fiats.map(r => ({
          currencyId: r.currency_id,
          name: r.name,
          exchangeRate: new BigNumber(r.rate)
        }));
        this._cryptos = cryptos.map(r => ({
          currencyId: r.currency_id,
          name: r.name,
          exchangeRate: new BigNumber(r.rate)
        }));
      } catch (error) {
        console.log(error);
      }
    } else {
      this._fiats = local.filter(rate => rate.type === 'fiat').map(r => ({
        currencyId: r.exchangeRateId,
        name: r.name,
        exchangeRate: new BigNumber(r.rate)
      }));
      this._cryptos = local.filter(rate => rate.type === 'currency').map(r => ({
        currencyId: r.exchangeRateId,
        name: r.name,
        exchangeRate: new BigNumber(r.rate)
      }));
    }

    return this._fiats;
  }
  /**
   * 
   * @param {object} fiat
   * @param {string} fiat.name
   */


  setSelectedFiat(fiat) {
    this._DBOperator.prefDao.setSelectedFiat(fiat.name);
  }

  async getSelectedFiat() {
    const name = await this._DBOperator.prefDao.getSelectedFiat();
    if (name == null || name == undefined) return this._fiats[0];

    const fiat = this._fiats.find(f => f.name === name);

    return fiat;
  }
  /**
   * calculateToUSD
   * @param {object} _currency
   * @param {string} _currency.currencyId
   * @param {BigNumber} _currency.amount
   * @returns {BigNumber} 
   */


  calculateToUSD(_currency) {
    const crypto = this._cryptos.find(c => c.currencyId === _currency.currencyId);

    if (!crypto) return new BigNumber(0);
    const bnAmount = _currency.amount;
    const bnExCh = new BigNumber(crypto.exchangeRate);
    return bnAmount.multipliedBy(bnExCh);
  }
  /**
   * calculateUSDToCurrency
   * @param {object} _currency
   * @param {string} _currency.currencyId
   * @param {BigNumber} amountInUSD 
   * @returns {BigNumber}
   */


  calculateUSDToCurrency(_currency, amountInUSD) {
    const crypto = this._cryptos.find(c => c.currencyId === _currency.currencyId);

    if (!crypto) return new BigNumber(0);
    const bnAmountInUSD = amountInUSD;
    const bnExCh = new BigNumber(crypto.exchangeRate);
    return bnAmountInUSD.dividedBy(bnExCh);
  }
  /**
   * calculateAmountToUSD
   * @param {object} _currency
   * @param {string} _currency.currencyId
   * @param {BigNumber} amount 
   * @returns {BigNumber}
   */


  calculateAmountToUSD(_currency, amount) {
    const crypto = this._cryptos.find(c => c.currencyId === _currency.currencyId);

    if (!crypto) return new BigNumber(0);
    const bnAmount = amount;
    const bnExCh = new BigNumber(crypto.exchangeRate);
    return bnAmount.multipliedBy(bnExCh);
  }
  /**
   * 
   * @param {object} sellCurrency
   * @param {string} sellCurrency.currencyId
   * @param {object} buyCurrency
   * @param {string} buyCurrency.currencyId
   * @param {BigNumber} sellAmount 
   * @returns {object} result
   * @returns {BigNumber} result.buyAmount
   * @returns {BigNumber} result.exchangeRate
   */


  getSwapRateAndAmount(sellCurrency, buyCurrency, sellAmount) {
    // const sellCryptos = this._cryptos.find((c) => c.currencyId == sellCurrency.currencyId);
    // const buyCryptos = this._cryptos.find((c) => c.currencyId == buyCurrency.currencyId);
    // console.log(
    //     `sellCryptos ${sellCryptos.name} [${sellCryptos.currencyId}]: ${sellCryptos.exchangeRate}`);
    // console.log(
    //     `buyCryptos ${buyCryptos.name} [${buyCryptos.currencyId}]: ${buyCryptos.exchangeRate}`);
    const exchangeRate = this.calculateUSDToCurrency(buyCurrency, this.calculateAmountToUSD(sellCurrency, new BigNumber(1)));
    const buyAmount = this.calculateUSDToCurrency(buyCurrency, sellAmount.multipliedBy(exchangeRate));
    console.log('buyAmount.toFixed():', buyAmount.toFixed());
    console.log('exchangeRate.toFixed():', exchangeRate.toFixed());
    return {
      buyAmount,
      exchangeRate
    };
  }

}

module.exports = Trader;

/***/ }),

/***/ "./src/cores/User.js":
/*!***************************!*\
  !*** ./src/cores/User.js ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const PaperWallet = __webpack_require__(/*! ./PaperWallet */ "./src/cores/PaperWallet.js");

const TideWalletCore = __webpack_require__(/*! ./TideWalletCore */ "./src/cores/TideWalletCore.js");

const config = __webpack_require__(/*! ../constants/config */ "./src/constants/config.js");

const Mnemonic = __webpack_require__(/*! ../helpers/Mnemonic */ "./src/helpers/Mnemonic/index.js");

class User {
  constructor({
    TideWalletCommunicator,
    DBOperator
  }) {
    this.id = null;
    this.thirdPartyId = null;
    this.installId = null;
    this.timestamp = null;
    this.isBackup = false;
    this._communicator = TideWalletCommunicator;
    this._DBOperator = DBOperator;
    this._TideWalletCore = new TideWalletCore();
  }
  /**
   * check user
   * @returns {boolean}
   */


  async checkUser() {
    // TODO: find user table
    const user = await this._DBOperator.userDao.findUser(); // TODO: Remove this log

    console.log("checkUser: ", user);

    if (user) {
      await this._initUser(user);
      return true;
    }

    return false;
  }
  /**
   * create user
   * @param {String} userIdentifier
   * @param {String} _installId
   * @returns {Boolean} success
   */


  async createUser(userIdentifier, _installId = "") {
    const installId = config.installId || _installId;
    const user = await this._getUser(userIdentifier);
    const userId = user[0];
    const userSecret = user[1];
    const timestamp = Math.floor(new Date() / 1000);
    const {
      wallet,
      extendPublicKey: extPK
    } = await this._TideWalletCore.createWallet({
      userIdentifier,
      userId,
      userSecret,
      installId,
      timestamp
    });
    const success = await this._registerUser({
      extendPublicKey: extPK,
      installId,
      wallet,
      userId,
      userIdentifier,
      timestamp
    });
    return this._TideWalletCore;
  }
  /**
   * get user
   * @param {String} userIdentifier
   * @returns {String[]} [userId, userSecret]
   */


  async _getUser(userIdentifier) {
    let userId = "";
    let userSecret = "";

    try {
      const _res = await this._communicator.oathRegister(userIdentifier);

      userId = _res.userId;
      userSecret = _res.userSecret;
    } catch (error) {
      console.log('_getUser:', error);
    }

    return [userId, userSecret];
  }
  /**
   * register user
   * @param {Object} userInfo
   * @param {String} userInfo.extendPublicKey
   * @param {String} userInfo.installId
   * @param {object} userInfo.wallet
   * @param {String} userInfo.userId
   * @param {String} userInfo.userIdentifier
   * @param {Number} userInfo.timestamp
   * @returns {String[]} [userId, userSecret]
   */


  async _registerUser({
    extendPublicKey,
    installId,
    wallet,
    userId,
    userIdentifier,
    timestamp
  }) {
    const payload = {
      wallet_name: "TideWallet3",
      // ++ inform backend to update [Emily 04/01/2021]
      extend_public_key: extendPublicKey,
      install_id: installId,
      app_uuid: installId
    };
    console.log('_registerUser With: ', payload);

    try {
      const res = await this._communicator.register(installId, installId, extendPublicKey);
      await this._DBOperator.prefDao.setAuthItem(res.token, res.tokenSecret);
      const keystore = await PaperWallet.walletToJson(wallet);

      const user = this._DBOperator.userDao.entity({
        user_id: userId,
        keystore,
        third_party_id: userIdentifier,
        install_id: installId,
        timestamp,
        backup_status: false
      });

      await this._DBOperator.userDao.insertUser(user);
      await this._initUser(user);
      return true;
    } catch (error) {
      console.log('_registerUser:', error);
      return false;
    }
  }
  /**
   * create user with seed
   * @param {String} userIdentifier
   * @param {String} seed
   * @returns {Boolean} success
   */


  async createUserWithSeed(userIdentifier, seed, _installId = "") {
    const installId = config.installId || _installId;
    const user = await this._getUser(userIdentifier);
    const userId = user[0];
    const timestamp = Math.floor(new Date() / 1000);
    const {
      wallet,
      extendPublicKey: extPK
    } = await this._TideWalletCore.createWalletWithSeed({
      seed,
      userIdentifier,
      userId,
      installId,
      timestamp
    });
    const success = await this._registerUser({
      extendPublicKey: extPK,
      installId,
      wallet,
      userId,
      userIdentifier,
      timestamp
    });
    return this._TideWalletCore;
  }
  /**
   * verify password -
   * @param {String} password
   * @returns {} not
   */


  verifyPassword(password) {// return _seasonedPassword(password) == this._passwordHash;
  }
  /**
   * update password - Deprecated
   * @param {String} oldPassword
   * @param {String} newpassword
   * @returns {}
   */


  async updatePassword(oldPassword, newpassword) {
    const user = await this._DBOperator.userDao.findUser();
    const wallet = await this.restorePaperWallet(user.keystore, oldPassword);
  }
  /**
   * valid PaperWallet
   * @param {String} wallet
   * @returns {}
   */


  validPaperWallet(wallet) {
    try {
      let v = wallet;
      if (typeof wallet === "string") v = PaperWallet.jsonToWallet(wallet);
      return v.keyObject.private != null;
    } catch (e) {
      console.warn(e);
    }

    return false;
  }
  /**
   * jsonToWallet
   * @param {String} keystore
   * @param {String} pwd
   * @returns {WalletObject} wallet
   */


  async restorePaperWallet(keystore, pwd) {
    try {
      const w = PaperWallet.jsonToWallet(keystore); // valid pwd

      PaperWallet.recoverFromJson(keystore, pwd);
      return w;
    } catch (e) {
      return null;
    }
  }
  /**
   * checkWalletBackup
   * @param {String} oldPassword
   * @param {String} newpassword
   * @returns isBackup
   */


  async checkWalletBackup() {
    const _user = await this._DBOperator.userDao.findUser();

    if (_user != null) {
      return _user.backupStatus;
    }

    return false;
  }
  /**
   * backup wallet
   * @returns {Boolean} isBackup
   */


  async backupWallet() {
    try {
      const _user = await this._DBOperator.userDao.findUser(); // TODO: updateUser condition


      await this._DBOperator.userDao.updateUser({
        backupStatus: true
      });
      this.isBackup = true;
    } catch (e) {
      console.warn(e);
    }

    return this.isBackup;
  }
  /**
   * init user
   * @param {object} user - db user table
   */


  async _initUser(user) {
    this.id = user.userId;
    this.thirdPartyId = user.thirdPartyId;
    this.installId = user.installId;
    this.timestamp = user.timestamp;
    this.isBackup = user.backupStatus;
    const userInfo = {
      id: user.userId,
      thirdPartyId: user.thirdPartyId,
      installId: user.installId,
      timestamp: user.timestamp,
      keystore: user.keystore
    };

    this._TideWalletCore.setUserInfo(userInfo);

    const item = await this._DBOperator.prefDao.getAuthItem();

    if (item != null) {
      let _token = item.token;
      let _tokenSecret = item.tokenSecret;

      try {
        await this._communicator.AccessTokenRenew({
          token: _token,
          tokenSecret: _tokenSecret
        });
        await this._communicator.login(_token, _tokenSecret);
      } catch (e) {
        console.trace(e);
        const res = await this._communicator.register(this.installId, this.installId, await this._TideWalletCore.getExtendedPublicKey());

        if (res.token) {
          _token = res.token;
          _tokenSecret = res.tokenSecret;
          await this._DBOperator.prefDao.setAuthItem(_token, _tokenSecret);
        }
      } // verify, if not verify, set token null


      await this._communicator.login(_token, _tokenSecret);
    }
  }
  /**
   * init user
   * @param {String} password
   * @returns {}
   */


  _seasonedPassword(password) {// const tmp = Cryptor.keccak256round(password, 3);
    // const bytes = Buffer.from(tmp);
    // return String.fromCharCodes(bytes);
    // TODO: _prefManager.getAuthItem and check is auth, or HTTPAgent().setToken(token);
  }
  /**
   * get keystore
   * @returns {String} keystore
   */


  async getKeystore() {
    const user = await this._DBOperator.userDao.findUser();
    return user.keystore;
  }
  /**
   * delete keystore
   * @returns {Boolean}
   */


  async deleteUser() {
    const user = await this._DBOperator.userDao.findUser();
    const item = await this._DBOperator.userDao.deleteUser(user);
    if (item < 0) return false; // await this._prefManager.clearAll();

    return true;
  }

  mnemonicToSeed(mnemonic, password) {
    const m = new Mnemonic();
    return m.mnemonicToSeed(mnemonic, password);
  }

}

module.exports = User;

/***/ }),

/***/ "./src/database/dbOperator.js":
/*!************************************!*\
  !*** ./src/database/dbOperator.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const IndexedDB = __webpack_require__(/*! ./indexedDB */ "./src/database/indexedDB/index.js");

const {
  isBrowser
} = __webpack_require__(/*! ../helpers/env */ "./src/helpers/env.js");

class DBOperator {
  static instance;
  database = null;
  _isInit = false;

  get userDao() {
    return this.database.userDao;
  }

  get accountDao() {
    return this.database.accountDao;
  }

  get currencyDao() {
    return this.database.currencyDao;
  }

  get transactionDao() {
    return this.database.transactionDao;
  }

  get networkDao() {
    return this.database.networkDao;
  }

  get accountCurrencyDao() {
    return this.database.accountCurrencyDao;
  }

  get utxoDao() {
    return this.database.utxoDao;
  }

  get exchangeRateDao() {
    return this.database.exchangeRateDao;
  }

  get prefDao() {
    return this.database.prefDao;
  }

  constructor() {
    if (!DBOperator.instance) {
      DBOperator.instance = this;
    }

    return DBOperator.instance;
  }

  async init(inMemory = false) {
    if (this._isInit) return;
    this.database = isBrowser() ? new IndexedDB() : null;
    this._isInit = true;
    return this.database.init();
  }

  down() {
    if (!this.database) return;
    this.database.close();
  }

}

module.exports = DBOperator;

/***/ }),

/***/ "./src/database/indexedDB/index.js":
/*!*****************************************!*\
  !*** ./src/database/indexedDB/index.js ***!
  \*****************************************/
/***/ ((module) => {

const DB_NAME = "tidebitwallet";
const DB_VERSION = 1;
const OBJ_ACCOUNT = "account";
const OBJ_TX = "transaction";
const OBJ_UTXO = "utxo";
const OBJ_USER = "user";
const OBJ_CURRENCY = "currency";
const OBJ_NETWORK = "network";
const OBJ_ACCOUNT_CURRENCY = "accountcurrency";
const OBJ_EXCHANGE_RATE = "exchange_rate";
const OBJ_PREF = "pref"; // primary key ?

function _uuid() {
  var d = Date.now();

  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    d += performance.now();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : r & 0x3 | 0x8).toString(16);
  });
}

class IndexedDB {
  constructor() {}

  db = null;
  _userDao = null;
  _accountDao = null;
  _currencyDao = null;
  _networkDao = null;
  _txDao = null;
  _accountcurrencyDao = null;
  _utxoDao = null;
  _exchangeRateDao = null;
  _prefDao = null;

  init() {
    return this._createDB();
  }

  _createDB(dbName = DB_NAME, dbVersion = DB_VERSION) {
    const request = indexedDB.open(dbName, dbVersion);
    return new Promise((resolve, reject) => {
      //on upgrade needed
      request.onupgradeneeded = e => {
        this.db = e.target.result;

        this._createTable(dbVersion);
      };

      request.onsuccess = e => {
        this.db = e.target.result;
        this._userDao = new UserDao(this.db, OBJ_USER);
        this._accountDao = new AccountDao(this.db, OBJ_ACCOUNT);
        this._currencyDao = new CurrencyDao(this.db, OBJ_CURRENCY);
        this._networkDao = new NetworkDao(this.db, OBJ_NETWORK);
        this._txDao = new TransactionDao(this.db, OBJ_TX);
        this._utxoDao = new UtxoDao(this.db, OBJ_UTXO);
        this._accountcurrencyDao = new AccountCurrencyDao(this.db, OBJ_ACCOUNT_CURRENCY);
        this._exchangeRateDao = new ExchangeRateDao(this.db, OBJ_EXCHANGE_RATE);
        this._prefDao = new PrefDao(this.db, OBJ_PREF);
        resolve(this.db);
      };

      request.onerror = e => {
        reject(this.db);
      };
    });
  }

  _createTable(version) {
    if (version <= 1) {
      const accounts = this.db.createObjectStore(OBJ_ACCOUNT, {
        keyPath: "accountId"
      });
      const txs = this.db.createObjectStore(OBJ_TX, {
        keyPath: "transactionId"
      });
      let txIndex = txs.createIndex("accountcurrencyId", "accountcurrencyId");
      const currency = this.db.createObjectStore(OBJ_CURRENCY, {
        keyPath: "currencyId"
      });
      let currencyIndex = currency.createIndex("accountId", "accountId");
      const user = this.db.createObjectStore(OBJ_USER, {
        keyPath: "userId"
      });
      const network = this.db.createObjectStore(OBJ_NETWORK, {
        keyPath: "networkId"
      });
      const utxo = this.db.createObjectStore(OBJ_UTXO, {
        keyPath: "utxoId"
      });
      const accountcurrency = this.db.createObjectStore(OBJ_ACCOUNT_CURRENCY, {
        keyPath: "accountcurrencyId"
      });
      let accountcurrencyIndex = accountcurrency.createIndex("accountId", "accountId");
      const rate = this.db.createObjectStore(OBJ_EXCHANGE_RATE, {
        keyPath: "exchangeRateId"
      });
      const pref = this.db.createObjectStore(OBJ_PREF, {
        keyPath: "prefId"
      });
    }
  }

  close() {
    this.db.close();
  }

  get userDao() {
    return this._userDao;
  }

  get accountDao() {
    return this._accountDao;
  }

  get currencyDao() {
    return this._currencyDao;
  }

  get accountCurrencyDao() {
    return this._accountcurrencyDao;
  }

  get networkDao() {
    return this._networkDao;
  }

  get exchangeRateDao() {
    return this._exchangeRateDao;
  }

  get transactionDao() {
    return this._txDao;
  }

  get utxo() {
    // TODO:
    return this._utxoDao;
  }

  get prefDao() {
    return this._prefDao;
  }

}

class DAO {
  constructor(db, name) {
    this._db = db;
    this._name = name;
  }

  entity() {}
  /**
   *
   * @param {Object} data The entity return value
   * @param {Object} [options]
   */


  _write(data, options) {
    return new Promise((resolve, reject) => {
      const tx = this._db.transaction(this._name, "readwrite"); // const request = tx.objectStore(this._name).add(data);


      const request = tx.objectStore(this._name).put(data);

      request.onsuccess = e => {
        resolve(true);
      };

      request.onerror = e => {
        console.log("Write DB Error: " + e.error);
        reject(false);
      };

      tx.onabort = () => {
        console.log("Write DB Error: Transaction Abort");
        reject(false);
      };
    });
  }

  _writeAll(entities) {
    return new Promise((resolve, reject) => {
      const tx = this._db.transaction(this._name, "readwrite");

      entities.forEach(entity => {
        tx.objectStore(this._name).put(entity);
      });

      tx.oncomplete = e => {
        resolve(true);
      };

      tx.onabort = e => {
        reject(false);
      };
    });
  }

  _read(value = null, index) {
    return new Promise((resolve, reject) => {
      const tx = this._db.transaction(this._name, "readonly");

      const store = tx.objectStore(this._name);

      if (index) {
        store = store.index(index);
      }

      let request;

      if (!value) {
        request = store.openCursor();

        request.onsuccess = e => {
          if (e.target.result) {
            resolve(e.target.result.value);
          } else {
            resolve(null);
          }
        };
      } else {
        request = store.get(value);

        request.onsuccess = e => {
          resolve(e.target.result);
        };
      }

      request.onerror = e => {
        console.log("Read DB Error: " + e.error);
        reject(e.error);
      };
    });
  }

  _readAll(value = null, index) {
    return new Promise((resolve, reject) => {
      const tx = this._db.transaction(this._name, "readonly");

      let store = tx.objectStore(this._name);

      if (index) {
        store = store.index(index);
      }

      const request = store.getAll(value);

      request.onsuccess = e => {
        resolve(e.target.result);
      };

      request.onerror = e => {
        console.log("Read DB Error: " + e.error);
        reject(e.error);
      };
    });
  }

  _update() {
    return new Promise((resolve, reject) => {
      const tx = this._db.transaction(this._name, "readwrite");

      const request = tx.objectStore(this._name).put(data);

      request.onsuccess = e => {
        resolve(true);
      };

      request.onerror = e => {
        console.log("Update DB Error: " + e.error);
        reject(false);
      };

      tx.onabort = () => {
        console.log("Update DB Error: Transaction Abort");
        reject(false);
      };
    });
  }

  _delete(key) {
    return new Promise((resolve, reject) => {
      let store = this._db.transaction(this._name, "readwrite").objectStore(this._name);

      const request = store.delete(key);

      request.onsuccess = e => {
        resolve(true);
      };

      request.onerror = e => {
        reject(false);
      };
    });
  }

  _deleteAll() {
    let store = this._db.transaction(this._name, "readwrite").objectStore(this._name);

    store.clear();
  }

}

class UserDao extends DAO {
  constructor(db, name) {
    super(db, name);
  }
  /**
   * @override
   */


  entity({
    user_id,
    third_party_id,
    install_id,
    timestamp,
    backup_status,
    keystore
  }) {
    return {
      userId: user_id,
      keystore,
      thirdPartyId: third_party_id,
      installId: install_id,
      timestamp,
      backupStatus: backup_status,
      keystore
    };
  }

  findUser() {
    return this._read();
  }

  insertUser(userEntity) {
    return this._write(userEntity);
  }

  updateUser(userEntity) {
    return this._write(userEntity);
  }

  deleteUser() {
    return this._delete(1);
  }

}

class AccountDao extends DAO {
  constructor(db, name) {
    super(db, name);
  }
  /**
   * @override
   */


  entity({
    account_id,
    user_id,
    network_id,
    account_index
  }) {
    return {
      accountId: account_id,
      userId: user_id,
      networkId: network_id,
      accountIndex: account_index
    };
  }

  findAllAccounts() {
    return this._readAll();
  }

  findAccount(accountId) {
    return this._read(accountId);
  }

  insertAccount(accountEntiry) {
    return this._write(accountEntiry);
  }

  insertAccounts(accounts) {
    return this._writeAll(accounts);
  }

}

class CurrencyDao extends DAO {
  /**
   * @override
   */
  entity({
    currency_id,
    name,
    description,
    symbol,
    decimals,
    // address,
    total_supply,
    contract,
    type,
    icon
  }) {
    const _type = type === 0 ? "fiat" : type === 1 ? "currency" : "token";

    return {
      currencyId: currency_id,
      name,
      description,
      symbol,
      decimals,
      address: contract,
      totalSupply: total_supply,
      contract,
      type: _type,
      image: icon
    };
  }

  constructor(db, name) {
    super(db, name);
  }

  insertCurrency(currencyEntity) {
    return this._write(currencyEntity);
  }

  insertCurrencies(currencies) {
    return this._writeAll(currencies);
  }

  findAllCurrencies() {
    return this._readAll();
  }

  findAllCurrenciesByAccountId(accountId) {
    return this._readAll(accountId, "accountId");
  }

}

class NetworkDao extends DAO {
  /**
   * @override
   */
  entity({
    network_id,
    network,
    coin_type,
    publish,
    chain_id
  }) {
    return {
      networkId: network_id,
      network,
      coinType: coin_type,
      publish,
      chainId: chain_id
    };
  }

  constructor(db, name) {
    super(db, name);
  }

  findAllNetworks() {
    return this._readAll();
  }

  insertNetworks(networks) {
    return this._writeAll(networks);
  }

}

class TransactionDao extends DAO {
  /**
   * @override
   */
  entity({
    accountcurrencyId,
    txid,
    confirmations,
    source_addresses,
    destination_addresses,
    gas_price,
    gas_limit,
    note,
    fee,
    status,
    timestamp,
    direction,
    amount
  }) {
    return {
      transactionId: accountcurrencyId + txid,
      accountcurrencyId: accountcurrencyId,
      txId: txid,
      confirmation: confirmations,
      sourceAddress: source_addresses,
      destinctionAddress: destination_addresses,
      gasPrice: gas_price,
      gasUsed: gas_limit,
      note,
      fee,
      status,
      timestamp,
      direction,
      amount
    };
  }

  findAllTransactionsById(acId) {
    return this._readAll(acId, "accountcurrencyId");
  }

  insertTransaction(entity) {
    return this._write(entity);
  }

  updateTransaction(entity) {
    return this._update(entity);
  }

  insertTransactions(txs) {
    return this._writeAll(txs);
  }

}

class AccountCurrencyDao extends DAO {
  entity({
    // accountcurrency_id,
    account_id,
    currency_id,
    balance,
    number_of_used_external_key,
    number_of_used_internal_key,
    last_sync_time,
    token_id,
    account_token_id,
    image,
    symbol
  }) {
    return {
      accountcurrencyId: account_token_id ?? account_id,
      accountId: account_id,
      currencyId: currency_id ?? token_id,
      balance,
      numberOfUsedExternalKey: number_of_used_external_key,
      numberOfUsedInternalKey: number_of_used_internal_key,
      lastSyncTime: last_sync_time,
      image,
      symbol
    };
  }

  constructor(db, name) {
    super(db, name);
  }

  findOneByAccountyId(id) {
    return this._read(id);
  }

  findAllCurrencies() {
    return this._readAll();
  }

  findJoinedByAccountId(accountId) {
    return this._readAll(accountId, "accountId");
  }

  insertAccount(entity) {
    return this._write(entity);
  }

  insertCurrencies(currencies) {
    return this._writeAll(currencies);
  }

}

class ExchangeRateDao extends DAO {
  entity({
    currency_id,
    name,
    rate,
    timestamp,
    type
  }) {
    return {
      exchangeRateId: currency_id,
      name,
      rate,
      lastSyncTime: timestamp,
      type
    };
  }

  constructor(db, name) {
    super(db, name);
  }

  insertExchangeRates(rates) {
    return this._writeAll(rates);
  }

  findAllExchageRates() {
    return this._readAll();
  }

}

class UtxoDao extends DAO {
  constructor(db, name) {
    super(db, name);
  }

}

class PrefDao extends DAO {
  static AUTH_ITEM_KEY = 1;
  static SELECTED_FIAT_KEY = 2;

  entity({
    token,
    tokenSecret
  }) {
    return {
      prefId: PrefDao.AUTH_ITEM_KEY,
      token,
      tokenSecret
    };
  }

  constructor(db, name) {
    super(db, name);
  }

  async getAuthItem() {
    const result = await this._read(PrefDao.AUTH_ITEM_KEY);
    return result;
  }

  setAuthItem(token, tokenSecret) {
    return this._write({
      prefId: PrefDao.AUTH_ITEM_KEY,
      token,
      tokenSecret
    });
  }

  async getSelectedFiat() {
    const result = await this._read(PrefDao.SELECTED_FIAT_KEY);
    return result;
  }

  setSelectedFiat(name) {
    return this._write({
      prefId: PrefDao.SELECTED_FIAT_KEY,
      name
    });
  }

} // *************************************************** //
// if only use on browser, comment out this line
// *************************************************** //


module.exports = IndexedDB; // *************************************************** //
// If not only using on browser, comment out this line
// *************************************************** //
// window.IndexedDB = IndexedDB;

/***/ }),

/***/ "./src/helpers/Cryptor.js":
/*!********************************!*\
  !*** ./src/helpers/Cryptor.js ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "buffer")["Buffer"];
const {
  utils
} = __webpack_require__(/*! web3 */ "web3");

const EthUtils = __webpack_require__(/*! ethereumjs-util */ "ethereumjs-util");

const {
  BN
} = EthUtils; // ++ use native functions

class Cryptor {
  static keccak256round(str, round = 2) {
    let result = str.replace('0x', '');

    if (round > 0) {
      result = utils.sha3('0x' + result);
      return Cryptor.keccak256round(result, round - 1);
    }

    return result;
  }

  static randomBytes(length) {
    let hexStr = '';

    if (length > 0) {
      hexStr = utils.randomHex(length).substr(2);
    }

    return Buffer.from(hexStr, 'hex');
  }

  static pathParse(keyPath) {
    if (typeof keyPath !== 'string') throw new Error('keyPath should be string'); // keyPath = "m/84'/3324'/0'/0/0"

    const arr = keyPath.split('/');
    const chainIndex = arr[4];
    const keyIndex = arr[5];
    const options = {
      path: `${arr[0]}/${arr[1]}/${arr[2]}`
    };
    return {
      chainIndex,
      keyIndex,
      options
    };
  }

}

module.exports = Cryptor;

/***/ }),

/***/ "./src/helpers/Mnemonic/index.js":
/*!***************************************!*\
  !*** ./src/helpers/Mnemonic/index.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const bip39 = __webpack_require__(/*! bip39 */ "bip39");

class Mnemonic {
  /**
   * @method checkMnemonicVaildity
   * @param {string} mnemonic
   * @returns {boolean} valid
   */
  checkMnemonicVaildity(mnemonic) {
    return bip39.validateMnemonic(mnemonic);
  }
  /**
   * @method mnemonicToSeed
   * @param {string} mnemonic
   * @param {string} password
   * @returns {Buffer} seed
   */


  mnemonicToSeed(mnemonic, password) {
    const seed = bip39.mnemonicToSeedSync(mnemonic, password);
    return seed;
  }

}

module.exports = Mnemonic;

/***/ }),

/***/ "./src/helpers/env.js":
/*!****************************!*\
  !*** ./src/helpers/env.js ***!
  \****************************/
/***/ ((module) => {

var isBrowser = function () {
  try {
    return this === window;
  } catch (e) {
    return false;
  }
};

module.exports = {
  isBrowser
};

/***/ }),

/***/ "./src/helpers/ethereumUtils.js":
/*!**************************************!*\
  !*** ./src/helpers/ethereumUtils.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "buffer")["Buffer"];
const rlp = __webpack_require__(/*! rlp */ "rlp");
/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
 */


var isAddress = function (address) {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // check if it has the basic requirements of an address
    return false;
  } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
    // If it's all small caps or all all caps, return true
    return true;
  } else {
    // Otherwise check each case
    return isChecksumAddress(address);
  }
};
/**
 * Checks if the given string is a checksummed address
 *
 * @method isChecksumAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
 */


var isChecksumAddress = function (address) {
  // Check each case
  address = address.replace("0x", "");
  var addressHash = sha3(address.toLowerCase());

  for (var i = 0; i < 40; i++) {
    // the nth letter should be uppercase if the nth digit of casemap is 1
    if (parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i] || parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i]) {
      return false;
    }
  }

  return true;
};

function verifyEthereumAddress(address) {
  if (address.contains(":")) {
    address = address.split(":")[1];
  }

  return isAddress(address);
}
/**
 * RLP encode ETH Transation
 * @method encodeToRlp
 * @param {ETHTransaction} transaction The ETHTransaction
 * @returns {Buffer} rlp
 */


function encodeToRlp(transaction) {
  const list = [Buffer.from(transaction.nonce.toString(16)), transaction.gasPrice.toString(16), transaction.gasUsed.toString(16)].map(v => `0x${v}`);

  if (transaction.to) {
    list.push(transaction.to);
  } else {
    list.push("");
  }

  list.push(`0x${transaction.amount.toString(16)}`);

  if (transaction.message) {
    list.push(transaction.message);
  } else {
    list.push("");
  }

  if (transaction.signature) {
    list.push(transaction.signature.v);
    list.push(transaction.signature.r.toNumber());
    list.push(transaction.signature.s.toNumber());
  }

  return rlp.encode(list);
}

function getEthereumAddressBytes(address) {
  return Buffer.from(address, "hex");
}

module.exports = {
  encodeToRlp,
  verifyEthereumAddress,
  getEthereumAddressBytes
};

/***/ }),

/***/ "./src/helpers/httpAgent.js":
/*!**********************************!*\
  !*** ./src/helpers/httpAgent.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const axios = __webpack_require__(/*! axios */ "axios");

const {
  url
} = __webpack_require__(/*! ../constants/config */ "./src/constants/config.js");

class HTTPAgent {
  static instance;

  constructor({
    apiURL = ''
  } = {}) {
    this.url = apiURL || url;

    if (!HTTPAgent.instance) {
      this.axios = axios.create({
        baseURL: this.url
      });
      HTTPAgent.instance = this;
    }

    return HTTPAgent.instance;
  }

  setInterceptor() {// TODO: retry, logger?
  }

  setToken(token) {
    this.axios.defaults.headers.common["token"] = token;
  }

  getToken() {
    try {
      const {
        token
      } = this.axios.defaults.headers.common;
      return token || null;
    } catch (e) {
      return null;
    }
  }

  _request(request) {
    return request().then(res => {
      if (!res.data) {
        return {
          success: fasle
        };
      }

      return {
        success: res.data.success,
        data: res.data.payload,
        message: res.data.message,
        code: res.data.code
      };
    });
  }

  get(path) {
    return this._request(() => this.axios.get(path));
  }

  post(path, body) {
    return this._request(() => this.axios.post(path, body));
  }

  delete(path, body) {
    return this._request(() => this.axios.delete(path, body));
  }

  put(path, body) {
    return this._request(() => this.axios.put(path, body));
  }

  _refreshToken() {//TODO:
  }

}

module.exports = HTTPAgent;

/***/ }),

/***/ "./src/helpers/rlp.js":
/*!****************************!*\
  !*** ./src/helpers/rlp.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "buffer")["Buffer"];
class rlp {
  static isHexString(value) {
    if (!value) return false;
    return /^0x[0-9A-Fa-f]*/.test(value);
  }

  static intToHex(int) {
    if (int < 0) {
      throw new Error('Invalid integer as argument, must be unsigned!');
    }

    const hex = int.toString(16);
    return hex.length % 2 ? `0${hex}` : hex;
  }

  static intToBuffer(int) {
    const hex = rlp.intToHex(int);
    return Buffer.from(hex, 'hex');
  }

  static intToBuffer(int) {
    const hex = rlp.intToHex(int);
    return Buffer.from(hex, 'hex');
  }

  static toBuffer(data) {
    if (data === null) return Buffer.from(0);
    if (Buffer.isBuffer(data)) return data;

    if (typeof data === 'string') {
      if (rlp.isHexString(data)) {
        return Buffer.from(data, 'hex');
      } else {
        return Buffer.from(data, 'utf8');
      }
    } else if (typeof data === 'number') {
      if (data === 0) return Buffer.from(0);
      return rlp.intToBuffer(data); // } else if (data is BigInt) {
      //   if (data == BigInt.zero) return Uint8List(0);
      //   return Uint8List.fromList(encodeBigInt(data));
    } else if (Array.isArray(data)) {
      return Buffer.from(data);
    }
  }

}

module.exports = rlp;

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const BigNumber = __webpack_require__(/*! bignumber.js */ "bignumber.js");

const config = __webpack_require__(/*! ./constants/config */ "./src/constants/config.js");

const PaperWallet = __webpack_require__(/*! ./cores/PaperWallet */ "./src/cores/PaperWallet.js");

const Account = __webpack_require__(/*! ./cores/Account */ "./src/cores/Account.js");

const Trader = __webpack_require__(/*! ./cores/Trader */ "./src/cores/Trader.js");

const User = __webpack_require__(/*! ./cores/User */ "./src/cores/User.js");

const {
  isBrowser
} = __webpack_require__(/*! ./helpers/env */ "./src/helpers/env.js");

const DBOperator = __webpack_require__(/*! ./database/dbOperator */ "./src/database/dbOperator.js");

const TideWalletCommunicator = __webpack_require__(/*! ./cores/TideWalletCommunicator */ "./src/cores/TideWalletCommunicator.js");

const TideWalletCore = __webpack_require__(/*! ./cores/TideWalletCore */ "./src/cores/TideWalletCore.js");

const packageInfo = __webpack_require__(/*! ../package.json */ "./package.json");

class TideWallet {
  // eventType: ready, update, notice
  // notifier: { eventName: string, callback: function }
  notifiers = [];
  static Core = TideWalletCore;

  constructor() {
    return this;
  }

  async init({
    user,
    api
  }) {
    const communicator = new TideWalletCommunicator(api);
    const db = new DBOperator();
    await db.init();
    const initObj = {
      TideWalletCommunicator: communicator,
      DBOperator: db
    };
    this.user = new User(initObj);
    const exist = await this.user.checkUser();

    if (!exist) {
      if (user.mnemonic && user.password) {
        this.core = await this.user.createUserWithSeed(user.OAuthID, seed, user.InstallID);
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
    const listener = this.account.messenger.subscribe(v => {
      this.notice(v, 'update');
    });
    return true;
  }

  on(eventName = '', callback) {
    if (typeof callback !== 'function') return;
    const en = eventName.toLocaleLowerCase();
    let notifier = {
      callback
    };

    switch (en) {
      case 'ready':
      case 'update':
      case 'notice':
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
    return {
      fiat,
      version
    };
  }

  async overview() {
    const currencies = await this.account.getAllCurrencies();
    const fiat = await this.trader.getSelectedFiat();
    const bnRate = fiat.exchangeRate;
    const balance = currencies.reduce((rs, curr) => {
      const bnBalance = new BigNumber(curr.balance);
      const bnRs = new BigNumber(rs);
      return bnRs.plus(this.trader.calculateToUSD({
        currencyId: curr.currencyId,
        amount: bnBalance
      })).toFixed();
    }, 0);
    const bnBalance = new BigNumber(balance);
    const balanceFiat = bnBalance.multipliedBy(bnRate).toFixed();
    const dashboard = {
      balance: balanceFiat,
      currencies
    };
    return dashboard;
  }
  /**
   * 
   * @param {object} accountInfo
   * @param {string} accountInfo.assetID
   */


  async getAssetDetail({
    assetID
  }) {
    const asset = await this.account.getCurrencies(assetID);
    const transactions = await this.account.getTransactions(assetID);
    return {
      asset,
      transactions
    };
  }

  async getTransactionDetail({
    assetID,
    transactionID
  }) {
    const txs = await this.account.getTransactions(assetID);
    const tx = txs.find(r => r.txId === transactionID);
    return tx;
  }

  async getReceivingAddress({
    accountID
  }) {
    const address = await this.account.getReceiveAddress(accountID);
    return address;
  } // ++ need help


  async getTransactionFee({
    accountID,
    blockchainID,
    from,
    to,
    amount,
    data
  }) {
    const svc = this.account.getService(accountID);
    const fees = svc.getTransactionFee(blockchainID);
    return fees;
  } // need help


  async prepareTransaction() {}

  async sendTransaction({
    accountID,
    blockchainID,
    transaction
  }) {
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

  notice(data, eventName = '') {
    const ev = eventName.toLocaleLowerCase();
    this.notifiers.forEach(notifier => {
      if (!notifier) return;
      if (notifier.eventName !== ev) return;
      if (typeof notifier.callback !== 'function') return;
      notifier.callback(data);
    });
  }

}

if (isBrowser()) {
  window.Buffer = __webpack_require__(/*! buffer */ "buffer").Buffer;
  window.TideWallet = TideWallet;
  /** test case */

  window.test = async () => {
    const tw = new TideWallet();
    const api = {
      apiURL: 'https://service.tidewallet.io/api/v1',
      apiKey: 'f2a76e8431b02f263a0e1a0c34a70466',
      apiSecret: '9e37d67450dc906042fde75113ecb78c'
    };
    const user1 = {
      OAuthID: 'test2ejknkjdniednwjq',
      InstallID: '11f6d3e524f367952cb838bf7ef24e0cfb5865d7b8a8fe5c699f748b2fada249',
      mnemonic: 'cry hub inmate cliff sun program public else atom absurd release inherit funny edge assault',
      password: '12345'
    };
    const user2 = {
      OAuthID: 'test2ejknkjdniednwjq',
      InstallID: '11f6d3e524f367952cb838bf7ef24e0cfb5865d7b8a8fe5c699f748b2fada249'
    };
    await tw.init({
      user: user2,
      api
    }); //test
    // console.log('overview:', await tw.overview());
    // console.log('getAssetDetail:', await tw.getAssetDetail({ assetID: "a7255d05-eacf-4278-9139-0cfceb9abed6" }));
    // console.log('getTransactionDetail:', await tw.getTransactionDetail({ assetID: "a7255d05-eacf-4278-9139-0cfceb9abed6", transactionID:"" }));
    // console.log('getReceivingAddress:', await tw.getReceivingAddress({ accountID: "a7255d05-eacf-4278-9139-0cfceb9abed6" }));
    // console.log('getWalletConfig:', await tw.getWalletConfig());
    // await tw.sync();
    // console.log('backup:', await tw.backup());
    // await tw.close();
  };
}

module.exports = TideWallet;

/***/ }),

/***/ "./src/models/account.model.js":
/*!*************************************!*\
  !*** ./src/models/account.model.js ***!
  \*************************************/
/***/ ((module) => {

const ACCOUNT_EVT = {
  OnUpdateAccount: "OnUpdateAccount",
  OnUpdateCurrency: "OnUpdateCurrency",
  OnUpdateTransactions: "OnUpdateTransactions",
  OnUpdateTransaction: "OnUpdateTransaction",
  ClearAll: "ClearAll",
  ToggleDisplayCurrency: "ToggleDisplayCurrency"
};
const ACCOUNT = {
  ETH: 'ETH',
  BTC: 'BTC',
  CFC: 'CFC'
};
module.exports = {
  ACCOUNT_EVT,
  ACCOUNT
};

/***/ }),

/***/ "./src/models/tranasction.model.js":
/*!*****************************************!*\
  !*** ./src/models/tranasction.model.js ***!
  \*****************************************/
/***/ ((module) => {

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
class Transaction {
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

const TRANSACTION_STATUS = {
  success: "success",
  fail: "fail",
  pending: "pending"
};
const TRANSACTION_DIRECTION = {
  sent: "sent",
  received: "received",
  moved: "moved",
  unknown: "unknown"
};
const TRANSACTION_PRIORITY = {
  slow: "slow",
  standard: "standard",
  fast: "fast"
};
/**
 * @property {number} v
 * @property {BigNumber} r
 * @property {BigNumber} s
 */

class Signature {
  constructor({
    v,
    r,
    s
  }) {
    this.v = v;
    this.r = r;
    this.s = s;
  }

}

module.exports = {
  Transaction,
  TRANSACTION_STATUS,
  TRANSACTION_DIRECTION,
  TRANSACTION_PRIORITY,
  Signature
};

/***/ }),

/***/ "./src/models/transactionETH.model.js":
/*!********************************************!*\
  !*** ./src/models/transactionETH.model.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  Transaction,
  TRANSACTION_DIRECTION,
  TRANSACTION_STATUS,
  Signature
} = __webpack_require__(/*! ./tranasction.model */ "./src/models/tranasction.model.js");

const {
  encodeToRlp
} = __webpack_require__(/*! ../helpers/ethereumUtils */ "./src/helpers/ethereumUtils.js");

const BigNumber = __webpack_require__(/*! bignumber.js */ "bignumber.js");

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
    nonce
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
        s: BigNumber(0)
      })
    });
  }

}

module.exports = ETHTransaction;

/***/ }),

/***/ "./src/services/accountService.js":
/*!****************************************!*\
  !*** ./src/services/accountService.js ***!
  \****************************************/
/***/ ((module) => {

/**
 @abstract
**/
class AccountService {
  _syncInterval = 60 * 10 * 1000;
  _lastSyncTimestamp = 0;
  _timer = null;
  _base = null;
  _accountId = null;
  _AccountCore = null;

  get accountId() {
    return this._accountId;
  }

  set accountId(id) {
    this._accountId = id;
  }

  get base() {
    return this._base;
  }

  set base(base) {
    this._base = base;
  }

  get timer() {
    return this._timer;
  }

  set timer(timer) {
    this._timer = timer;
  }

  get lastSyncTimestamp() {
    return this._lastSyncTimestamp;
  }

  get AccountCore() {
    return this._AccountCore;
  }

  init(accountId, base, interval) {}

  start() {}

  stop() {}

  getReceivingAddress() {}

  getChangingAddress() {}

  getTransactionFee() {}

  publishTransaction() {}

  updateTransaction() {}

  updateCurrency() {}

  synchro() {}

}

module.exports = AccountService;

/***/ }),

/***/ "./src/services/accountServiceBase.js":
/*!********************************************!*\
  !*** ./src/services/accountServiceBase.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  ACCOUNT_EVT
} = __webpack_require__(/*! ../models/account.model */ "./src/models/account.model.js");

const AccountService = __webpack_require__(/*! ./accountService */ "./src/services/accountService.js");

class AccountServiceBase extends AccountService {
  constructor(AccountCore) {
    super();
    this._AccountCore = AccountCore;
    this._DBOperator = AccountCore._DBOperator;
    this._TideWalletCommunicator = AccountCore._TideWalletCommunicator;
  }
  /**
   * Push subject event to AccountCore messenger
   * @method _pushResult
   * @returns {void}
   */


  async _pushResult() {
    let cs = await this._DBOperator.accountCurrencyDao.findJoinedByAccountId(this._accountId);
    cs = cs.map(c => ({ ...c,
      accountType: this._base
    }));
    this._AccountCore.currencies[this._accountId] = cs;
    const msg = {
      evt: ACCOUNT_EVT.OnUpdateCurrency,
      value: cs
    };

    this._AccountCore.messenger.next(msg);
  }
  /**
   * Get currencies including account and tokens
   * If tokens not store in databse, would fetch the token detail and insert to database
   * @method _getData
   * @returns {Array} Concat of account and tokens array
   */


  async _getData() {
    try {
      const res = await this._TideWalletCommunicator.AccountDetail(this._accountId);
      const acc = res;
      const tokens = acc["tokens"];
      const currs = await this._DBOperator.currencyDao.findAllCurrencies();
      const newTokens = [];
      tokens.forEach(token => {
        const index = currs.findIndex(c => c.currencyId === token["token_id"]);

        if (index < 0) {
          newTokens.push(cur);
        }
      });

      if (newTokens.length > 0) {
        await Promise.all(newTokens.map(token => {
          return new Promise(async (resolve, reject) => {
            const res = await this._TideWalletCommunicator.TokenDetail(token["blockchain_id"], token["token_id"]);

            if (res != null) {
              const token = this._DBOperator.currencyDao.entity(res);

              await this._DBOperator.currencyDao.insertCurrency(token);
            }
          });
        }));
      }

      return [acc, ...tokens];
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  /**
   * If there is not any tokens, get tokens
   * @method _getSupportedToken
   * @returns {void}
   */


  async _getSupportedToken() {
    const tokens = await this._DBOperator.currencyDao.findAllCurrenciesByAccountId(this._accountId);

    if (tokens.length < 1) {
      const acc = await this._DBOperator.accountDao.findAccount(this._accountId);

      try {
        const res = await this._TideWalletCommunicator.TokenList(acc.networkId);

        if (res) {
          const tokens = res.map(t => this._DBOperator.currencyDao.entity(t));
          await this._DBOperator.currencyDao.insertCurrencies(tokens);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  /**
   * Sync transctions belong this account
   * And push subject event to AccountCore messenger
   * @method _syncTransactions
   * @returns {void}
   */


  async _syncTransactions() {
    const currencies = this._AccountCore.currencies[this._accountId];
    const qureries = currencies.map(currency => {
      return new Promise(async resolve => {
        const transactions = await this._getTransaction(currency);
        const txMsg = {
          evt: ACCOUNT_EVT.OnUpdateTransactions,
          value: {
            currency,
            transactions
          }
        };

        this._AccountCore.messenger.next(txMsg);

        resolve(true);
      });
    });
    qureries.reduce((promise, func) => promise.then(result => func.then(Array.prototype.concat.bind(result))), Promise.resolve([]));
  }
  /**
   * Get transctions
   * @method _getTransaction
   * @param {Object} currency The accountcurrency object
   * @returns {Array} The sorted transactions
   */


  async _getTransaction(currency) {
    try {
      const res = await this._TideWalletCommunicator.ListTransactions(currency.accountcurrencyId);
      const txs = res.map(t => this._DBOperator.transactionDao.entity({ ...t,
        accountcurrencyId: currency.accountcurrencyId
      }));
      await this._DBOperator.transactionDao.insertTransactions(txs);
    } catch (error) {
      console.log(error);
    }

    return this._loadTransactions(currency.id);
  }
  /**
   * Load transctions from database
   * @method _loadTransactions
   * @param {string} currency The accountcurrency Id
   * @returns {Array} The sorted transactions
   */


  async _loadTransactions(currencyId) {
    const transactions = await this._DBOperator.transactionDao.findAllTransactionsById(currencyId);
    const txNull = transactions.filter(t => t.timestamp === null);
    const txReady = transactions.filter(t => t.timestamp !== null);
    return [...txNull, ...txReady];
  }
  /**
   * Load setting page token list
   * @method _getSettingTokens
   * @returns {void}
   */


  async _getSettingTokens() {
    const acc = await this._DBOperator.accountDao.findAccount(this._accountId);

    try {
      const res = await this._TideWalletCommunicator.TokenList(acc.networkId);
      const ds = res.map(tk => ({ ...tk,
        accountId: this._accountId,
        blockchainId: acc.networkId
      }));
      this._AccountCore.settingOptions += ds;
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * @override
   */


  init(accountId, base, interval) {
    this._accountId = accountId;
    this._base = base;
    this._syncInterval = interval ?? this._syncInterval;
  }
  /**
   * @override
   */


  async start() {
    const select = await this._DBOperator.accountCurrencyDao.findOneByAccountyId(this._accountId);
    await this._pushResult();
    await this._getSupportedToken();
    await this._getSettingTokens();

    if (select) {
      this._lastSyncTimestamp = select.lastSyncTime;
    } else {
      this._lastSyncTimestamp = 0;
    }
  }
  /**
   * Clear timer
   * @override
   */


  stop() {
    clearInterval(this.timer);
  }
  /**
   * @override
   */


  getReceivingAddress() {// Override by decorator
  }
  /**
   * @override
   */


  getChangingAddress() {// Override by decorator
  }
  /**
   * @override
   */


  getTransactionFee() {// Override by decorator
  }
  /**
   * @override
   */


  publishTransaction() {// Override by decorator
  }
  /**
   * Update transactions
   * This function would be call by notification
   * @override
   * @method updateTransaction
   * @param {string} currency The accountcurrency Id
   * @param {Object} transaction The transaction
   * @returns {void}
   */


  async updateTransaction(currencyId, transaction) {
    const currencies = this._AccountCore.currencies[this.accountId];
    const currency = currencies.find(c => c.currencyId === currencyId);
    const txMsg = {
      currency,
      transactions
    };

    this._AccountCore.messenger.next(txMsg);

    await this._DBOperator.transactionDao.insertTransaction(transaction);
  }
  /**
   * Update currencies
   * This function would be call by notification
   * @override
   * @method updateCurrency
   * @param {string} currency The accountcurrency Id
   * @param {Array} transactions The transaction list
   * @returns {void}
   */


  async updateCurrency(currencyId, payload) {
    const acs = await this._DBOperator.accountCurrencyDao.findAllCurrencies();
    const ac = acs.find(a => a.currencyId === currencyId);

    const updated = this._DBOperator.accountCurrencyDao.entity({
      accountcurrency_id: ac.accountcurrencyId,
      account_id: this._accountId,
      currency_id: ac.currencyId,
      balance: `${payload["balance"]}`,
      number_of_used_external_key: ac.numberOfUsedExternalKey,
      number_of_used_internal_key: ac.numberOfUsedInternalKey,
      last_sync_time: Date.now()
    });

    await this._DBOperator.accountCurrencyDao.insertAccount(updated);

    this._pushResult();
  }
  /**
   * Get currencies if needed
   * @override
   * @method synchro
   * @param {boolean} force Force synchro
   * @returns {void}
   */


  async synchro(force = false) {
    const now = Date.now();

    if (now - this._lastSyncTimestamp > this._syncInterval || force) {
      const currs = await this._getData();
      const v = currs.map(c => this._DBOperator.accountCurrencyDao.entity({ ...c,
        accountcurrency_id: c['account_id'] ?? c['account_token_id'],
        account_id: this._accountId,
        last_sync_time: now,
        image: c['icon']
      }));
      await this._DBOperator.accountCurrencyDao.insertCurrencies(v);
    }

    await this._pushResult();
    await this._syncTransactions();
  }

}

module.exports = AccountServiceBase;

/***/ }),

/***/ "./src/services/accountServiceDecorator.js":
/*!*************************************************!*\
  !*** ./src/services/accountServiceDecorator.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const AccountService = __webpack_require__(/*! ./accountService */ "./src/services/accountService.js");
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

module.exports = AccountServiceDecorator;

/***/ }),

/***/ "./src/services/ethereumService.js":
/*!*****************************************!*\
  !*** ./src/services/ethereumService.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "buffer")["Buffer"];
const AccountServiceDecorator = __webpack_require__(/*! ./accountServiceDecorator */ "./src/services/accountServiceDecorator.js");

const {
  ACCOUNT,
  ACCOUNT_EVT
} = __webpack_require__(/*! ../models/account.model */ "./src/models/account.model.js");

class EthereumService extends AccountServiceDecorator {
  constructor(service, TideWalletCommunicator, DBOperator) {
    super();
    this.service = service;
    this._base = ACCOUNT.ETH;
    this._syncInterval = 15000;
    this._address = null;
    this._fee = null;
    this._gasLimit = null;
    this._feeTimestamp = null;
    this._nonce = 0;
    this._TideWalletCommunicator = TideWalletCommunicator;
    this._DBOperator = DBOperator;
  }
  /**
    @override
  **/


  init(accountId, base, interval) {
    this.service.init(accountId, base || this._base, interval !== this._syncInterval ? interval : this._syncInterval);
  }
  /**
    @override
  **/


  async start() {
    console.log(this.base, " Service Start ", this.accountId, this._syncInterval);
    await this.service.start();
    this.synchro();
    this.service.timer = setInterval(() => {
      this.synchro();
    }, this._syncInterval);
  }
  /**
    @override
  **/


  stop() {
    this.service.stop();
  }
  /**
   * getReceivingAddress
   * @override
   * @param {String} accountcurrencyId
   * @returns {Array.<{address: String || error, code: Number}>} result
   */


  async getReceivingAddress(accountcurrencyId) {
    if (this._address === null) {
      try {
        const response = await this._TideWalletCommunicator.AccountReceive(accountcurrencyId);
        const address = response["address"];
        this._address = address;
      } catch (error) {
        console.log(error); //TODO

        return ["error", 0];
      }
    }

    return [this._address, null];
  }
  /**
   * getChangingAddress
   * @override
   * @param {String} currencyId
   * @returns {{address: String || error, code: Number}[]} result
   */


  async getChangingAddress(currencyId) {
    return await this.getReceivingAddress(currencyId);
  }
  /**
   * getTransactionFee
   * @override
   * @param {String} blockchainId
   * @returns {Object} result
   * @returns {string} result.slow
   * @returns {string} result.standard
   * @returns {string} result.fast
   */


  async getTransactionFee(blockchainId) {
    if (this._fee == null || Date.now() - this._feeTimestamp > this.AVERAGE_FETCH_FEE_TIME) {
      try {
        const response = await this._TideWalletCommunicator.GetFee(blockchainId);
        const {
          slow,
          standard,
          fast
        } = response;
        this._fee = {
          slow,
          standard,
          fast
        };
        this._feeTimestamp = Date.now();
      } catch (error) {
        console.log(error); // TODO fee = null 前面會出錯
      }
    }

    return this._fee;
  }
  /**
   * publishTransaction
   * @override
   * @param {String} blockchainId
   * @param {Transaction} transaction
   * @returns {Array.<{success: Boolean, transaction: String}>} result
   */


  async publishTransaction(blockchainId, transaction) {
    try {
      const body = {
        hex: "0x" + Buffer.from(transaction.serializeTransaction).toString("hex")
      };
      const response = await this._TideWalletCommunicator.PublishTransaction(blockchainId, body);
      transaction.txId = response["txid"];
      transaction.timestamp = Date.now();
      transaction.confirmations = 0;
      return [true, transaction];
    } catch (error) {
      console.log(error);
      return [false, transaction];
    }
  }
  /**
   * updateTransaction
   * @override
   * @param {String} currencyId
   * @param {Object} payload
   * @returns {Object} transaction table object
   */


  async updateTransaction(currencyId, payload) {
    return await this.service.updateTransaction(currencyId, payload);
  }
  /**
   * updateCurrency
   * @override
   * @param {String} currencyId
   * @param {Object} payload
   * @returns {Object} currency table object
   */


  async updateCurrency(currencyId, payload) {
    return await this.service.updateCurrency(currencyId, payload);
  }
  /**
   * @override
   **/


  synchro(force = false) {
    this.service.synchro(force);
  }
  /**
   * addToken
   * @override
   * @param {String} blockchainId
   * @param {Object} token
   * @returns {Boolean} result
   */


  async addToken(blockchainId, token) {
    try {
      const res = await this._TideWalletCommunicator.TokenRegist(blockchainId, token.contract);
      const {
        token_id: id
      } = res;
      const updateResult = await this._TideWalletCommunicator.AccountDetail(this.service.accountId);
      const accountItem = updateResult;
      const tokens = [accountItem, ...accountItem.tokens];
      const index = tokens.findIndex(token => token["token_id"] == id);
      const data = { ...tokens[index],
        icon: token.imgUrl || accountItem["icon"],
        currency_id: id
      };

      const curr = this._DBOperator.currencyDao.entity({ ...data
      });

      await this._DBOperator.currencyDao.insertCurrency(curr);
      const now = Date.now();

      const v = this._DBOperator.accountCurrencyDao.entity({ ...tokens[index],
        account_id: this.service.accountId,
        currency_id: id,
        last_sync_time: now
      });

      await this._DBOperator.accountCurrencyDao.insertAccount(v);
      const findAccountCurrencies = await this._DBOperator.accountCurrencyDao.findJoinedByAccountId(this.service.accountId); // List<Currency> cs = findAccountCurrencies
      //     .map((c) => Currency.fromJoinCurrency(c, jcs[0], this.base))
      //     .toList();
      // TODO: messenger
      // const msg = AccountMessage(evt: ACCOUNT_EVT.OnUpdateAccount, value: cs[0]);
      // this.service.AccountCore().currencies[this.service.accountId] = cs;

      const currMsg = {
        evt: ACCOUNT_EVT.OnUpdateCurrency,
        value: this.service.AccountCore().currencies[this.service.accountId]
      };
      this.service.AccountCore().messenger.next(currMsg);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  /**
   * estimateGasLimit
   * @override
   * @param {String} blockchainId
   * @param {String} from
   * @param {String} to
   * @param {String} amount
   * @param {String} message
   * @returns {Boolean} result
   */


  async estimateGasLimit(blockchainId, from, to, amount, message) {
    if (message == "0x" && this._gasLimit != null) {
      return this._gasLimit;
    } else {
      const payload = {
        fromAddress: from,
        toAddress: to,
        value: amount,
        data: message
      };

      try {
        const response = await this._TideWalletCommunicator.GetGasLimit(blockchainId, payload);
        this._gasLimit = Number(response.gasLimit);
      } catch (error) {
        // TODO
        // _gasLimit = 21000;
        throw error;
      }

      return this._gasLimit;
    }
  }
  /**
   * getNonce
   * @override
   * @param {String} blockchainId
   * @param {String} address
   * @returns {Number} nonce
   */


  async getNonce(blockchainId, address) {
    try {
      const response = await this._TideWalletCommunicator.GetNonce(blockchainId, address);
      const nonce = Number(response["nonce"]);
      this._nonce = nonce;
      return nonce;
    } catch (error) {
      console.log(error); // TODO:

      return this._nonce += 1;
    }
  }

}

module.exports = EthereumService;

/***/ }),

/***/ "./src/services/transactionService.js":
/*!********************************************!*\
  !*** ./src/services/transactionService.js ***!
  \********************************************/
/***/ ((module) => {

/**
 @abstract
**/
class TransactionService {
  _base;
  _currencyDecimals = 18;

  set base(base) {
    this._base = base;
  }

  get base() {
    return this._base;
  }

  set currencyDecimals(decimal) {
    this._currencyDecimals = decimal;
  }

  get currencyDecimals() {
    return this._currencyDecimals;
  }

  verifyAddress(address, publish = true) {}

  extractAddressData(address, publish = true) {}

  prepareTransaction() {}

}

module.exports = TransactionService;

/***/ }),

/***/ "./src/services/transactionServiceETH.js":
/*!***********************************************!*\
  !*** ./src/services/transactionServiceETH.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "buffer")["Buffer"];
const TransactionDecorator = __webpack_require__(/*! ./accountServiceDecorator */ "./src/services/accountServiceDecorator.js");

const {
  ACCOUNT
} = __webpack_require__(/*! ../models/account.model */ "./src/models/account.model.js");

const Cryptor = __webpack_require__(/*! ../helpers/Cryptor */ "./src/helpers/Cryptor.js");

const {
  encodeToRlp,
  verifyEthereumAddress,
  getEthereumAddressBytes
} = __webpack_require__(/*! ../helpers/ethereumUtils */ "./src/helpers/ethereumUtils.js");

const EthereumTransaction = __webpack_require__(/*! ../models/transactionETH.model */ "./src/models/transactionETH.model.js");

const {
  Signature
} = __webpack_require__(/*! ../models/tranasction.model */ "./src/models/tranasction.model.js");

class TransactionServiceETH extends TransactionDecorator {
  service = null;
  _base = ACCOUNT.ETH;
  _currencyDecimals = 18;

  constructor(service, signer) {
    this.service = service;
    this.signer = signer;
  }

  _signTransaction(transaction) {
    const payload = encodeToRlp(transaction);
    const rawDataHash = Buffer.from(Cryptor.keccak256round(payload.toString("hex"), 1), "hex");
    const signature = this.signer.sign({
      data: rawDataHash
    });
    console.log("ETH signature: ", signature);
    const chainIdV = transaction.chainId != null ? signature.v - 27 + (transaction.chainId * 2 + 35) : signature.v;
    signature = Signature({
      v: chainIdV,
      r: signature.r,
      s: signature.s
    });
    transaction.signature = signature;
    return transaction;
  }
  /**
   * @override
   */


  verifyAddress() {
    const result = verifyEthereumAddress(address);
    return result;
  }
  /**
   * @override
   */


  extractAddressData() {
    return getEthereumAddressBytes(address);
  }
  /**
   * @override
   * @method prepareTransaction
   * @param {object} param
   * @param {string} param.to
   * @param {BigNumber} param.amount
   * @param {BigNumber} param.gasPrice
   * @param {BigNumber} param.gasUsed
   * @param {stringm} param.message
   * @param {number} param.chainId
   * @param {number} param.nonce
   * @returns {ETHTransaction} transaction 
   */


  prepareTransaction({
    to,
    amount,
    gasPrice,
    gasUsed,
    message,
    chainId,
    nonce
  }) {
    const transaction = EthereumTransaction.createTransaction({
      to,
      amount,
      gasPrice,
      gasUsed,
      message,
      chainId,
      fee: gasLimit * gasPrice,
      nonce
    });
    return this._signTransaction(transaction, privKey);
  }

}

module.exports = TransactionServiceETH;

/***/ }),

/***/ "./ui/javascript/utils/utils.js":
/*!**************************************!*\
  !*** ./ui/javascript/utils/utils.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "randomHex": () => (/* binding */ randomHex),
/* harmony export */   "to": () => (/* binding */ to),
/* harmony export */   "dateFormatter": () => (/* binding */ dateFormatter),
/* harmony export */   "addressFormatter": () => (/* binding */ addressFormatter),
/* harmony export */   "currentView": () => (/* binding */ currentView)
/* harmony export */ });
const randomHex = n => {
  var ID = "";
  var text = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  n = parseInt(n);

  if (!(n > 0)) {
    n = 8;
  }

  while (ID.length < n) {
    ID = ID.concat(text.charAt(parseInt(Math.random() * text.length)));
  }

  return ID;
};

const pad = n => {
  return n < 10 ? "0" + n : n;
};

const to = promise => {
  return promise.then(data => {
    return [null, data];
  }).catch(err => [err, null]);
};
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dateFormatter = timestamp => {
  const dateTime = new Date(timestamp);
  const date = dateTime.getDate();
  const month = dateTime.getMonth();
  const year = dateTime.getFullYear();
  let hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  let suffix = "AM";

  if (hours - 12 > 0) {
    hours -= 12;
    suffix = "PM";
  }

  const mmddyyyykkmm = monthNames[month] + " " + pad(date) + ", " + year + " " + hours + ":" + pad(minutes) + " " + suffix;
  return mmddyyyykkmm;
};
const addressFormatter = (address, showLength = 6) => {
  if (address.length <= showLength * 2) return address;
  const prefix = address.slice(0, showLength);
  const suffix = address.slice(address.length - showLength, address.length);
  return prefix + "..." + suffix;
};
const currentView = () => {
  const scaffold = document.querySelector("scaffold-widget");
  const view = scaffold?.attributes?.view?.value;
  return view;
};

/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"tidebitwallet","version":"0.1.0","description":"A Crypto Wallet in your Browser","main":"bin/main.js","scripts":{"build":"webpack --mode=development"},"repository":{"type":"git","url":"git+https://github.com/BOLT-Protocol/TideBitWallet.git"},"keywords":["Bitcoin","Ethereum","Wallet","Chrome Extension"],"author":"Boltchain","license":"GPLv3","bugs":{"url":"https://github.com/BOLT-Protocol/TideBitWallet/issues"},"homepage":"https://github.com/BOLT-Protocol/TideBitWallet#readme","devDependencies":{"buffer":"^6.0.3","css-loader":"^5.2.6","cssnano":"^5.0.5","file-loader":"^6.2.0","mini-css-extract-plugin":"^1.6.0","node-sass":"^6.0.0","postcss-loader":"^5.3.0","sass-loader":"^12.0.0","svg-inline-loader":"^0.8.2","url-loader":"^4.1.1","webpack":"^5.38.1","webpack-cli":"^4.7.2","@babel/core":"^7.14.3","@babel/plugin-transform-runtime":"^7.14.3","@babel/preset-env":"^7.14.4","babel-loader":"^8.2.2","clean-webpack-plugin":"^4.0.0-alpha.0","jest":"^27.0.4","webpack-node-externals":"^3.0.0"},"dependencies":{"@babel/runtime":"^7.14.0","axios":"^0.21.1","bignumber.js":"^9.0.1","bip39":"^3.0.4","bitcoinjs-lib":"^5.2.0","key-store":"^1.2.0","rlp":"^2.2.6","rxjs":"^7.1.0","web3":"^1.3.6","qrcode":"^1.4.4"}}');

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("axios");;

/***/ }),

/***/ "bignumber.js":
/*!*******************************!*\
  !*** external "bignumber.js" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("bignumber.js");;

/***/ }),

/***/ "bip39":
/*!************************!*\
  !*** external "bip39" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("bip39");;

/***/ }),

/***/ "bitcoinjs-lib":
/*!********************************!*\
  !*** external "bitcoinjs-lib" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("bitcoinjs-lib");;

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");;

/***/ }),

/***/ "ethereumjs-util":
/*!**********************************!*\
  !*** external "ethereumjs-util" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("ethereumjs-util");;

/***/ }),

/***/ "key-store":
/*!****************************!*\
  !*** external "key-store" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("key-store");;

/***/ }),

/***/ "rlp":
/*!**********************!*\
  !*** external "rlp" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("rlp");;

/***/ }),

/***/ "rxjs":
/*!***********************!*\
  !*** external "rxjs" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("rxjs");;

/***/ }),

/***/ "web3":
/*!***********************!*\
  !*** external "web3" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("web3");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("5bd2b9b27d355eee6a13")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "tidebitwallet:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			;
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises;
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		// eslint-disable-next-line no-unused-vars
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				registeredStatusHandlers[i].call(null, newStatus);
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 					blockingPromises.push(promise);
/******/ 					waitForBlockingPromises(function () {
/******/ 						setStatus("ready");
/******/ 					});
/******/ 					return promise;
/******/ 				case "prepare":
/******/ 					blockingPromises.push(promise);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises.length === 0) return fn();
/******/ 			var blocker = blockingPromises;
/******/ 			blockingPromises = [];
/******/ 			return Promise.all(blocker).then(function () {
/******/ 				return waitForBlockingPromises(fn);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			setStatus("check");
/******/ 			return __webpack_require__.hmrM().then(function (update) {
/******/ 				if (!update) {
/******/ 					setStatus(applyInvalidatedModules() ? "ready" : "idle");
/******/ 					return null;
/******/ 				}
/******/ 		
/******/ 				setStatus("prepare");
/******/ 		
/******/ 				var updatedModules = [];
/******/ 				blockingPromises = [];
/******/ 				currentUpdateApplyHandlers = [];
/******/ 		
/******/ 				return Promise.all(
/******/ 					Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 						promises,
/******/ 						key
/******/ 					) {
/******/ 						__webpack_require__.hmrC[key](
/******/ 							update.c,
/******/ 							update.r,
/******/ 							update.m,
/******/ 							promises,
/******/ 							currentUpdateApplyHandlers,
/******/ 							updatedModules
/******/ 						);
/******/ 						return promises;
/******/ 					},
/******/ 					[])
/******/ 				).then(function () {
/******/ 					return waitForBlockingPromises(function () {
/******/ 						if (applyOnUpdate) {
/******/ 							return internalApply(applyOnUpdate);
/******/ 						} else {
/******/ 							setStatus("ready");
/******/ 		
/******/ 							return updatedModules;
/******/ 						}
/******/ 					});
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error("apply() is only allowed in ready status");
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				setStatus("abort");
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			// handle errors in accept handlers and self accepted module load
/******/ 			if (error) {
/******/ 				setStatus("fail");
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw error;
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			if (queuedInvalidatedModules) {
/******/ 				return internalApply(options).then(function (list) {
/******/ 					outdatedModules.forEach(function (moduleId) {
/******/ 						if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 					});
/******/ 					return list;
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			setStatus("idle");
/******/ 			return Promise.resolve(outdatedModules);
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		var currentUpdatedModulesList;
/******/ 		var waitingUpdateResolves = {};
/******/ 		function loadUpdateChunk(chunkId) {
/******/ 			return new Promise((resolve, reject) => {
/******/ 				waitingUpdateResolves[chunkId] = resolve;
/******/ 				// start update chunk loading
/******/ 				var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				var loadingEnded = (event) => {
/******/ 					if(waitingUpdateResolves[chunkId]) {
/******/ 						waitingUpdateResolves[chunkId] = undefined
/******/ 						var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 						var realSrc = event && event.target && event.target.src;
/******/ 						error.message = 'Loading hot update chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 						error.name = 'ChunkLoadError';
/******/ 						error.type = errorType;
/******/ 						error.request = realSrc;
/******/ 						reject(error);
/******/ 					}
/******/ 				};
/******/ 				__webpack_require__.l(url, loadingEnded);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		self["webpackHotUpdatetidebitwallet"] = (chunkId, moreModules, runtime) => {
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = moreModules[moduleId];
/******/ 					if(currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 			if(waitingUpdateResolves[chunkId]) {
/******/ 				waitingUpdateResolves[chunkId]();
/******/ 				waitingUpdateResolves[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.jsonpHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.jsonp = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.jsonp = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.jsonpHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						!__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						__webpack_require__.o(installedChunks, chunkId) &&
/******/ 						installedChunks[chunkId] !== undefined
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = () => {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__("./src/background.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=background.js.map