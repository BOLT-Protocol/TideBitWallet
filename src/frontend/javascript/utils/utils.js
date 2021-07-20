import mode from "../constant/config";
import viewController from "../controller/view";
import Asset from "../model/asset";
import Fiat from "../model/fiat";

export const randomHex = (n) => {
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

export const to = (promise) => {
  return promise
    .then((data) => {
      return [null, data];
    })
    .catch((err) => [err, null]);
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
export const dateFormatter = (timestamp) => {
  const dateTime = new Date(timestamp * 1000);
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
    ", " +
    year +
    " " +
    hours +
    ":" +
    pad(minutes) +
    " " +
    suffix;
  return mmddyyyykkmm;
};

export const addressFormatter = (address, showLength = 6) => {
  if (address.length <= showLength * 2) return address;
  const prefix = address.slice(0, showLength);
  const suffix = address.slice(address.length - showLength, address.length);
  return prefix + "..." + suffix;
};

export const currentView = () => {
  const scaffold = document.querySelector("scaffold-widget");
  const view = scaffold?.attributes?.view?.value;
  return view;
};

export const getInstallID = () => {
  const key = "InstallID";
  let InstallID;
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([key], (result) => {
      console.log(result);
      if (result[key] === undefined) {
        InstallID = randomHex(32);
        chrome.storage.sync.set({ InstallID });
      } else {
        InstallID = result[key];
      }
      resolve(InstallID);
    });
  });
};

const getAuthToken = () =>
  new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (token) resolve(token);
      else reject(new Error("The user did not approve access"));
    });
  });

export const googleSignIn = async () => {
  // https://stackoverflow.com/questions/44968953/how-to-create-a-login-using-google-in-chrome-extension/44987478
  let token;
  try {
    token = await getAuthToken();
  } catch (e) {
    throw e;
  }

  if (!token) return;
  const init = {
    method: "GET",
    async: true,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    contentType: "json",
  };
  const data = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
    init
  ).then((respose) => respose.json());
  console.log(data);
  return data.id;
};

export const getUserInfo = async (tidewallet) => {
  viewController.route("assets");
  const _fiat = await tidewallet.getFiat();
  const fiat = new Fiat(_fiat);
  const dashboard = await tidewallet.overview();
  const balance = dashboard?.balance;
  const assets = dashboard?.currencies?.map((currency) => new Asset(currency));
  viewController.updateAssets(assets, balance, fiat);
};
/**
 *
 * @param {Object} tidewallet
 * @param {Object} data
 * @param {Boolean} debugMode
 * @returns {Array} response[0] is Boolean, represent excution result
 * @returns {Array} if process got error, response[1] is Error Object, else is undefined.
 */
export const checkUser = async (tidewallet, data = {}, debugMode) => {
  const api = {
    apiURL: "https://staging.tidewallet.io/api/v1",
    apiKey: "f2a76e8431b02f263a0e1a0c34a70466",
    apiSecret: "9e37d67450dc906042fde75113ecb78c",
  };
  let OAuthID, InstallID, error;
  try {
    OAuthID = await googleSignIn();
  } catch (e) {
    console.log(e);
    error = e;
    return [false, error];
  }
  try {
    InstallID = await getInstallID();
  } catch (e) {
    console.log(e);
    error = e;
    return [false, error];
  }
  console.log("OAuthID :", OAuthID); // -- test
  console.log("InstallID :", InstallID); // -- test
  return [true];
  try {
    const user = await tidewallet.checkUser({
      user: {
        OAuthID,
        InstallID,
      },
      api,
    });
    return [true, user];
  } catch (e) {
    console.log("checkUser error :", e); // -- test
    return [false, e];
  }
};

/**
 *
 * @param {Object} tidewallet
 * @param {Object} data
 * @param {Boolean} debugMode
 * @returns {Array} response[0] is Boolean, represent excution result
 * @returns {Array} if process got error, response[1] is Error Object, else is undefined.
 */
export const initUser = async (tidewallet, data = {}, debugMode) => {
  console.log("mnemonic :", data?.mnemonic); // -- test
  console.log("passphrase :", data?.passphrase); // -- test
  console.log("Utils initUser debugMode :", debugMode); // -- test
  mode.debug = debugMode ?? false;
  console.log("Utils initUser  mode.debug :", mode.debug); // -- test
  try {
    await tidewallet.init({
      user: {
        OAuthID,
        InstallID,
        mnemonic: data?.mnemonic,
        password: data?.passphrase,
      },
      api,
      debugMode: mode.debug,
    });
    return [true];
  } catch (e) {
    error = e;
    return [false, error];
  }
};
