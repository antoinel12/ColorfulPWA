// Track dark mode state
let darkModeState = false;
let mediaQueryList = null;

// Initialize dark mode detection
function initDarkModeDetection() {
    mediaQueryList = matchMedia('(prefers-color-scheme: dark)');
    darkModeState = mediaQueryList.matches;
    
    // Listen for changes
    mediaQueryList.addEventListener('change', (e) => {
        darkModeState = e.matches;
        console.log('Dark mode changed:', darkModeState);
        setDarkModeIcons(darkModeState);
        
        // Notify background worker
        chrome.runtime.sendMessage({
            type: 'darkThemeChanged',
            data: darkModeState
        }).catch(() => {});
    });
    
    // Set initial icons
    setDarkModeIcons(darkModeState);
    
    console.log('Dark mode detection initialized. Current state:', darkModeState);
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg === 'checkDarkTheme' || msg.checkDarkTheme) {
        console.log('checkDarkTheme request. Returning:', darkModeState);
        sendResponse(darkModeState);
    }
    return true;
});

async function checkDarkTheme() {
    console.log('checkDarkTheme called. Returning:', darkModeState);
    return darkModeState;
}

function setDarkModeIcons(enabled) {
    console.log('Setting icons for dark mode:', enabled);
    
    if (enabled) {
        chrome.action.setIcon({
            path: {
                '16': 'icons/icon16_dark.png',
                '48': 'icons/icon48_dark.png',
                '128': 'icons/icon128_dark.png'
            }
        }).catch((err) => {
            console.warn('Failed to set dark icons:', err);
            setLightModeIcons();
        });
    } else {
        setLightModeIcons();
    }
}

function setLightModeIcons() {
    chrome.action.setIcon({
        path: {
            '16': 'icons/icon16.png',
            '48': 'icons/icon48.png',
            '128': 'icons/icon128.png'
        }
    }).catch((err) => {
        console.warn('Failed to set light icons:', err);
    });
}

// Start detection when script loads
initDarkModeDetection();
