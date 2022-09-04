// background.js

let color1 = '#ade0a8';


chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({color1});
    console.log('Default background set to %cgreen', `color: ${color1}`);
});
