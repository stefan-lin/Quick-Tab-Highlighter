/**
 * Created by stefanlin on 7/18/16.
 */

// TODO: FIX THIS FUNCTION
/**
 *
 * color_code is a string indicates color code
 */
function update_favicon(color_code){
  var favicon_link_element = document.querySelector("head link[rel~='icon']");
  if(!favicon_url) {
    favicon_link_element = document.createElement("link");
    favicon_link_element.setAttribute("rel", "icon");
    document.body.appendChild(favicon_link_element);
  }
  var new_favicon = localStorage[color_code];
  if(new_favicon) {
    favicon_link_element.type = "image/x-icon";
    favicon_link_element.href = new_favicon;
  }
  else{
    chrome.extension.sendRequest(color_code, function(response) {
      favicon_link_element.type = "image/x-icon";
      favicon_link_element.href = response;
      localStorage[color_code] = response;
    });
  } // END IF-ELSE
} // END FUNCTION

chrome.runtime.onMessage.addListener(function(message, sender, response){
  // VALIDATE THE MESSAGE RECEIVED
  if(message.from === 'popup' && message.subject === 'HighlightTab'){
    
  }
});