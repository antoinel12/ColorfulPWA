const darkMode = window.matchMedia('(prefers-color-scheme: dark)');
console.log(darkMode);

function enableDarkMode(enabled) {
    if(enabled){
        chrome.browserAction.setIcon({
            path: {
                "16": "icon16_dark.png",
                "48": "icon48_dark.png",
                "128": "icon128_dark.png"
            }
        });
    }
}

enableDarkMode(darkMode);