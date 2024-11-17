
chrome.commands.onCommand.addListener(command => {
  if (command === "run-script") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
              chrome.scripting.executeScript({
                  target: { tabId: tabs[0].id },
                  files: ["contentScript.js"]
              });
          }
      });
  }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "dataFromContent") {
        console.log("data received in background:");
        chrome.runtime.sendMessage({ type: "dataForPopup", data: message.data });
    }
    if (message.type === "screenshot"){
        console.log("screenshot received in background:");
        console.log(message.data.toDataURL());

    }
});