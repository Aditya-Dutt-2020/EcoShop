console.log("Chrome extension ready");
let changeColor = document.getElementById("changecolor");
let newTab = document.getElementById("new tab");
let putLinkHere = document.getElementById("putLinkHere");


chrome.storage.sync.get("color1", ({ color1 }) => {
    changeColor.style.backgroundColor = color1;
    
});
chrome.storage.sync.get("color2", ({ color2 }) => {
    newTab.style.backgroundColor = color2;
});

newTab.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    putLinkHere.innerHTML = `<a href="https://missiondice.org" target="_blank">link</a>`;
});


changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: findText,
    });
});

// The body of this function will be executed as a content script inside the
// current page

async function findText() {
    console.log("running findtext");
    let validProductNames = [];
    const apiKey = "55FE679652F34B34804D031B34D74CBA";
    const included = ["Video Games", "Cell Phones", "Headphones", "Wearable Technology", "Computers & Office", "WiFi & Networking", "Speakers & Audio Systems"];
    const tcins = document.getElementsByClassName("styles__StyledRow-sc-wmoju4-0 eXqHoq styles__CartItemRow-sc-1c25lz9-0 gkSykD h-padding-a-default");
    const names = document.getElementsByClassName("Truncate-sc-10p6c43-0 bqqQyW");
    for (var i = 0; i < tcins.length; i++) {
        //console.log(`next loop i=${i}`);
        let url = `https://api.redcircleapi.com/request?api_key=${apiKey}&search_term=${tcins[i].dataset.tcin}+&type=search`;
        //console.log(`https://api.redcircleapi.com/request?api_key=${apiKey}&search_term=${tcins[i].dataset.tcin}+&type=search`);
        //let url = 'https://api.redcircleapi.com/categories?api_key=e59ce3b531b2c39afb2e2b8a71ff10113aac2a14&parent_id=5xtg6';
        await fetch(url)
            .then(res => res.json())
            .then(out => {

                for (cat of out.categories) {
                    let catName = cat.name;
                    if (included.includes(catName)) {
                        console.log(`you can test ${names[i].getElementsByTagName('div')[0].innerHTML}(${tcins[i].dataset.tcin}) in category ${catName}`);
                        validProductNames.push(names[i].getElementsByTagName('div')[0].innerHTML);
                        break;
                    }
                }
            }
            );

    }
    
    console.log(validProductNames);
    return true;
}

