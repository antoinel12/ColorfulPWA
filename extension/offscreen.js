// Track dark mode state - start as null, verify on init
let darkModeState = null;
let mediaQueryList = null;

// Initialize dark mode detection with detailed diagnostics
function initDarkModeDetection() {
    try {
        console.log('OFFSCREEN: === Starting Dark Mode Detection ===');
        
        // Get system preference via matchMedia
        mediaQueryList = matchMedia('(prefers-color-scheme: dark)');
        const matchesValue = mediaQueryList.matches;
        
        console.log('OFFSCREEN: mediaQueryList object:', mediaQueryList);
        console.log('OFFSCREEN: mediaQueryList.matches:', matchesValue);
        
        // Alternative check - try without parentheses or with different syntax
        const altCheck = window.matchMedia('(prefers-color-scheme: dark)');
        console.log('OFFSCREEN: Alternative check - matches:', altCheck.matches);
        
        // Check computed style
        const htmlElement = document.documentElement;
        const computedStyle = window.getComputedStyle(htmlElement);
        console.log('OFFSCREEN: Computed color-scheme:', computedStyle.colorScheme);
        console.log('OFFSCREEN: HTML element:', htmlElement);
        
        // Check if we can detect light mode explicitly
        const lightMedia = matchMedia('(prefers-color-scheme: light)');
        console.log('OFFSCREEN: Light mode media query matches:', lightMedia.matches);
        
        darkModeState = matchesValue;
        console.log('OFFSCREEN: Final darkModeState set to:', darkModeState);
        console.log('OFFSCREEN: === Dark Mode Detection Complete ===');
        
        // Listen for changes and notify background worker
        mediaQueryList.addEventListener('change', (e) => {
            darkModeState = e.matches;
            console.log('OFFSCREEN: Dark mode CHANGED to:', darkModeState);
            
            // Notify background worker about the change
            chrome.runtime.sendMessage({
                type: 'darkThemeChanged',
                data: darkModeState
            }).catch((err) => {
                console.warn('OFFSCREEN: Failed to notify about change:', err);
            });
        });
    } catch (err) {
        console.error('OFFSCREEN: Error in initDarkModeDetection:', err);
        darkModeState = false;
    }
}

// Handle queries from background worker
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg === 'checkDarkTheme' || msg.checkDarkTheme) {
        // Ensure initialized
        if (darkModeState === null) {
            console.log('OFFSCREEN: Not initialized yet, initializing...');
            initDarkModeDetection();
        }
        console.log('OFFSCREEN: Responding to checkDarkTheme with darkModeState:', darkModeState);
        sendResponse(darkModeState);
        return true;
    }
});

// Start detection immediately
console.log('OFFSCREEN: Script loading, initializing dark mode detection...');
initDarkModeDetection();
