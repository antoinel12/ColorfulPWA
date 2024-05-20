chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg === 'checkDarkTheme') {
        checkDarkTheme(msg).then(sendResponse);
    }
    return true;
});

async function checkDarkTheme(request) {
    return matchMedia('(prefers-color-scheme: dark)').matches;
}