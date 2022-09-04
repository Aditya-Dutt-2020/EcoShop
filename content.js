console.log("Chrome extension ready");
import x from './epeatdata.json' assert {type: 'json'};
import x2 from './estar.json' assert {type: 'json'};
let changeColor = document.getElementById("changecolor");
let spinner = document.getElementById("putSpinnerHere");
let insertTable = document.getElementById("insertTable");

chrome.storage.sync.get("color1", ({ color1 }) => {
    changeColor.style.backgroundColor = color1;
    
});

changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    spinner.innerHTML=`<div class="loader"></div>`;
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
    //let prodName = "Samsung LH75BETHLGFXZA-RB 75\" Direct-Lit 4K Crystal UHD LED Display - Certified Refurbished";
    //let validProductUPCs = [[prodName.substring(0,26), 887276439969, "https://target.scene7.com/is/image/Target//GUEST_92c7d8fb-11e8-453e-b391-354cb36b35bc?qlt=80&fmt=webp"]];
    
    const apiKey = "58B878BADCAE4FD2A07309684F579DBB";
    const included = ["Electronics", "Video Games", "Cell Phones", "Wearable Technology", "Computers & Office", "WiFi & Networking", "Speakers & Audio Systems"];
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
                validProductUPCs.push([out.product.title.substring(0,26),out.product.upc, out.product.main_image.link]);
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
        let addedHTML = `<table class="center">`;
        let products = request.theMessage;
        for(var prod of products)
        {
            addedHTML += `
            <tr>
            <td><img src="${prod[2]}"></td>
            <td>${prod[0]}</td>
            `;
            let analysis = analyze(prod[1]);
            let epeatAward = analysis[0];
            let estarAward = analysis[1];
            switch (epeatAward)
            {
              case 1:
                addedHTML+=`<td><a href="https://revamamritkar.wixsite.com/eco-shop/epeat" target="_blank"><img src="images/epeat_Bronze.jpg"></a></td>`;
                break;
              case 2:
                addedHTML+=`<td><a href="https://revamamritkar.wixsite.com/eco-shop/epeat" target="_blank"><img src="images/epeat_Silver.jpg"></a></td>`;
                break;
              case 3:
                addedHTML+=`<td><a href="https://revamamritkar.wixsite.com/eco-shop/epeat" target="_blank"><img src="images/epeat_Gold.jpg"></a></td>`;
                break;
              default:
                break;
            }
            if (estarAward==1)
            {
            addedHTML+=`<td><a href="https://revamamritkar.wixsite.com/eco-shop/energy-star" target="_blank"><img src="images/EnergyStar.jpg"></a></td>`;
            }
            addedHTML+="</tr>"
            
        }
        addedHTML+="</table>";
        insertTable.innerHTML=addedHTML;
        spinner.innerHTML=``;
        sendResponse({status: addedHTML});
       // sendResponse({status: analyze(887276439969)})
    }
);

function analyze(inUPC) {
    return [analyzeEPEAT(inUPC), analyzeEstar(inUPC)];
}

function analyzeEPEAT(inUPC) {
    var upc = parseInt(inUPC);
    
    var award = 0;
    for (var i = 0; i< x.Report.length; i++) {
      var entry = x.Report[i];
      try {
        var upcArray = entry["Universal Product Code"].split(", ");
        if(upcArray.includes(String(upc))) {
          award = entry["EPEAT Tier"];
          break;
        }
      }
      catch {};
      try {
        if(entry["Universal Product Code"]==parseInt(upc)) {
          award = entry["EPEAT Tier"];
          break;
        }
      }
      catch {};
      }
    
      switch(award) {
        case "Bronze":
          return 1;
        case "Silver":
          return 2;
        case "Gold":
          return 3;
        default:
          return 0;
      }
}
function analyzeEstar(inUPC) {
    var upc = parseInt(inUPC);
    
    var award = 0;
    for (var i = 0; i< x2.Report.length; i++) {
      var entry = x2.Report[i];
      try {
        var upcArray = entry["UPC"].split(";");
        if(upcArray.includes(String(upc))) {
          award = 1;
          break;
        }
      }
      catch {};
      try {
        if(entry["Universal Product Code"]==parseInt(upc)) {
          award = 1;
          break;
        }
      }
      catch {};
      }
    
      return award;
    
    }