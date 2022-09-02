// background.js

let color = '#0000ff';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({color});
    console.log('Default background set to %cgreen', `color: ${color}`);
});
