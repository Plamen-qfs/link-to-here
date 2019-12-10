function genericOnClick(node) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            url: "doStuff"
        }, function(response) {
            var checkLinkByOpening = '-1';
            chrome.storage.sync.get({
                openLink: 'Dont open'
            }, function(data) {
                checkLinkByOpening = data.openLink;
                if (checkLinkByOpening == "In current tab") {
                    chrome.tabs.update({
                        url: response.farewell
                    });
                }
                if (checkLinkByOpening == "In a new tab") {
                    chrome.tabs.create({
                        url: response.farewell
                    });
                }
            });
        });
    });
}
chrome.contextMenus.create({
    "title": "Link-2-here",
    "contexts": ['all'],
    "onclick": genericOnClick
});