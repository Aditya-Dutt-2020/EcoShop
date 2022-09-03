// background.js

let color1 = '#0000ff';
let color2 = '#00ff00';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({color1, color2});
    console.log('Default background set to %cgreen', `color: ${color1}`);
});
