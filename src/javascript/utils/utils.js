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
    "," +
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
