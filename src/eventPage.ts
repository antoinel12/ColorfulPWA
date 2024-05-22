(async () => {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['MATCH_MEDIA'],
      justification: '!',
    }).catch(() => {});
    enableDarkMode(await chrome.runtime.sendMessage('checkDarkTheme'));
    chrome.offscreen.closeDocument();
})();
  
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === 'darkThemeChanged') {
        enableDarkMode(message.data);
    }
    return true;
});
  
function enableDarkMode(enabled) {
    if(enabled){
        chrome.action.setIcon({
            path: {
                "16": "../icon16_dark.png",
                "48": "../icon48_dark.png",
                "128": "../icon128_dark.png"
            }
        });
    }
}