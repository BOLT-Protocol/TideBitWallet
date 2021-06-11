// MVC: View
import route from './utils/route';


import {
    randomHex
} from "./utils/utils";


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


export default function launchTideBitUi(options, callback) {
    startApp();
}