/**
 * Created by stefanlin on 7/18/16.
 */

/*
NOT WORK (favicon replacement)
 http://jscolor.com/examples/
 */

// GLOBAL
var origin_favicon_url    = null;
var origin_title          = null;
var favicon_link_element  = null;
var favicon_link_elements = null;
var tab_url               = null;

function title_marqee_effect(origin_title, special_char){
  document.title = origin_title + special_char;
  var c = origin_title.charAt(0);
  var s = origin_title.substring(1);
  var t = window.setTimeout(function(){
    title_marqee_effect(s, c);
  }, 300);
}

function collect_tabInfo(){
  var link_ele = document.querySelector("head link[rel~='icon");
  var link_list = document.querySelectorAll('head link[rel~="icon"');
  console.log(link_list);
  
  if(!link_ele){
    console.log('failed to find favicon url');
    chrome.runtime.sendMessage({
      from   : 'content',
      subject: 'DefaultFavicon',
      action:   'GET'
    }, function(response){
      console.log(response);
      origin_favicon_url = response;
    });
  }
  else{
    origin_favicon_url = link_ele.href;
    console.log('found faviocn url: ' + origin_favicon_url);
  }
  origin_title = document.title;
}

function create_link_element(){
  console.log('[content] creating link element')
  favicon_link_element = document.createElement("link");
  favicon_link_element.setAttribute("rel", "shortcut icon");
  document.head.appendChild(favicon_link_element);
  console.log(favicon_link_element);
}

// TODO: implement here to update the history
function replace_favicon(new_url, color_code, special_char){
  console.log(new_url);
  console.log(origin_favicon_url);
  var curr_url = favicon_link_element.href;
  console.log(curr_url);
  favicon_link_element.type = "image/x-icon";
  if(new_url != curr_url){
    favicon_link_element.href = new_url;
    if(curr_url == origin_favicon_url){
      document.title = special_char + document.title;
    }
    else{
      document.title = special_char + document.title.substr(1);
    }
    // add entry to history
    chrome.runtime.sendMessage({
      color       : color_code,
      special_char: special_char,
      from        : 'content',
      subject     : 'UpdateHistory',
      action      : 'SET',
      title       : origin_title
    }, function(result){
      console.log(result);
    });
  }
  else{
    favicon_link_element.href = origin_favicon_url;
    document.title = origin_title;
    // delete entry from history
    chrome.runtime.sendMessage({
      color: color_code,
      special_char: special_char,
      from: 'content',
      subject: 'UpdateHistory',
      action: 'DELETE'
    }, function(result){
      console.log(result);
    });
  }
}

/**
 *
 * color_code is a string indicates color code
 */
// TODO: maybe implement margee effect to the title
function update_favicon(color_code, special_char){
  favicon_link_element = document.querySelector("head link[rel~='icon']");
  
  console.log(favicon_link_element);
  if(!favicon_link_element) {
    create_link_element();
  }
  
  // TODO: fix this part later (isolate the localStorage)
  //delete localStorage[color_code];
  var new_favicon = null;
  
  
  if(new_favicon) {
    replace_favicon(new_favicon, special_char);  ////TODO: FIX THIS ONE
  }
  else{
    console.log('[content] sending message from content to background');
    chrome.runtime.sendMessage({
        color   : color_code,
        from    : 'content',
        subject : 'HighlightTab',
        curr_url: tab_url
      },
      function(new_favicon_url) {
        // REPLACE favicon
        replace_favicon(new_favicon_url, color_code, special_char);
        
        // STORE favicon FOR LATER USAGE
        //localStorage[color_code]  = new_favicon_url;
        console.log('favicon replaced and saved')
    });
  } // END IF-ELSE
} // END FUNCTION

collect_tabInfo();
chrome.runtime.onMessage.addListener(
  function(message, sender, callback){
    console.log('content string received message');
    // VALIDATE THE MESSAGE RECEIVED
    if(message.from == 'popup' && message.subject == 'HighlightTab'){
      update_favicon(message.color, message.special_char);
      callback({msg: 'update_favicon_complete!'});
    }
    if(message.from == 'background' && message.subject == 'HighlightTab'){
      update_favicon(message.color_code, message.char_utf);
      callback({msg: 'update_favicon complete for background'});
    }
});
