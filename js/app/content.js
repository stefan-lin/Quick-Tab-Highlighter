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
var favicon_link_elements = [];
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
  var favicon_link_elements = document.querySelectorAll('head link[rel~="icon"');
  console.log(favicon_link_elements);
  if(favicon_link_elements.length == 0){
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
    for(var index in favicon_link_elements){
      if(favicon_link_elements[index].rel == 'shortcut icon'){
        favicon_link_element = favicon_link_elements[index];
        origin_favicon_url = favicon_link_elements[index].href;
        break;
      }
    } // END FOR
    if(!origin_favicon_url){
      origin_favicon_url = favicon_link_elements[0].href;
    }
    
    // CHANGE ALL <link rel='icon'...> and <link rel='shortcut icon'...>
    // ELEMENTS TO HAVE THE SAME FAVICON
    for(var index in favicon_link_elements){
      favicon_link_elements[index].href = origin_favicon_url;
      favicon_link_elements[index].type = "image/x-icon";
    }
  }
  origin_title = document.title;
}

function create_link_element(){
  console.log('[content] creating link element')
  favicon_link_element = document.createElement("link");
  favicon_link_element.setAttribute("rel", "shortcut icon");
  favicon_link_element.type = "image/x-icon";
  document.head.appendChild(favicon_link_element);
  favicon_link_elements = [favicon_link_element];
  console.log(favicon_link_element);
}

// TODO: implement here to update the history
// history will not survive after reboot
function replace_favicon(new_url, color_code, special_char){
  var curr_url = favicon_link_element.href;
  if(new_url != curr_url){
    console.log('new_url != curr_url');
    console.log(favicon_link_elements);
    for(var index in favicon_link_elements){
      console.log(favicon_link_elements[index].href);
      favicon_link_elements[index].href = new_url;
    }
    if(!curr_url || curr_url == origin_favicon_url){
      console.log('!curr_url || curr_url == origin_favicon_url');
      document.title = special_char + document.title;
    }
    else{
      console.log('curr_url != origin_favicon_url');
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
    console.log('new_url == curr_url');
    for(var index in favicon_link_elements){
      favicon_link_elements[index].href = origin_favicon_url;
    }
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
  console.log(favicon_link_element);
  favicon_link_elements = document.querySelectorAll('head link[rel~="icon"');
  console.log(favicon_link_elements);
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

chrome.runtime.onMessage.addListener(
  function(message, sender, callback){
    console.log('content string received message');
    // VALIDATE THE MESSAGE RECEIVED
    if(message.from == 'popup' && message.subject == 'HighlightTab'){
      update_favicon(message.color, message.special_char);
      callback({msg: 'update_favicon_complete!'});
    }
    if(message.from == 'background' && message.subject == 'HighlightTab'){
      if(message.circum){
        console.log('[content] from background validate call back');
      }
      update_favicon(message.color_code, message.char_utf);
      callback({msg: 'update_favicon complete for background'});
    }
  });

function validate_new_tab(){
  chrome.runtime.sendMessage(
    {from: 'content', subject: 'ValidateNewTab'},
    function(response){
      console.log(response);
      if(response.result == 'exists'){
        update_favicon(response.color, response.char_utf);
      }
  });
}

collect_tabInfo();
validate_new_tab();

