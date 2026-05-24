// Default values
const DEFAULT_DISABLED = false;
const DEFAULT_ENABLED = false;
const DEFAULT_COLOR = '#FFFFFF';
const DEFAULT_URL = '';

// UI Elements
const urlInput = document.getElementById('url-input');
const enabledCheckbox = document.getElementById('enabled-checkbox');
const colorInput = document.getElementById('color-input');
const versionSpan = document.getElementById('version');

// Set version number
chrome.runtime.getManifest().version && (versionSpan.textContent = `v${chrome.runtime.getManifest().version}`);

// State
let state = {
    disabled: DEFAULT_DISABLED,
    enabled: DEFAULT_ENABLED,
    color: DEFAULT_COLOR,
    url: DEFAULT_URL
};

// Update color preview when color changes
colorInput.addEventListener('change', handleColorChange);

// Handle enabled checkbox
enabledCheckbox.addEventListener('change', handleEnabledChange);

// Handle compatibility checkbox
// (compatibility mode removed)

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
                        color: DEFAULT_COLOR,
                        url: DEFAULT_URL
                    });
                    return;
                }

                const url = response;
                
                chrome.storage.sync.get(
                    { [url]: { enabled: DEFAULT_ENABLED, color: DEFAULT_COLOR } },
                    (data) => {
                        if (data[url] !== undefined) {
                            setState({
                                disabled: DEFAULT_DISABLED,
                                enabled: data[url].enabled,
                                color: data[url].color,
                                url: url
                            });
                        } else {
                            setState({
                                disabled: DEFAULT_DISABLED,
                                enabled: DEFAULT_ENABLED,
                                color: DEFAULT_COLOR,
                                url: url
                            });
                        }
                    }
                );
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
    colorInput.value = state.color;
    colorInput.disabled = state.disabled;
}

function handleColorChange(event) {
    const newColor = event.target.value;
    setState({
        ...state,
        color: newColor
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
                    color: state.color
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
