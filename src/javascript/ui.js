// MVC: View
import Scaffold from "./layout/scaffold";
import overview from "./screen/overview";

import {
    randomHex
} from "./utils/utils";

// root element
customElements.define("scaffold-widget", Scaffold);
const root = document.createElement("scaffold-widget");
document.body.insertAdjacentElement("afterbegin", root);


const state = {};

const getUser = () => {
    return {
        totalAsset: 52.29,
        accounts: [{
                id: randomHex(32),
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
                id: randomHex(32),
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
                id: randomHex(32),
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
                id: randomHex(32),
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
                id: randomHex(32),
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
    state.user = getUser();
    state.walletConfig = setWallet("development", {
        symbol: "USD",
        inUSD: 1
    });
    state.screen = 'accounts';
    route(state);
};

const route = (state) => {
    // document.body.replaceChildren();
    switch (state.screen) {
        case 'accounts':
        case 'settings':
            overview(root, state);
            break;
        case 'account':
            // account();
    }
}

export default function launchTideBitUi(options, callback) {
    startApp();
}