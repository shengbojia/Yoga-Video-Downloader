const REQUEST_SIGNATURE = "vimeo/SEARCH_VIDEOS"

function parseConfigs(rawHtml) {
    const cleanedHtml = rawHtml.replace(/\s+/gi, "");
    const start = cleanedHtml.search('"progressive":');
    const end = cleanedHtml.search(/}]},/g);

    if (start === -1 || end === -1) {
        return [];
    }

    const configsJsonString = cleanedHtml.slice(start, end).replace(/\"progressive\":/g, "") + "}]";
    const configsJson = JSON.parse(configsJsonString);

    return configsJson;
}

function parsePage() {
    const mHtml = document.body.innerHTML;
    const configsJson = parseConfigs(mHtml);

    return configsJson.sort((x, y) => (x.width <= y.width ? -1 : 1));
}

chrome.runtime.onMessage.addListener(function (request) {
    if (request === REQUEST_SIGNATURE) {
        setTimeout(
            function () {
                const configsJson = parsePage();
                chrome.extension.sendRequest({ type: "SET_CONFIGS", payload: configsJson });
            },
            1000);
    }
});