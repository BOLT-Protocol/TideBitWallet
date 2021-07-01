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
      console.log(token);
      resolve(token);
    });
  });

export const googleSignin = async () => {
  // https://stackoverflow.com/questions/44968953/how-to-create-a-login-using-google-in-chrome-extension/44987478
  const token = await getAuthToken();
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
