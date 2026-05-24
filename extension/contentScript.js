let url = window.location.hostname;
let backup = null;
let activeColor = null;
let inactiveColor = null;

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

function unsetMeta() {
    const metas = getThemeMetas();
    if (backup === null) {
        metas.forEach((m) => m.remove());
    } else {
        metas.forEach((m) => m.setAttribute('content', backup));
    }
}

function applyWindowColor() {
    if (!activeColor) {
        return;
    }

    if (document.hasFocus()) {
        setMeta(activeColor);
    } else {
        setMeta(inactiveColor || activeColor);
    }
}

function handleWindowFocus() {
    if (activeColor) {
        setMeta(activeColor);
    }
}

function handleWindowBlur() {
    if (activeColor) {
        setMeta(inactiveColor || activeColor);
    }
}

function setColor() {
    chrome.storage.sync.get([url], (data) => {
        const urlData = data[url] || {};
        const baseActive = urlData.activeColor ?? urlData.color;
        if (urlData.enabled && baseActive != null) {
            activeColor = baseActive;
            inactiveColor = urlData.inactiveColor ?? urlData.color ?? baseActive;
            applyWindowColor();
        } else {
            activeColor = null;
            inactiveColor = null;
            unsetMeta();
        }
    });
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

window.addEventListener('focus', handleWindowFocus);
window.addEventListener('blur', handleWindowBlur);
window.addEventListener('load', () => {
    backupColor();
    setColor();
});
