// Service worker for the extension

let offscreenCreated = false;
let darkModeState = false;

chrome.runtime.onInstalled.addListener(() => {
    console.log('Colorful PWA extension installed');
    createOffscreenDocument();
});

// Ensure offscreen document exists when service worker starts
chrome.runtime.onStartup?.addListener(() => {
    createOffscreenDocument();
});

// Listen for all messages (dark theme changes, etc)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!offscreenCreated) {
        createOffscreenDocument();
    }
    
    // Dark theme changed notification from offscreen
    if (message.type === 'darkThemeChanged') {
        darkModeState = message.data;
        console.log('Dark mode state updated:', darkModeState);
        setDarkModeIcons(darkModeState);
        return true;
    }
    
    // Query for dark theme (e.g., from popup)
    if (message === 'checkDarkTheme') {
        checkDarkTheme().then(sendResponse);
        return true;
    }
});

async function createOffscreenDocument() {
    if (offscreenCreated) return;
    
    try {
        await chrome.offscreen.createDocument({
            url: 'offscreen.html',
            reasons: ['MATCH_MEDIA'],
            justification: 'Detect dark theme preference using matchMedia'
        });
        offscreenCreated = true;
        console.log('Offscreen document created successfully');
        
        // Query initial dark mode state
        setTimeout(() => {
            console.log('BACKGROUND: Querying initial dark mode state...');
            checkDarkTheme().then((isDark) => {
                console.log('BACKGROUND: Initial result:', isDark);
                darkModeState = isDark;
                setDarkModeIcons(isDark);
            }).catch((err) => {
                console.error('BACKGROUND: Error getting initial state:', err);
            });
        }, 500);
    } catch (error) {
        if (error.message.includes('already exists')) {
            offscreenCreated = true;
            // Query initial state since document already exists
            setTimeout(() => {
                console.log('BACKGROUND: Querying existing offscreen for initial state...');
                checkDarkTheme().then((isDark) => {
                    console.log('BACKGROUND: Initial result (existing):', isDark);
                    darkModeState = isDark;
                    setDarkModeIcons(isDark);
                }).catch((err) => {
                    console.error('BACKGROUND: Error:', err);
                });
            }, 500);
        } else {
            console.error('Error creating offscreen document:', error);
        }
    }
}

async function checkDarkTheme() {
    try {
        // Ensure offscreen document exists
        if (!offscreenCreated) {
            await createOffscreenDocument();
        }
        
        // Query the offscreen document
        console.log('BACKGROUND: Querying offscreen for dark mode state...');
        const result = await chrome.runtime.sendMessage({ checkDarkTheme: true });
        console.log('BACKGROUND: checkDarkTheme result:', result, 'Type:', typeof result, 'Boolean:', Boolean(result));
        return result;
    } catch (error) {
        console.error('BACKGROUND: Error checking dark theme:', error);
        return false;
    }
}

function setDarkModeIcons(enabled) {
    console.log('BACKGROUND: setDarkModeIcons called with:', enabled, 'Type:', typeof enabled);
    
    // Ensure boolean value
    const isDark = Boolean(enabled);
    console.log('BACKGROUND: Boolean value:', isDark);
    
    if (isDark) {
        console.log('BACKGROUND: SETTING DARK ICONS');
        chrome.action.setIcon({
            path: {
                '16': 'icons/icon16_dark.png',
                '48': 'icons/icon48_dark.png',
                '128': 'icons/icon128_dark.png'
            }
        }).then(() => {
            console.log('BACKGROUND: Dark icons set successfully');
        }).catch((err) => {
            console.warn('BACKGROUND: Failed to set dark icons:', err);
            setLightModeIcons();
        });
    } else {
        console.log('BACKGROUND: SETTING LIGHT ICONS');
        setLightModeIcons();
    }
}

function setLightModeIcons() {
    console.log('BACKGROUND: SETTING LIGHT ICONS');
    chrome.action.setIcon({
        path: {
            '16': 'icons/icon16.png',
            '48': 'icons/icon48.png',
            '128': 'icons/icon128.png'
        }
    }).then(() => {
        console.log('BACKGROUND: Light icons set successfully');
    }).catch((err) => {
        console.warn('BACKGROUND: Failed to set light icons:', err);
    });
}
