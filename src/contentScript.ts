let url = window.location.hostname;
let backup: string = null;

function setMeta(color: string){
    let meta = document.querySelector('meta[name=theme-color]');
    if(meta === null){
        meta = document.createElement('meta');
        meta.setAttribute('name', 'theme-color');
        document.getElementsByTagName('head')[0].appendChild(meta);
    }
    meta.setAttribute('content', color);
}

function unsetMeta(){
    let meta = document.querySelector('meta[name=theme-color]');
    if(backup === null) {
        if(meta !== null) {
            meta.remove();
        }
    }
    else {
        meta.setAttribute('content', backup);
    }
}

function setColor(){
    chrome.storage.sync.get({[url]: {enabled: false, color: null}}, (data)=> {
        if(data[url] !== undefined){
            if(data[url].enabled && data[url].color !== null){
                setMeta(data[url].color);
            }
            else {
                unsetMeta();
            }
        }
    });
}

function backupColor(){
    let meta = document.querySelector('meta[name=theme-color]');
    if(meta !== null){
        backup = meta.getAttribute('content');
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.getUrl) {
        sendResponse(url);
    }
    else if(request.colorChanged){
        setColor();
        sendResponse();
    }
});

setColor();