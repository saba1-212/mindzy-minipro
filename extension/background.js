

let focusMode = false;
 
setInterval(() => {

  chrome.storage.local.get(
    ["focusMode"],
    (data) => {

      focusMode =
        data.focusMode === "on";

    }
  );

}, 1000);




const blockedSites = [

  "instagram.com",
  "facebook.com",
  "youtube.com/shorts",
  "twitter.com"
  

];

chrome.webNavigation.onBeforeNavigate.addListener(

  (details) => {

    if (!focusMode) return;

    const url = details.url;

    const isBlocked = blockedSites.some(site =>
      url.includes(site)
    );

    if (isBlocked) {

      chrome.tabs.update(details.tabId, {

        url:
          chrome.runtime.getURL("blocked.html")

      });

    }

  }

);

