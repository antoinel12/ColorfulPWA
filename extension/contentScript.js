let url = window.location.hostname;
let backup = null;
let compatibilityTimer = null;

function setMeta(color) {
    let meta = document.querySelector('meta[name=theme-color]');
    if (meta === null) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'theme-color');
        document.getElementsByTagName('head')[0].appendChild(meta);
    }
    meta.setAttribute('content', color);
}

function unsetMeta() {
    if (compatibilityTimer !== null) {
        clearTimeout(compatibilityTimer);
        compatibilityTimer = null;
    }

    let meta = document.querySelector('meta[name=theme-color]');
    if (backup === null) {
        if (meta !== null) {
            meta.remove();
        }
    } else if (meta !== null) {
        meta.setAttribute('content', backup);
    }
}

function scheduleSetMeta(color, compatibility) {
    if (compatibility) {
        if (compatibilityTimer !== null) {
            clearTimeout(compatibilityTimer);
        }

        compatibilityTimer = setTimeout(() => {
            setMeta(color);
            compatibilityTimer = null;
        }, 1000);
    } else {
        if (compatibilityTimer !== null) {
            clearTimeout(compatibilityTimer);
            compatibilityTimer = null;
        }
        setMeta(color);
    }
}

function setColor() {
    chrome.storage.sync.get(
        { [url]: { enabled: false, color: null, compatibility: false } },
        (data) => {
            if (data[url] !== undefined) {
                if (data[url].enabled && data[url].color !== null) {
                    scheduleSetMeta(data[url].color, data[url].compatibility ?? false);
                } else {
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
