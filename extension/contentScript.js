let url = window.location.hostname;
let backup = null;
let observer = null;
let desiredColor = null;
let compatibilityEnabled = false;

function getThemeMetas() {
    return Array.from(document.querySelectorAll('meta[name=theme-color]'));
}

function ensureMetaColor(color) {
    const metas = getThemeMetas();
    if (metas.length === 0) {
        const meta = document.createElement('meta');
        meta.setAttribute('name', 'theme-color');
        meta.setAttribute('content', color);
        document.getElementsByTagName('head')[0].appendChild(meta);
        return;
    }

    metas.forEach((m) => {
        if (m.getAttribute('content') !== color) {
            m.setAttribute('content', color);
        }
    });
}

function setMeta(color) {
    ensureMetaColor(color);
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

    observer = new MutationObserver((mutations) => {
        if (!compatibilityEnabled || desiredColor === null) {
            return;
        }
        // Whenever meta tags are added/changed/removed, ensure our color is applied to all of them
        ensureMetaColor(desiredColor);
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

    const metas = getThemeMetas();
    if (backup === null) {
        metas.forEach((m) => m.remove());
    } else {
        metas.forEach((m) => m.setAttribute('content', backup));
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
