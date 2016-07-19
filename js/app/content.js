/**
 * Created by stefanlin on 7/18/16.
 */

// TODO: FIX THIS FUNCTION
function update_favicon(request){
  var link = document.querySelector("head link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "icon");
    document.body.appendChild(link);
  }
  var betterFavicon = localStorage["better-favicon"];
  if (betterFavicon) {
    link.type = "image/x-icon";
    link.href = betterFavicon;
  } else {
    var payload = {url: window.location.href};
    chrome.extension.sendRequest(payload, function(response) {
      link.type = "image/x-icon";
      link.href = response;
      localStorage["better-favicon"] = response;
    });
  }
}

chrome.runtime.onMessage.addListener(function(message, sender, response){
  // VALIDATE THE MESSAGE RECEIVED
  if(message.from === 'popup' && message.subject === 'HighlightTab'){
    
  }
});