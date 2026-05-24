// Default values
const DEFAULT_DISABLED = false;
const DEFAULT_ENABLED = false;
const DEFAULT_COLOR = '#FFFFFF';
const DEFAULT_INACTIVE_COLOR = '#D3D3D3';
const DEFAULT_URL = '';

// UI Elements
const urlInput = document.getElementById('url-input');
const enabledCheckbox = document.getElementById('enabled-checkbox');
const colorInput = document.getElementById('color-input');
const inactiveColorInput = document.getElementById('inactive-color-input');
const versionSpan = document.getElementById('version');

// Set version number
chrome.runtime.getManifest().version && (versionSpan.textContent = `v${chrome.runtime.getManifest().version}`);

// State
let state = {
    disabled: DEFAULT_DISABLED,
    enabled: DEFAULT_ENABLED,
    activeColor: DEFAULT_COLOR,
    inactiveColor: DEFAULT_INACTIVE_COLOR,
    url: DEFAULT_URL
};

// Update color preview when color changes
colorInput.addEventListener('change', handleActiveColorChange);
inactiveColorInput.addEventListener('change', handleInactiveColorChange);

// Handle enabled checkbox
enabledCheckbox.addEventListener('change', handleEnabledChange);

// Initialize popup
function init() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) return;
        
        chrome.tabs.sendMessage(
            tabs[0].id,
            { getUrl: true },
            null,
            (response) => {
                if (typeof response === 'undefined' && chrome.runtime.lastError) {
                    setState({
                        disabled: true,
                        enabled: DEFAULT_ENABLED,
                        activeColor: DEFAULT_COLOR,
                        inactiveColor: DEFAULT_INACTIVE_COLOR,
                        url: DEFAULT_URL
                    });
                    return;
                }

                const url = response;
                
                chrome.storage.sync.get([url], (data) => {
                    const urlData = data[url] || {};
                    setState({
                        disabled: DEFAULT_DISABLED,
                        enabled: urlData.enabled ?? DEFAULT_ENABLED,
                        activeColor: urlData.activeColor ?? urlData.color ?? DEFAULT_COLOR,
                        inactiveColor: urlData.inactiveColor ?? DEFAULT_INACTIVE_COLOR,
                        url: url
                    });
                });
            }
        );
    });
}

// Update UI based on state
function setState(newState) {
    state = newState;
    updateUI();
}

function updateUI() {
    urlInput.value = state.url;
    urlInput.disabled = state.disabled;
    enabledCheckbox.checked = state.enabled;
    enabledCheckbox.disabled = state.disabled;
    colorInput.value = state.activeColor;
    colorInput.disabled = state.disabled;
    inactiveColorInput.value = state.inactiveColor;
    inactiveColorInput.disabled = state.disabled;
}

function handleActiveColorChange(event) {
    const newColor = event.target.value;
    setState({
        ...state,
        activeColor: newColor
    });
    saveState();
}

function handleInactiveColorChange(event) {
    const newColor = event.target.value;
    setState({
        ...state,
        inactiveColor: newColor
    });
    saveState();
}

function handleEnabledChange(event) {
    setState({
        ...state,
        enabled: event.target.checked
    });
    saveState();
}

function saveState() {
    if (state.url !== '') {
        chrome.storage.sync.set(
            {
                [state.url]: {
                    enabled: state.enabled,
                    activeColor: state.activeColor,
                    inactiveColor: state.inactiveColor,
                    color: state.activeColor
                }
            },
            () => {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs.length > 0) {
                        chrome.tabs.sendMessage(tabs[0].id, { colorChanged: true });
                    }
                });
            }
        );
    }
}

// Initialize on popup open
init();
