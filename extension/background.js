// Service worker for the extension

let offscreenCreated = false;

chrome.runtime.onInstalled.addListener(() => {
    console.log('Colorful PWA extension installed');
    createOffscreenDocument();
});

// Ensure offscreen document exists when service worker starts
chrome.runtime.onStartup?.addListener(() => {
    createOffscreenDocument();
});

// Also try to create on first message if not exists
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!offscreenCreated) {
        createOffscreenDocument();
    }
    
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
    } catch (error) {
        if (error.message.includes('already exists')) {
            offscreenCreated = true;
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
        const result = await chrome.runtime.sendMessage({ checkDarkTheme: true });
        return result;
    } catch (error) {
        console.error('Error checking dark theme:', error);
        return false;
    }
}
