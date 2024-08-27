console.log("file ssssloaded");

if (module.hot) {
  const originalCheck = module.hot.check;
  module.hot.check = (...args) => {
    return originalCheck(...args).then((updatedModules) => {
      if (updatedModules) {
        alert("Hey there")
        // Notify the extension to reload the iframe
        console.log("HMR is in play")
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          var currentTab = tabs[0]; // there will be only one in this array
          chrome.tabs.sendMessage(currentTab.id, { action: "reload" }, function (response) {
            console.log(response.farewell);
          });
        });
        window.postMessage({ type: 'webpackRebuildComplete' }, '*');
      }
      return updatedModules;
    });
  };
}


if (module.hot) {
  module.hot.accept();
  module.hot.addStatusHandler((status) => {
    if (status === 'idle') {
      chrome.tabs.sendMessage(currentTab.id, { action: "reload" }, function (response) {
        console.log(response.farewell);
      });
      // When WDS goes back to idle, post a message indicating a successful rebuild
      window.postMessage({ type: 'webpackRebuildComplete' }, '*');
    }
  });
}