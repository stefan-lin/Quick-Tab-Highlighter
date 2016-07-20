/**
 * Created by stefanlin on 7/18/16.
 */

// GLOBAL
const BLOCK_GRAPHIC_CHAR = '&#9608';

function title_marqee_effect(origin_title, special_char){
  document.title = origin_title + special_char;
  var c = origin_title.charAt(0);
  var s = origin_title.substring(1);
  //s += c;
  var t = window.setTimeout(function(){
    title_marqee_effect(s, c);
  }, 300);
}

/**
 *
 * color_code is a string indicates color code
 */
// TODO: maybe implement margee effect to the title
function update_favicon(color_code){
  var favicon_link_element = document.querySelector("head link[rel~='icon']");
  
  if(!favicon_link_element) {
    favicon_link_element = document.createElement("link");
    favicon_link_element.setAttribute("rel", "icon");
    document.body.appendChild(favicon_link_element);
  }
  
  // TODO: fix this part later (isolate the localStorage)
  delete localStorage[color_code];
  //var new_favicon = localStorage[color_code];
  var new_favicon = null;
  
  
  if(new_favicon) {
    favicon_link_element.type = "image/x-icon";
    favicon_link_element.href = new_favicon;
  }
  else{
    console.log('[content] sending message from content to background');
    chrome.runtime.sendMessage({
        color  : color_code,
        from   : 'content',
        subject: 'HighlightTab'
      },
      function(new_favicon_url) {
        // REPLACE favicon
        favicon_link_element.type = "image/x-icon";
        favicon_link_element.href = new_favicon_url;
        // STORE favicon FOR LATER USAGE
        localStorage[color_code]  = new_favicon_url;
        
        document.title = '\u26D4' + document.title;
        //title_marqee_effect('Google', '\u26D4');
        console.log('favicon replaced and saved')
    });
  } // END IF-ELSE
} // END FUNCTION

chrome.runtime.onMessage.addListener(
  function(message, sender, callback){
    console.log('content string received message');
    // VALIDATE THE MESSAGE RECEIVED
    if(message.from == 'popup' && message.subject == 'HighlightTab'){
      update_favicon(message.color);
      callback({msg: 'update_favicon_complete!'});
    }
});
