const { Keccak } = require("sha3");
const hash = new Keccak(256);

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
class Cryptor {
  static keccak256round(str, round = 2) {
    let result = str.replace("0x", "");

    if (round > 0) {
      result = hash.update(result).digest("hex");
      return Cryptor.keccak256round(result, round - 1);
    }

    return result;
  }

  static randomBytes(length) {
    let hexStr = "";
    if (length > 0) {
      hexStr = randomHex(length);
    }
    return Buffer.from(hexStr, "hex");
  }

  static pathParse(keyPath) {
    if (typeof keyPath !== "string")
      throw new Error("keyPath should be string");
    // keyPath = "m/84'/3324'/0'/0/0"

    const arr = keyPath.split("/");
    const chainIndex = arr[4];
    const keyIndex = arr[5];
    const options = {
      path: `${arr[0]}/${arr[1]}/${arr[2]}`,
    };
    return { chainIndex, keyIndex, options };
  }
}

export default Cryptor;
