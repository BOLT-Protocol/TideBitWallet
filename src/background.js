import { randomHex } from "./helpers/helper";
import TideWallet from "./index";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ InstallID: randomHex(32) });
});
console.log("hi");

(async () => {
  const tw = new TideWallet();
  console.log("hi");
  const api = {
    apiURL: "https://service.tidewallet.io/api/v1",
    apiKey: "f2a76e8431b02f263a0e1a0c34a70466",
    apiSecret: "9e37d67450dc906042fde75113ecb78c",
  };
  const user1 = {
    OAuthID: "test2ejknkjdniednwjq",
    InstallID:
      "11f6d3e524f367952cb838bf7ef24e0cfb5865d7b8a8fe5c699f748b2fada249",
    mnemonic:
      "cry hub inmate cliff sun program public else atom absurd release inherit funny edge assault",
    password: "12345",
  };
  const user2 = {
    OAuthID: "test2ejknkjdniednwjq",
    InstallID:
      "11f6d3e524f367952cb838bf7ef24e0cfb5865d7b8a8fe5c699f748b2fada249",
  };
  await tw.init({ user: user2, api });
  // test
  console.log("overview:", await tw.overview());
  console.log(
    "getAssetDetail:",
    await tw.getAssetDetail({
      assetID: "a7255d05-eacf-4278-9139-0cfceb9abed6",
    })
  );
  console.log(
    "getTransactionDetail:",
    await tw.getTransactionDetail({
      assetID: "a7255d05-eacf-4278-9139-0cfceb9abed6",
      transactionID: "",
    })
  );
  console.log(
    "getReceivingAddress:",
    await tw.getReceivingAddress({
      accountID: "a7255d05-eacf-4278-9139-0cfceb9abed6",
    })
  );
  console.log("getWalletConfig:", await tw.getWalletConfig());
  await tw.sync();
  console.log("backup:", await tw.backup());
  await tw.close();
})();

console.log("hi");

// chrome.action.onClicked.addListener((tab) => {
//   async () => {
//     const tw = new TideWallet();
//     const api = {
//       apiURL: "https://service.tidewallet.io/api/v1",
//       apiKey: "f2a76e8431b02f263a0e1a0c34a70466",
//       apiSecret: "9e37d67450dc906042fde75113ecb78c",
//     };
//     const user1 = {
//       OAuthID: "test2ejknkjdniednwjq",
//       InstallID:
//         "11f6d3e524f367952cb838bf7ef24e0cfb5865d7b8a8fe5c699f748b2fada249",
//       mnemonic:
//         "cry hub inmate cliff sun program public else atom absurd release inherit funny edge assault",
//       password: "12345",
//     };
//     const user2 = {
//       OAuthID: "test2ejknkjdniednwjq",
//       InstallID:
//         "11f6d3e524f367952cb838bf7ef24e0cfb5865d7b8a8fe5c699f748b2fada249",
//     };
//     await tw.init({ user: user2, api });
//     // test
//     console.log("overview:", await tw.overview());
//     console.log(
//       "getAssetDetail:",
//       await tw.getAssetDetail({
//         assetID: "a7255d05-eacf-4278-9139-0cfceb9abed6",
//       })
//     );
//     console.log(
//       "getTransactionDetail:",
//       await tw.getTransactionDetail({
//         assetID: "a7255d05-eacf-4278-9139-0cfceb9abed6",
//         transactionID: "",
//       })
//     );
//     console.log(
//       "getReceivingAddress:",
//       await tw.getReceivingAddress({
//         accountID: "a7255d05-eacf-4278-9139-0cfceb9abed6",
//       })
//     );
//     console.log("getWalletConfig:", await tw.getWalletConfig());
//     await tw.sync();
//     console.log("backup:", await tw.backup());
//     await tw.close();
//   };
// });
