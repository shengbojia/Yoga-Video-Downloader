const REQUEST_SIGNATURE = "vimeo/SEARCH_VIDEOS"

function createDownloadButton(config) {
    var element = document.createElement("a");
    element.target = "_blank";
    element.className = "download-element";
    element.href = config.url;
    element.innerHTML = "<b> Download " + config.width + "px </b>";
    return element;
}

function setConfigs(configs = []) {
    const linksContainer = document.querySelector("#links");
    for (const config of configs) {
        linksContainer.appendChild(createDownloadButton(config));
    }
}

function scanForVideos() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, REQUEST_SIGNATURE);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    document
        .querySelector("#scan_button")
        .addEventListener("click", scanForVideos);
});

chrome.extension.onRequest.addListener(function (
    message,
    sender,
    sendResponse
) {
    if (message.type === "SET_CONFIGS") {
        setConfigs(message.payload);
        sendResponse(true);
    } else sendResponse(false);
});
