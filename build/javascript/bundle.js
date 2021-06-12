/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/image/icon/icon128.png":
/*!************************************!*\
  !*** ./src/image/icon/icon128.png ***!
  \************************************/
/***/ ((module) => {

module.exports = "../image/icon128.png";

/***/ }),

/***/ "./src/image/icon/icon16.png":
/*!***********************************!*\
  !*** ./src/image/icon/icon16.png ***!
  \***********************************/
/***/ ((module) => {

module.exports = "../image/icon16.png";

/***/ }),

/***/ "./src/image/icon/icon48.png":
/*!***********************************!*\
  !*** ./src/image/icon/icon48.png ***!
  \***********************************/
/***/ ((module) => {

module.exports = "../image/icon48.png";

/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/hmr/hotModuleReplacement.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/hmr/hotModuleReplacement.js ***!
  \*******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* eslint-env browser */

/*
  eslint-disable
  no-console,
  func-names
*/
var normalizeUrl = __webpack_require__(/*! ./normalize-url */ "./node_modules/mini-css-extract-plugin/dist/hmr/normalize-url.js");

var srcByModuleId = Object.create(null);
var noDocument = typeof document === 'undefined';
var forEach = Array.prototype.forEach;

function debounce(fn, time) {
  var timeout = 0;
  return function () {
    var self = this; // eslint-disable-next-line prefer-rest-params

    var args = arguments;

    var functionCall = function functionCall() {
      return fn.apply(self, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
}

function noop() {}

function getCurrentScriptUrl(moduleId) {
  var src = srcByModuleId[moduleId];

  if (!src) {
    if (document.currentScript) {
      src = document.currentScript.src;
    } else {
      var scripts = document.getElementsByTagName('script');
      var lastScriptTag = scripts[scripts.length - 1];

      if (lastScriptTag) {
        src = lastScriptTag.src;
      }
    }

    srcByModuleId[moduleId] = src;
  }

  return function (fileMap) {
    if (!src) {
      return null;
    }

    var splitResult = src.split(/([^\\/]+)\.js$/);
    var filename = splitResult && splitResult[1];

    if (!filename) {
      return [src.replace('.js', '.css')];
    }

    if (!fileMap) {
      return [src.replace('.js', '.css')];
    }

    return fileMap.split(',').map(function (mapRule) {
      var reg = new RegExp("".concat(filename, "\\.js$"), 'g');
      return normalizeUrl(src.replace(reg, "".concat(mapRule.replace(/{fileName}/g, filename), ".css")));
    });
  };
}

function updateCss(el, url) {
  if (!url) {
    if (!el.href) {
      return;
    } // eslint-disable-next-line


    url = el.href.split('?')[0];
  }

  if (!isUrlRequest(url)) {
    return;
  }

  if (el.isLoaded === false) {
    // We seem to be about to replace a css link that hasn't loaded yet.
    // We're probably changing the same file more than once.
    return;
  }

  if (!url || !(url.indexOf('.css') > -1)) {
    return;
  } // eslint-disable-next-line no-param-reassign


  el.visited = true;
  var newEl = el.cloneNode();
  newEl.isLoaded = false;
  newEl.addEventListener('load', function () {
    if (newEl.isLoaded) {
      return;
    }

    newEl.isLoaded = true;
    el.parentNode.removeChild(el);
  });
  newEl.addEventListener('error', function () {
    if (newEl.isLoaded) {
      return;
    }

    newEl.isLoaded = true;
    el.parentNode.removeChild(el);
  });
  newEl.href = "".concat(url, "?").concat(Date.now());

  if (el.nextSibling) {
    el.parentNode.insertBefore(newEl, el.nextSibling);
  } else {
    el.parentNode.appendChild(newEl);
  }
}

function getReloadUrl(href, src) {
  var ret; // eslint-disable-next-line no-param-reassign

  href = normalizeUrl(href, {
    stripWWW: false
  }); // eslint-disable-next-line array-callback-return

  src.some(function (url) {
    if (href.indexOf(src) > -1) {
      ret = url;
    }
  });
  return ret;
}

function reloadStyle(src) {
  if (!src) {
    return false;
  }

  var elements = document.querySelectorAll('link');
  var loaded = false;
  forEach.call(elements, function (el) {
    if (!el.href) {
      return;
    }

    var url = getReloadUrl(el.href, src);

    if (!isUrlRequest(url)) {
      return;
    }

    if (el.visited === true) {
      return;
    }

    if (url) {
      updateCss(el, url);
      loaded = true;
    }
  });
  return loaded;
}

function reloadAll() {
  var elements = document.querySelectorAll('link');
  forEach.call(elements, function (el) {
    if (el.visited === true) {
      return;
    }

    updateCss(el);
  });
}

function isUrlRequest(url) {
  // An URL is not an request if
  // It is not http or https
  if (!/^https?:/i.test(url)) {
    return false;
  }

  return true;
}

module.exports = function (moduleId, options) {
  if (noDocument) {
    console.log('no window.document found, will not HMR CSS');
    return noop;
  }

  var getScriptSrc = getCurrentScriptUrl(moduleId);

  function update() {
    var src = getScriptSrc(options.filename);
    var reloaded = reloadStyle(src);

    if (options.locals) {
      console.log('[HMR] Detected local css modules. Reload all css');
      reloadAll();
      return;
    }

    if (reloaded) {
      console.log('[HMR] css reload %s', src.join(' '));
    } else {
      console.log('[HMR] Reload all css');
      reloadAll();
    }
  }

  return debounce(update, 50);
};

/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/hmr/normalize-url.js":
/*!************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/hmr/normalize-url.js ***!
  \************************************************************************/
/***/ ((module) => {

"use strict";


/* eslint-disable */
function normalizeUrl(pathComponents) {
  return pathComponents.reduce(function (accumulator, item) {
    switch (item) {
      case '..':
        accumulator.pop();
        break;

      case '.':
        break;

      default:
        accumulator.push(item);
    }

    return accumulator;
  }, []).join('/');
}

module.exports = function (urlString) {
  urlString = urlString.trim();

  if (/^data:/i.test(urlString)) {
    return urlString;
  }

  var protocol = urlString.indexOf('//') !== -1 ? urlString.split('//')[0] + '//' : '';
  var components = urlString.replace(new RegExp(protocol, 'i'), '').split('/');
  var host = components[0].toLowerCase().replace(/\.$/, '');
  components[0] = '';
  var path = normalizeUrl(components);
  return protocol + host + path;
};

/***/ }),

/***/ "./src/scss/main.scss":
/*!****************************!*\
  !*** ./src/scss/main.scss ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

    if(true) {
      // 1623487329203
      var cssReload = __webpack_require__(/*! ./node_modules/mini-css-extract-plugin/dist/hmr/hotModuleReplacement.js */ "./node_modules/mini-css-extract-plugin/dist/hmr/hotModuleReplacement.js")(module.id, {"locals":false});
      module.hot.dispose(cssReload);
      module.hot.accept(undefined, cssReload);
    }
  

/***/ }),

/***/ "./src/javascript/constant/bottom_navigator_data.js":
/*!**********************************************************!*\
  !*** ./src/javascript/constant/bottom_navigator_data.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const navigatorItemsData = [
  {
    screen: "accounts",
    iconHtml: `<i class="fas fa-wallet"></i>`,
    checked: true, // default
  },
  {
    screen: 'settings',
    iconHtml: `<i class="fas fa-cog"></i>`,
  },
];

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (navigatorItemsData);


/***/ }),

/***/ "./src/javascript/constant/tab_bar_data.js":
/*!*************************************************!*\
  !*** ./src/javascript/constant/tab_bar_data.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const tabBarItemData = [
  {
    iconImg: "../src/image/icon/ic_send_orange_light.png",
    title: "Send",
    screen: "transaction",
  },
  {
    iconImg: "../src/image/icon/ic_receive_blue_dark.png",
    title: "Receive",
    screen: "address",
  },
];

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (tabBarItemData);

/***/ }),

/***/ "./src/javascript/index.js":
/*!*********************************!*\
  !*** ./src/javascript/index.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui */ "./src/javascript/ui.js");



const start = async()=> {
  console.log('start');
  (0,_ui__WEBPACK_IMPORTED_MODULE_0__.default)();
}

start();




/***/ }),

/***/ "./src/javascript/layout/bottom_navigator.js":
/*!***************************************************!*\
  !*** ./src/javascript/layout/bottom_navigator.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constant_bottom_navigator_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constant/bottom_navigator_data */ "./src/javascript/constant/bottom_navigator_data.js");
/* harmony import */ var _utils_route__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/route */ "./src/javascript/utils/route.js");


class BottomNavigatorItem extends HTMLElement {
  constructor() {
    super();
    this.markup = (itemData, state) => {
      const markup = `
          <input type="radio" name="bottom-navigator" class="bottom-navigator__item" id="${
            itemData.screen
          }" ${
        itemData.checked || itemData.screen === state.screen ? "checked" : ""
      }>
          <label class="bottom-navigator__button" for="${itemData.screen}">
              <div class="bottom-navigator__icon">${itemData.iconHtml}</div>
          </label>
          `;
      return markup;
    };
    this.addEventListener("click", (_) => {
      this.state.screen = this.itemData.screen;
      (0,_utils_route__WEBPACK_IMPORTED_MODULE_1__.default)(this.state);
    });
  }

  set child(data) {
    this.className = "bottom-navigator";
    this.itemData = data.itemData;
    this.state = JSON.parse(JSON.stringify(data.state));
    this.insertAdjacentHTML(
      "afterbegin",
      this.markup(this.itemData, this.state)
    );
  }
}

customElements.define("bottom-navigator-item", BottomNavigatorItem);

const bottomNavigator = (state) => {
  const bottomNavigatorBar = document.createElement("footer");
  bottomNavigatorBar.classList = ["bottom-navigator"];
  _constant_bottom_navigator_data__WEBPACK_IMPORTED_MODULE_0__.default.forEach((itemData) => {
    const navigatorItem = document.createElement("bottom-navigator-item");
    navigatorItem.child = {
      itemData: itemData,
      state: state,
    };
    bottomNavigatorBar.insertAdjacentElement("beforeend", navigatorItem);
  });
  return bottomNavigatorBar;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (bottomNavigator);


/***/ }),

/***/ "./src/javascript/layout/header.js":
/*!*****************************************!*\
  !*** ./src/javascript/layout/header.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_route__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/route */ "./src/javascript/utils/route.js");
// https://unicode-table.com/cn/2248/

class BackButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", () => {
      if (this.state.screen) {
        (0,_utils_route__WEBPACK_IMPORTED_MODULE_0__.default)(this.state);
      }
    });
  }
  connectedCallback() {
    this.className = "header__leading";
    this.innerHTML = `<i class="fas fa-arrow-left">`;
  }
  set icon(iconHTML) {
    this.innerHTML = iconHTML;
  }
  set onClick(state){
    this.state = JSON.parse(JSON.stringify(state));
  }
 
}
customElements.define("back-button", BackButton);

const getHeaderInfo = (screen) => {
  switch (screen) {
    case "transaction":
      return { screenTitle: "Send Coin" };
    case "bill":
      return { screenTitle: "Transaction Detail" };
    case "address":
      return { screenTitle: "My Wallet" };
  }
};

const overviewHeader = (totalAsset, fiatSymbol) => {
  const markup = `
    <div class="header__title">Total Asset</div>
    <div class="header__title-sub">
      <span class="almost-equal-to">&#8776;</span>
      <span class="user-total-balance">${totalAsset}</span>
      <span class="currency-unit">${fiatSymbol}</span>
    </div>
  `;
  return markup;
};

const accountHeader = (state) => {
  const account = state.account;
  const fiat = state.walletConfig.fiat;
  const markup = `
  <div class="header__icon">
    <img src=${account.image}  alt=${account.symbol.toUpperCase()}>
  </div>
  <div class="header__icon-title">${account.symbol.toUpperCase()}</div>
  <div class="header__title">${account.balance}</div>
  <div class="header__title-sub">
    <span class="almost-equal-to">&#8776;</span>
    <span class="balance">${account.infiat}</span>
    <span class="currency-unit">${fiat.symbol}</span>
  </div>
  `;
  const backButton = document.createElement("back-button");
  const _state = JSON.parse(JSON.stringify(state));
  _state.screen = "accounts";
  backButton.onClick = _state;
  return [markup, backButton];
};
const defaultHeader = (state) => {
  const { leadingHTML, screenTitle, actionHTML } = getHeaderInfo(state.screen);
  const _state = JSON.parse(JSON.stringify(state));
  _state.screen = "account";
  const markup = `
      <div class="header__title">${screenTitle}</div>
      <div class="header__action ${actionHTML ? "" : "disabled"}">${
    actionHTML ? actionHTML : '<i class="fas fa-ellipsis-h"></i>'
  }</div>
  `;
  const backButton = document.createElement("back-button");
  if (leadingHTML) backButton.icon = leadingHTML;
  backButton.onClick = _state;
  return [markup, backButton];
};

const header = (state) => {
  const header = document.createElement("header");
  let markup, backButton;
  switch (state.screen) {
    case "accounts":
    case "settings":
      header.classList = ["header header--overview"];
      markup = overviewHeader(
        state.user.totalAsset,
        state.walletConfig.fiat.symbol
      );
      break;
    case "account":
      header.classList = ["header header--account"];
      // markup = accountHeader(state.account, state.walletConfig.fiat);
      [markup, backButton] = accountHeader(state);
      header.insertAdjacentElement("afterbegin", backButton);
      break;
    default:
      header.classList = ["header header--default"];
      [markup, backButton] = defaultHeader(state);
      header.insertAdjacentElement("afterbegin", backButton);
  }
  header.insertAdjacentHTML("beforeend", markup);
  return header;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (header);


/***/ }),

/***/ "./src/javascript/layout/scaffold.js":
/*!*******************************************!*\
  !*** ./src/javascript/layout/scaffold.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Scaffold)
/* harmony export */ });
// https://developers.google.com/web/fundamentals/web-components/customelements
class Scaffold extends HTMLElement {
  // Can define constructor arguments if you wish.
  constructor() {
    // If you define a constructor, always call super() first!
    // This is specific to CE and required by the spec.
    super();
  }

  connectedCallback() {
    // create an element with some default HTML:
    this.innerHTML = `<main></main>`;
    this.className = "scaffold";
  }

  /**
   * @param {HTMLElement} element
   */
  set header(element) {
    this.insertAdjacentElement("afterbegin", element);
  }

  /**
   * @param {HTMLElement} element or
   * @param {HTMLElement} [element]
   */
  set body(element) {
    if (Array.isArray(element)) {
      element.forEach((element) =>
        this.childNodes[1].insertAdjacentElement("beforeend", element)
      );
    } else {
      this.childNodes[1].insertAdjacentElement("beforeend", element);
    }
  }

  /**
   * @param {HTMLElement} element
   */
  set bottomNavigator(element) {
    this.insertAdjacentElement("beforeend", element);
  }
}

// module.exports.Scaffold;


/***/ }),

/***/ "./src/javascript/layout/tab_bar_navigator.js":
/*!****************************************************!*\
  !*** ./src/javascript/layout/tab_bar_navigator.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constant_tab_bar_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constant/tab_bar_data */ "./src/javascript/constant/tab_bar_data.js");
/* harmony import */ var _utils_route__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/route */ "./src/javascript/utils/route.js");


class TabBarItem extends HTMLElement {
  constructor() {
    super();
    this.markup = (itemData) => `
        <input type="radio" name="tab-bar" class="tab-bar__item" id=${itemData.title.toLowerCase()} checked>
        <label class="tab-bar__button" for=${itemData.title.toLowerCase()}>
          <div class="tab-bar__icon"><img src=${
            itemData.iconImg
          } alt="icon"></div>
          <div class="tab-bar__text">${itemData.title}</i></div>
        </label>
        `;
    this.addEventListener("click", (_) => {
      this.state.screen = this.itemData.screen;
      (0,_utils_route__WEBPACK_IMPORTED_MODULE_1__.default)(this.state);
    });
  }

  set child(data) {
    this.itemData = data.itemData;
    this.state = JSON.parse(JSON.stringify(data.state));
    this.insertAdjacentHTML("afterbegin", this.markup(this.itemData));
  }
}

customElements.define("tab-bar-item", TabBarItem);

const tabNavigator = (state) => {
  const tabBar = document.createElement("div");
  tabBar.className = "tab-bar";
  _constant_tab_bar_data__WEBPACK_IMPORTED_MODULE_0__.default.forEach((itemData) => {
    const tabBarItem = document.createElement("tab-bar-item");
    tabBarItem.child = {
      itemData: itemData,
      state: state,
    };
    tabBar.insertAdjacentElement("beforeend", tabBarItem);
  });
  return tabBar;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (tabNavigator);

/***/ }),

/***/ "./src/javascript/model/bill.js":
/*!**************************************!*\
  !*** ./src/javascript/model/bill.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/javascript/utils/utils.js");


class Bill {
  constructor({
    id,
    txid,
    amount,
    fee,
    message,
    timestamp,
    direction,
    from,
    to,
    confirmations,
  }) {
    this.id = id;
    this.txid = txid;
    this.amount = amount;
    this.fee = fee;
    this.message = message;
    this.timestamp = timestamp;
    this._direction = direction;
    this.from = from;
    this.to = to;
    this.confirmations = confirmations;
  }

  get dateTime() {
    return _utils_utils__WEBPACK_IMPORTED_MODULE_0__.dateFormatter(this.timestamp);
  }

  get status() {
    if (this.confirmations === 0) {
      return "Pending";
    } else if (this.confirmations > 0 && this.confirmations <= 6) {
      return "Confirming";
    } else if (this.confirmations > 6) {
      return "Completed";
    } else {
      return "Failed";
    }
  }
  get action() {
    switch (this._direction) {
      case "receive":
        return "Receive";
      case "send":
        return "Send";
      default:
        return "Unknown";
    }
  }
  get direction() {
    switch (this._direction) {
      case "receive":
        return "Receive from";
      case "send":
        return "Transfer to";
      default:
        return "Unknown";
    }
  }
  get address() {
    switch (this._direction) {
      case "receive":
        return this.from;
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
  formattedAmount(account) {
    switch (this._direction) {
      case "receive":
        return "+" + " " + this.amount + " " + account.symbol;
      case "send":
        return "-" + " " + this.amount + " " + account.symbol;
      default:
        return "Unknown";
    }
  }
  get directionIcon() {
    switch (this._direction) {
      case "receive":
        return "../src/image/icon/ic_receive_black.png";
      case "send":
        return "../src/image/icon/ic_send_black.png";
      default:
        return "Unknown";
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Bill);


/***/ }),

/***/ "./src/javascript/screen/account.js":
/*!******************************************!*\
  !*** ./src/javascript/screen/account.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _model_bill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../model/bill */ "./src/javascript/model/bill.js");
/* harmony import */ var _layout_header__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../layout/header */ "./src/javascript/layout/header.js");
/* harmony import */ var _layout_tab_bar_navigator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../layout/tab_bar_navigator */ "./src/javascript/layout/tab_bar_navigator.js");
/* harmony import */ var _widget_bill_list__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widget/bill_list */ "./src/javascript/widget/bill_list.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/utils */ "./src/javascript/utils/utils.js");





// ++ let assetDetail = ui.getAssetDetail({ assetID });

const getAssetDetail = (assetId) => {
  if (assetId !== "e0642b1b64b8b0214e758dd0be63242839e63db7") return [];
    return [
      {
        id: (0,_utils_utils__WEBPACK_IMPORTED_MODULE_4__.randomHex)(32),
        txid: "0xaf40440a607d8ecea5236c22a70c806bcd36c29cdb81811694a3cb3f634be276",
        amount: 0.1,
        fee: 0.000021,
        message: "",
        timestamp: Date.now(),
        direction: "send",
        from: "0xe0642b1b64b8b0214e758dd0be63242839e63db7",
        to: "0xd885833741f554a0e64ffd1141887d65e0dded01",
        confirmations: 0,
      },
      {
        id: (0,_utils_utils__WEBPACK_IMPORTED_MODULE_4__.randomHex)(32),
        txid: "0xa51396e2d31bef6825b25d7078a912e3d9ecaab6bdce949e2ed5193bb7c73044",
        amount: 0.1,
        fee: 0.000021,
        message: "",
        timestamp: 1625993323880,
        direction: "receive",
        from: "0xd885833741f554a0e64ffd1141887d65e0dded01",
        to: "0xe0642b1b64b8b0214e758dd0be63242839e63db7",
        confirmations: 1,
      },
      {
        id: (0,_utils_utils__WEBPACK_IMPORTED_MODULE_4__.randomHex)(32),
        txid: "0xa51396e2d31bef6825b25d7078a912e3d9ecaab6bdce949e2ed5193bb7c73044",
        amount: 0.1,
        fee: 0.000021,
        message: "",
        timestamp: 1625953323880,
        direction: "send",
        from: "0xd885833741f554a0e64ffd1141887d65e0dded01",
        to: "0xe0642b1b64b8b0214e758dd0be63242839e63db7",
        confirmations: 4,
      },
      {
        id: (0,_utils_utils__WEBPACK_IMPORTED_MODULE_4__.randomHex)(32),
        txid: "0xab4372209b00d0669a440e93134ee7812b779b62ac4e0b254eb18541c78af3b9",
        amount: 1,
        fee: 0.000021,
        message: "",
        timestamp: 1620719000000,
        direction: "send",
        from: "0xd885833741f554a0e64ffd1141887d65e0dded01",
        to: "0xe0642b1b64b8b0214e758dd0be63242839e63db7",
        confirmations: 2160,
      },
      {
        id: (0,_utils_utils__WEBPACK_IMPORTED_MODULE_4__.randomHex)(32),
        txid: "0xab4372209b00d0669a440e93134ee7812b779b62ac4e0b254eb18541c78af3b9",
        amount: 3,
        fee: 0.000021,
        message: "",
        timestamp: 1620719218543,
        direction: "receive",
        from: "0xd885833741f554a0e64ffd1141887d65e0dded01",
        to: "0xe0642b1b64b8b0214e758dd0be63242839e63db7",
        confirmations: 214560,
      },
    ];
};

const account = (scaffold, state) => {
  const bills = getAssetDetail(state.account.id)?.map((obj) => new _model_bill__WEBPACK_IMPORTED_MODULE_0__.default(obj));
  scaffold.header = (0,_layout_header__WEBPACK_IMPORTED_MODULE_1__.default)(state);
  scaffold.body = [(0,_layout_tab_bar_navigator__WEBPACK_IMPORTED_MODULE_2__.default)(state), (0,_widget_bill_list__WEBPACK_IMPORTED_MODULE_3__.default)(state.account, bills)];
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (account);


/***/ }),

/***/ "./src/javascript/screen/address.js":
/*!******************************************!*\
  !*** ./src/javascript/screen/address.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _layout_header__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../layout/header */ "./src/javascript/layout/header.js");

// let address = ui.getReceiveAddress({ accountID });
const address = (scaffold, state) => {
    console.log(JSON.stringify(state));
    scaffold.header = (0,_layout_header__WEBPACK_IMPORTED_MODULE_0__.default)(state);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (address);

/***/ }),

/***/ "./src/javascript/screen/bill.js":
/*!***************************************!*\
  !*** ./src/javascript/screen/bill.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _layout_header__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../layout/header */ "./src/javascript/layout/header.js");


const bill = (scaffold, state) => {
    console.log(JSON.stringify(state));
    scaffold.header = (0,_layout_header__WEBPACK_IMPORTED_MODULE_0__.default)(state);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (bill);

/***/ }),

/***/ "./src/javascript/screen/overview.js":
/*!*******************************************!*\
  !*** ./src/javascript/screen/overview.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _layout_header__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../layout/header */ "./src/javascript/layout/header.js");
/* harmony import */ var _layout_bottom_navigator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../layout/bottom_navigator */ "./src/javascript/layout/bottom_navigator.js");
/* harmony import */ var _widget_account_list__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widget/account_list */ "./src/javascript/widget/account_list.js");




const overview = (scaffold, state) => {
  scaffold.header = (0,_layout_header__WEBPACK_IMPORTED_MODULE_0__.default)(state);
  scaffold.bottomNavigator = (0,_layout_bottom_navigator__WEBPACK_IMPORTED_MODULE_1__.default)(state);
  switch (state.screen) {
    case "accounts":
      scaffold.body = (0,_widget_account_list__WEBPACK_IMPORTED_MODULE_2__.default)(state);
      break;
    case "settings":
      const container = document.createElement("div");
      container.innerHTML = `<div>This is Setting page</div>`;
      scaffold.body = container;
      break;
    default:
      scaffold.body = (0,_widget_account_list__WEBPACK_IMPORTED_MODULE_2__.default)(state);
      break;
  }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (overview);


/***/ }),

/***/ "./src/javascript/screen/transaction.js":
/*!**********************************************!*\
  !*** ./src/javascript/screen/transaction.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _layout_header__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../layout/header */ "./src/javascript/layout/header.js");

// let fee = ui.getTransactionFee({ blockchainID, from, to, amount, data });
// let transaction = ui.prepareTransaction({ to, amount, data, speed }); 
// ui.sendTransaction(transaction);
const transaction = (scaffold, state) => {
    console.log(JSON.stringify(state));
    scaffold.header = (0,_layout_header__WEBPACK_IMPORTED_MODULE_0__.default)(state);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (transaction);

/***/ }),

/***/ "./src/javascript/ui.js":
/*!******************************!*\
  !*** ./src/javascript/ui.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ launchTideBitUi)
/* harmony export */ });
/* harmony import */ var _utils_route__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/route */ "./src/javascript/utils/route.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/utils */ "./src/javascript/utils/utils.js");
// MVC: View






const state = {};

// ++ let assetList = ui.getAssets();
const getAssets = () => {
    return {
        totalAsset: 52.29,
        accounts: [{
                id: _utils_utils__WEBPACK_IMPORTED_MODULE_1__.randomHex(32),
                name: "Bitcoin",
                symbol: "BTC",
                network: "mainnet",
                decimals: 8,
                publish: true,
                image: "https://www.tidebit.one/icons/btc.png",
                balance: 0,
                inUSD: 0,
            },
            {
                id: _utils_utils__WEBPACK_IMPORTED_MODULE_1__.randomHex(32),
                name: "Bitcoin",
                symbol: "BTC",
                network: "testnet",
                decimals: 8,
                publish: false,
                image: "https://www.tidebit.one/icons/btc.png",
                balance: 0,
                inUSD: 0,
            },
            {
                id: _utils_utils__WEBPACK_IMPORTED_MODULE_1__.randomHex(32),
                name: "Ethereum",
                symbol: "ETH",
                network: "mainnet",
                decimals: 18,
                publish: true,
                image: "https://www.tidebit.one/icons/eth.png",
                balance: 0,
                inUSD: 0,
            },
            {
                id: 'e0642b1b64b8b0214e758dd0be63242839e63db7',
                name: "Ethereum",
                symbol: "ETH",
                network: "ropsten",
                decimals: 18,
                publish: false,
                image: "https://www.tidebit.one/icons/eth.png",
                balance: 2,
                inUSD: 52.29,
            },
            {
                id: _utils_utils__WEBPACK_IMPORTED_MODULE_1__.randomHex(32),
                name: "Tidetain",
                symbol: "TTN",
                network: "mainnet",
                decimals: 18,
                publish: true,
                image: "https://www.tidebit.one/icons/eth.png",
                balance: 0,
                inUSD: 0,
            },
        ],
    };
};

const setWallet = (mode, fiat) => {
    return {
        mode: mode,
        fiat: fiat,
    };
};

const startApp = () => {
    state.user = getAssets();
    state.walletConfig = setWallet("development", {
        symbol: "USD",
        inUSD: 1
    });
    state.screen = 'accounts';
    (0,_utils_route__WEBPACK_IMPORTED_MODULE_0__.default)(state);
    // --
    _utils_utils__WEBPACK_IMPORTED_MODULE_1__.dateFormatter(Date.now());
};


function launchTideBitUi(options, callback) {
    startApp();
}

/***/ }),

/***/ "./src/javascript/utils/route.js":
/*!***************************************!*\
  !*** ./src/javascript/utils/route.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _layout_scaffold__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../layout/scaffold */ "./src/javascript/layout/scaffold.js");
/* harmony import */ var _screen_overview__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../screen/overview */ "./src/javascript/screen/overview.js");
/* harmony import */ var _screen_account__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../screen/account */ "./src/javascript/screen/account.js");
/* harmony import */ var _screen_transaction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../screen/transaction */ "./src/javascript/screen/transaction.js");
/* harmony import */ var _screen_address__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../screen/address */ "./src/javascript/screen/address.js");
/* harmony import */ var _screen_bill__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../screen/bill */ "./src/javascript/screen/bill.js");







customElements.define("scaffold-widget", _layout_scaffold__WEBPACK_IMPORTED_MODULE_0__.default);

const setup = () => {
  document.body.replaceChildren();
  const root = document.createElement("scaffold-widget");
  document.body.insertAdjacentElement("afterbegin", root);
  return root;
};

const route = (state) => {
  const root = setup();
  switch (state.screen) {
    case "accounts":
    case "settings":
      (0,_screen_overview__WEBPACK_IMPORTED_MODULE_1__.default)(root, state);
      break;
    case "account":
      (0,_screen_account__WEBPACK_IMPORTED_MODULE_2__.default)(root, state);
      break;
    case "transaction":
      (0,_screen_transaction__WEBPACK_IMPORTED_MODULE_3__.default)(root, state);
      break;
    case "address":
      (0,_screen_address__WEBPACK_IMPORTED_MODULE_4__.default)(root, state);
      break;
    case "bill":
      (0,_screen_bill__WEBPACK_IMPORTED_MODULE_5__.default)(root, state);
      break;
  }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (route);


/***/ }),

/***/ "./src/javascript/utils/utils.js":
/*!***************************************!*\
  !*** ./src/javascript/utils/utils.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "randomHex": () => (/* binding */ randomHex),
/* harmony export */   "dateFormatter": () => (/* binding */ dateFormatter),
/* harmony export */   "addressFormatter": () => (/* binding */ addressFormatter)
/* harmony export */ });
const randomHex = (n) => {
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

const pad = (n) => {
  return n < 10 ? "0" + n : n;
};

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const dateFormatter = (timestamp) => {
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
  const mmddyyyykkmm =
    monthNames[month] +
    " " +
    pad(date) +
    "," +
    year +
    " " +
    hours +
    ":" +
    pad(minutes) +
    " " +
    suffix;
  console.log(`mmddyyyykkmm: ${mmddyyyykkmm}`);

  return mmddyyyykkmm;
};

const addressFormatter = (address, showLength = 6) => {
  if (address.length <= showLength * 2) return address;
  const prefix = address.slice(0, showLength);
  const suffix = address.slice(address.length - showLength, address.length);
  return prefix + "..." + suffix;
};


/***/ }),

/***/ "./src/javascript/widget/account_item.js":
/*!***********************************************!*\
  !*** ./src/javascript/widget/account_item.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_route__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/route */ "./src/javascript/utils/route.js");

class AccountItem extends HTMLElement {
  constructor() {
    super(); // always call super() first in the constructor.
    this.markup = () => `
    <div class="account-item__icon">
        <img src=${this.account.image} alt=${this.account.symbol.toUpperCase()}>
    </div>
    <div class="account-item__symbol">${this.account.symbol.toUpperCase()}</div>
    <div class="account-item__balance">${this.account.balance}</div>
    <div class="account-item__to-currency">
        <span class="almost-equal-to">&#8776;</span>
        <span class="balance">${this.account.infiat}</span>
        <span class="currency-unit">${this.fiat.symbol}</span>
    </div>
      `;
    this.addEventListener("click", (_) => {
      if (this.account) {
        this.state.account = this.account;
        this.state.backward = "accounts";
        this.state.screen = "account";
        (0,_utils_route__WEBPACK_IMPORTED_MODULE_0__.default)(this.state);
      } else {
        return;
      }
    });
  }
  connectedCallback() {
    this.className = "account-item";
  }
  get publish() {
    return this.hasAttribute("publish");
  }
  set publish(val) {
    if (val) {
      this.setAttribute("publish", "");
    } else {
      this.removeAttribute("publish");
    }
  }
  exchange() {
    if (this.fiat) {
      this.account.infiat = this.account.inUSD / this.fiat.inUSD;
      return;
    }
    return;
  }
  set child(data) {
    this.state = JSON.parse(JSON.stringify(data.state));
    this.account = JSON.parse(JSON.stringify(data.account));
    this.fiat = this.state.walletConfig.fiat;
    this.exchange();
    this.insertAdjacentHTML("afterbegin", this.markup());
    this.publish = this.account.publish;
    this.id = this.account.id;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AccountItem);


/***/ }),

/***/ "./src/javascript/widget/account_list.js":
/*!***********************************************!*\
  !*** ./src/javascript/widget/account_list.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _account_item__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./account_item */ "./src/javascript/widget/account_item.js");


customElements.define("account-item", _account_item__WEBPACK_IMPORTED_MODULE_0__.default);

const accountList = (state) => {
  const accountList = document.createElement("div");
  accountList.className = "account-list";
  state.user.accounts.forEach((account) => {
    const accountItem = document.createElement("account-item");
    accountItem.child = {
      state: state,
      account: account,
    };
    accountList.insertAdjacentElement("beforeend", accountItem);
  });
  return accountList;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (accountList);


/***/ }),

/***/ "./src/javascript/widget/bill_item.js":
/*!********************************************!*\
  !*** ./src/javascript/widget/bill_item.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/javascript/utils/utils.js");


class BillItem extends HTMLElement {
  constructor() {
    super();
    this.markup = () => `
    <div class="bill-item__main">
        <div class="bill-item__icon">
            <img src=${
              this.bill.directionIcon
            } alt=${this.bill.action.toLowerCase()}>
        </div>
        <div class="bill-item__title">
            <div class="bill-item__action">${this.bill.action}</div>
            <div class="bill-item__detail">
                <span class="bill-item__direction">${this.bill.direction}</span>
                <span class="bill-item__address">${(0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.addressFormatter)(
                  this.bill.address
                )}</span>
            </div>
        </div>
        <div class="bill-item__suffix">
            <div class="bill-item__amount">${this.bill.formattedAmount(
              this.account
            )}</div>
            <div class="bill-item__time">${this.bill.dateTime}</div>
        </div>
    </div>
    <div class="bill-item__sub">
        <div class="bill-item__status">${this.bill.status}</div>
        <div class="bill-item__progress"><span style="width: ${this.bill.progress}"></span></div>
    </div>
        `;
    this.addEventListener("click", () => {
      // let transactionDetail = ui.getTransactionDetail({ transactionID });
    });
  }
  connectedCallback() {
    this.classList = ["bill-item"];
  }
  static get observedAttributes() {
    return ["pending", "confirming", "complete"];
  }
  set status(val) {
    if (this.hasAttribute("pending")) this.removeAttribute("pending");
    if (this.hasAttribute("confirming")) this.removeAttribute("confirming");
    if (this.hasAttribute("complete")) this.removeAttribute("complete");
    this.setAttribute(val, "");
  }
  set action(val) {
    this.setAttribute(val, "");
  }
  set child(data) {
    this.account = data.account;
    this.bill = data.bill;
    this.insertAdjacentHTML("afterbegin", this.markup());
    this.status = this.bill.status.toLowerCase();
    this.action = this.bill.action.toLowerCase();
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BillItem);


/***/ }),

/***/ "./src/javascript/widget/bill_list.js":
/*!********************************************!*\
  !*** ./src/javascript/widget/bill_list.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _bill_item__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bill_item */ "./src/javascript/widget/bill_item.js");


customElements.define("bill-item", _bill_item__WEBPACK_IMPORTED_MODULE_0__.default);

const billList = (account, bills) => {
  const billList = document.createElement("div");
  billList.className = "bill-list";
  bills.forEach((bill) => {
    const billItem = document.createElement("bill-item");
    billItem.child = {
      account: account,
      bill: bill,
    };
    billList.insertAdjacentElement("beforeend", billItem);
  });
  return billList;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (billList);


/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scss/main.scss */ "./src/scss/main.scss");
/* harmony import */ var _javascript_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./javascript/index */ "./src/javascript/index.js");

__webpack_require__ (/*! ./image/icon/icon16.png */ "./src/image/icon/icon16.png");
__webpack_require__ (/*! ./image/icon/icon48.png */ "./src/image/icon/icon48.png");
__webpack_require__ (/*! ./image/icon/icon128.png */ "./src/image/icon/icon128.png");


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
/******/ 			id: moduleId,
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
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
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
/******/ 		__webpack_require__.h = () => ("91e6e4f97f65ea601b3e")
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
/******/ 		__webpack_require__.p = scriptUrl + "../";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/css loading */
/******/ 	(() => {
/******/ 		var createStylesheet = (chunkId, fullhref, resolve, reject) => {
/******/ 			var linkTag = document.createElement("link");
/******/ 		
/******/ 			linkTag.rel = "stylesheet";
/******/ 			linkTag.type = "text/css";
/******/ 			var onLinkComplete = (event) => {
/******/ 				// avoid mem leaks.
/******/ 				linkTag.onerror = linkTag.onload = null;
/******/ 				if (event.type === 'load') {
/******/ 					resolve();
/******/ 				} else {
/******/ 					var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 					var realHref = event && event.target && event.target.href || fullhref;
/******/ 					var err = new Error("Loading CSS chunk " + chunkId + " failed.\n(" + realHref + ")");
/******/ 					err.code = "CSS_CHUNK_LOAD_FAILED";
/******/ 					err.type = errorType;
/******/ 					err.request = realHref;
/******/ 					linkTag.parentNode.removeChild(linkTag)
/******/ 					reject(err);
/******/ 				}
/******/ 			}
/******/ 			linkTag.onerror = linkTag.onload = onLinkComplete;
/******/ 			linkTag.href = fullhref;
/******/ 		
/******/ 			document.head.appendChild(linkTag);
/******/ 			return linkTag;
/******/ 		};
/******/ 		var findStylesheet = (href, fullhref) => {
/******/ 			var existingLinkTags = document.getElementsByTagName("link");
/******/ 			for(var i = 0; i < existingLinkTags.length; i++) {
/******/ 				var tag = existingLinkTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");
/******/ 				if(tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return tag;
/******/ 			}
/******/ 			var existingStyleTags = document.getElementsByTagName("style");
/******/ 			for(var i = 0; i < existingStyleTags.length; i++) {
/******/ 				var tag = existingStyleTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href");
/******/ 				if(dataHref === href || dataHref === fullhref) return tag;
/******/ 			}
/******/ 		};
/******/ 		var loadStylesheet = (chunkId) => {
/******/ 			return new Promise((resolve, reject) => {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				if(findStylesheet(href, fullhref)) return resolve();
/******/ 				createStylesheet(chunkId, fullhref, resolve, reject);
/******/ 			});
/******/ 		}
/******/ 		// no chunk loading
/******/ 		
/******/ 		var oldTags = [];
/******/ 		var newTags = [];
/******/ 		var applyHandler = (options) => {
/******/ 			return { dispose: () => {
/******/ 				for(var i = 0; i < oldTags.length; i++) {
/******/ 					var oldTag = oldTags[i];
/******/ 					if(oldTag.parentNode) oldTag.parentNode.removeChild(oldTag);
/******/ 				}
/******/ 				oldTags.length = 0;
/******/ 			}, apply: () => {
/******/ 				for(var i = 0; i < newTags.length; i++) newTags[i].rel = "stylesheet";
/******/ 				newTags.length = 0;
/******/ 			} };
/******/ 		}
/******/ 		__webpack_require__.hmrC.miniCss = (chunkIds, removedChunks, removedModules, promises, applyHandlers, updatedModulesList) => {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			chunkIds.forEach((chunkId) => {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				var oldTag = findStylesheet(href, fullhref);
/******/ 				if(!oldTag) return;
/******/ 				promises.push(new Promise((resolve, reject) => {
/******/ 					var tag = createStylesheet(chunkId, fullhref, () => {
/******/ 						tag.as = "style";
/******/ 						tag.rel = "preload";
/******/ 						resolve();
/******/ 					}, reject);
/******/ 					oldTags.push(oldTag);
/******/ 					newTags.push(tag);
/******/ 				}));
/******/ 			});
/******/ 		}
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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map