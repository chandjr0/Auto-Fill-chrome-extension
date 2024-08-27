chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  // Perform further initialization or background tasks
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "triggerCustomEvent") {
    const customEvent = new CustomEvent("MyCustomEvent", { detail: request.data });
    document.dispatchEvent(customEvent);
  }
  if (request.action === "getCookie") {
    const cookieDetails = {
      url: "https://app.rampedcareers.com/",
      name: "ramped-extension-login-token",
    };
    chrome.cookies.get(cookieDetails, function (cookie) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        sendResponse({ data: cookie.value, activeTab: activeTab });
      });
    });
    return true; // Indicates you wish to send a response asynchronously
  }
  if (request.action === 'closeIFrame') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { type: "message_to_content_script", action: request.action });
    });
  }
  if (request.action === 'moveFrame') {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { action: request.action});
    });
  }
  if (request.action === "openNewTab") {
    chrome.tabs.create({ url: request.url }, () => {
        console.log("New tab opened");
    });
  }

  if (request.action === "saveExtensionData") {
    const { auth, currentUrl, InputFields } = request.data;
    console.log("Request data received in background script:", InputFields);
    var url = `https://ramped-api-dot-extended-spark-381423.uc.r.appspot.com/save-data-extension`;

    var postData = {
        "job_url": currentUrl,
        "form_list": InputFields,
        "auth": auth,
    };
    sendResponse({ success: true });
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
    })
    .then(function (response) {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(function (responseData) {
        if (responseData.response === "Data Saved Successfully") {
            console.log("Data saved successfully");
            sendResponse({ success: true });
        } else {
            console.error("Failed to save data:", responseData);
            sendResponse({ success: false });
        }
    })
    .catch(function (error) {
        console.error("Fetch failed:", error);
        sendResponse({ success: false });
    });
    
    // Return true to indicate you will send a response asynchronously
    return true;
}


});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { action: "MyCustomEvent", data: "Your data here" });
});
