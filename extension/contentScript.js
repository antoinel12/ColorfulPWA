let url = window.location.hostname;
let backup = null;
let observer = null;
let desiredColor = null;
let compatibilityEnabled = false;

function getThemeMeta() {
    return document.querySelector('meta[name=theme-color]');
}

function setMeta(color) {
    let meta = getThemeMeta();
    if (meta === null) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'theme-color');
        document.getElementsByTagName('head')[0].appendChild(meta);
    }
    meta.setAttribute('content', color);
}

function disconnectObserver() {
    if (observer !== null) {
        observer.disconnect();
        observer = null;
    }
}

function createObserver() {
    if (observer !== null) {
        return;
    }

    observer = new MutationObserver(() => {
        if (!compatibilityEnabled || desiredColor === null) {
            return;
        }
        const meta = getThemeMeta();
        if (meta === null || meta.getAttribute('content') !== desiredColor) {
            setMeta(desiredColor);
        }
    });

    observer.observe(document.head, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['content']
    });
}

function unsetMeta() {
    disconnectObserver();

    let meta = getThemeMeta();
    if (backup === null) {
        if (meta !== null) {
            meta.remove();
        }
    } else if (meta !== null) {
        meta.setAttribute('content', backup);
    }
}

function setColor() {
    chrome.storage.sync.get(
        { [url]: { enabled: false, color: null, compatibility: false } },
        (data) => {
            if (data[url] !== undefined) {
                if (data[url].enabled && data[url].color !== null) {
                    desiredColor = data[url].color;
                    compatibilityEnabled = data[url].compatibility ?? false;
                    setMeta(desiredColor);
                    if (compatibilityEnabled) {
                        createObserver();
                    } else {
                        disconnectObserver();
                    }
                } else {
                    desiredColor = null;
                    compatibilityEnabled = false;
                    unsetMeta();
                }
            }
        }
    );
}

function backupColor() {
    let meta = document.querySelector('meta[name=theme-color]');
    if (meta !== null) {
        backup = meta.getAttribute('content');
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.getUrl) {
        sendResponse(url);
    } else if (request.colorChanged) {
        setColor();
        sendResponse();
    }
    return true;
});

window.addEventListener('load', () => {
    backupColor();
    setColor();
});
