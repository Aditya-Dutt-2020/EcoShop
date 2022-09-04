console.log("Chrome extension ready");
let changeColor = document.getElementById("changecolor");
let putLinkHere = document.getElementById("putLinkHere");
let insertTable = document.getElementById("insertTable");

chrome.storage.sync.get("color1", ({ color1 }) => {
    changeColor.style.backgroundColor = color1;
    
});

changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: findText,
    });
    
    console.log("got out of script");
    
});

// The body of this function will be executed as a content script inside the
// current page

async function findText() {
    console.log("running findtext");
    let validProductTCINS = [];
    let validProductUPCs = [];
    const apiKey = "58B878BADCAE4FD2A07309684F579DBB";
    const included = ["Video Games", "Cell Phones", "Wearable Technology", "Computers & Office", "WiFi & Networking", "Speakers & Audio Systems"];
    const tcins = document.getElementsByClassName("styles__StyledRow-sc-wmoju4-0 eXqHoq styles__CartItemRow-sc-1c25lz9-0 gkSykD h-padding-a-default");
    const names = document.getElementsByClassName("Truncate-sc-10p6c43-0 bqqQyW");
    for (var i = 0; i < tcins.length; i++) {
        //console.log(`next loop i=${i}`);
        let catUrl = `https://api.redcircleapi.com/request?api_key=${apiKey}&search_term=${tcins[i].dataset.tcin}+&type=search`;
        console.log(catUrl);
        //console.log(`https://api.redcircleapi.com/request?api_key=${apiKey}&search_term=${tcins[i].dataset.tcin}+&type=search`);
        //let url = 'https://api.redcircleapi.com/categories?api_key=e59ce3b531b2c39afb2e2b8a71ff10113aac2a14&parent_id=5xtg6';
        await fetch(catUrl)
            .then(res => res.json())
            .then(out => {

                for (cat of out.categories) {
                    let catName = cat.name;
                    if (included.includes(catName)) {
                        console.log(`you can test ${names[i].getElementsByTagName('div')[0].innerHTML}(${tcins[i].dataset.tcin}) in category ${catName}`);
                        validProductTCINS.push(tcins[i].dataset.tcin);
                        break;
                    }
                }
            }
            );

    }
    //validProductTCINS = [86769766];
    console.log(validProductTCINS.length);
    for (theTcin of validProductTCINS)
    {
        let upcUrl = `https://api.redcircleapi.com/request?api_key=${apiKey}&type=product&tcin=${theTcin}`;
        console.log(upcUrl);
        await fetch(upcUrl)
            .then(res => res.json())
            .then(out => {
                validProductUPCs.push([out.product.title,out.product.out]);
            }
            );
        console.log("done fetching?");
    }
    console.log("yes done fetching");
    console.log(validProductTCINS.length);

    console.log(validProductUPCs);
    //var myArray = [[9049,"Madden"],[1010,"fortnite"]];
    chrome.runtime.sendMessage({theMessage: validProductUPCs}, function(response) {
        console.log(response.status);
    });
    /*if (window.confirm('Press OK to see how sustainable your product is!')) 
    {
        window.open("https://missiondice.org", '_blank').focus();
    };*/
    //return 1234;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        addedHTML = `<table class="center">`;
        let products = request.theMessage;
        for(prod of products)
        {
            addedHTML += `
            <tr>
            <td>${prod[0]}</td>
            `
            addedHTML += `
            <td><a href="https://revamamritkar.wixsite.com/eco-shop/epeat" target="_blank"><img src="images/EnergyStar.jpg"></a></td>
            <td><img src="images/epeat_Silver.jpg"></td>
                    <td><img src="images/tco.png"></td>
            </tr>

            `
        }
        addedHTML+="</table>";
        insertTable.innerHTML=addedHTML;
        sendResponse({status: addedHTML});
    }
);