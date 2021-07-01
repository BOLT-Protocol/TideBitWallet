// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log(
//     sender.tab
//       ? "from a content script:" + sender.tab.url
//       : "from the extension"
//   );
//   console.log(request);
//   console.log(request.data);
//   if (request.action === "init") {
//     console.log(request);
//     sendResponse({ result: "success" });
//   }
// });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  console.log(request, sender, sendResponse);
  sendResponse('我收到你的消息了：'+JSON.stringify("request"));
});