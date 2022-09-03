console.log("Chrome extension ready");
let changeColor = document.getElementById("changecolor");
chrome.storage.sync.get("color", ({ color }) => {
    changeColor.style.backgroundColor = color;
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
  function findText() {
   console.log("running findtext");
   const tcins = document.getElementsByClassName("styles__StyledRow-sc-wmoju4-0 eXqHoq styles__CartItemRow-sc-1c25lz9-0 gkSykD h-padding-a-default");
   for (elt of tcins)
    {
        console.log(elt.dataset.tcin);
    }

  }
/*
document.onreadystatechange = () => {
    switch(document.readyState)
    {
        case "interactive":
            console.log("interactive");
            break;
        case "loading":
            console.log("loading");
            break;
        case "complete":
            console.log("complete");
            loaded();
            break;
    }
  }

function loaded()
{
    console.log("loaded");
    const list = document.getElementsByClassName("styles__StyledRow-sc-wmoju4-0 eXqHoq styles__CartItemRow-sc-1c25lz9-0 gkSykD h-padding-a-default");
    console.log(list.length);
    for (elt of list)
    {
        elt.style['background-color'] = "#FF00FF";
        console.log("found an element");
    }
}

document.addEventListener("load", doneLoading);

function doneLoading()
{
    console.log("totally finished loading");
}


/*
document.addEventListener("DOMContentLoaded", loaded);

function loaded()
{
    console.log("dom content loaded");
}



let list = document.querySelectorAll('[aria-label="cart item ready to fulfill"]');
console.log(list.length);
for (elt of list)
{
    elt.style['background-color'] = "#FF00FF";
    console.log("found an element");
}*/