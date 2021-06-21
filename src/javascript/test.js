import overview from "./screen/overview";
import route from "./utils/route";
import { randomHex } from "./utils/utils";

const createTestAccount = (id) => {
  return {
    id: id ? id : randomHex(32),
    name: "Aretha",
    symbol: "ARE",
    network: "Testnet",
    decimals: 8,
    publish: true,
    image: "https://www.tidebit.one/icons/btc.png",
    balance: 100,
    inUSD: 30000,
  };
};

window.createTestAccount = createTestAccount;
window.overview = overview;
window.route = route;
