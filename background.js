// background.js

let color1 = '#b2ebc7';


chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({color1});
    console.log('Default background set to %cgreen', `color: ${color1}`);
});
