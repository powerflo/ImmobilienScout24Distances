chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');

    console.log(request);

    fetch(request.url)
        .then(parseJSON)
        .then(sendResponse);
    return true;
});

// Parse JSON from response body
async function parseJSON(response) {
    const text = await response.text();

    let json;
    try {
        json = JSON.parse(text);
    } catch (e) {
        return Promise.reject({ error: new Error(text) });
    }

    return {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        ok: response.ok,
        json,
    };
}
