/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */

var button_info = { color_settings: {
  '#button-1': {char_id: '\u26D4', color_id: '#FF3300', border_id: '#991F00'},
  '#button-2': {char_id: '\u2622', color_id: '#FF9900', border_id: '#995C00'},
  '#button-3': {char_id: '\u2705', color_id: '#66FF33', border_id: '#269900'},
  '#button-4': {char_id: '\u27BF', color_id: '#0000FF', border_id: '#000099'}
}};

// e.g. {'www.apple.com': {color: '#FF3300', s_char: '\u26D4', time: DateObj}}
var history = {};

function update_history(color_code, special_char, curr_url, curr_title, action){
  if(action == 'SET'){
    history[curr_url] = {
      title : curr_title,
      color : color_code,
      s_char: special_char,
      time  : new Date()
    }
  }
  else if(action == 'DELETE'){
    if(history[curr_url]){
      delete history[curr_url];
    }
  }
  else{
    console.log('[background] invalid history request')
  }
  
  console.log(history);
}

function generate_favicon(color_code, callback){
  var canvas = document.createElement('canvas'), context;
  canvas.width   = 16;
  canvas.height = 16;
  context = canvas.getContext('2d');
  context.fillStyle = color_code;
  context.fillRect(0, 0, 16, 16);
  context.fill();
  callback(canvas.toDataURL());
}

//chrome.app.runtime.onLaunched.addListener(function(launchData) {
//  chrome.app.window.create(
//    'index.html',
//    {
//      id: 'mainWindow',
//      bounds: {width: 800, height: 600}
//    }
//  );
//});

function talk_to_content(button_id){
  console.log(button_info);
  console.log(button_id);
  var b = (button_info['color_settings'])[button_id];
  console.log(b);
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        from: 'background',
        subject: 'HighlightTab',
        button: button_id,
        char_utf: b.char_id,
        color_code: b.color_id
      },
      function(response) {
        console.log(response.msg);
      });
  });
}

// TODO: [fix] unable to receive message from content; try chrome.tabs.sendMessage
chrome.runtime.onMessage.addListener(function(message, sender, callback){
  console.log('[background] received message');
  // VALIDATE THE MESSAGE RECEIVED
  if(message.from == 'content' && message.subject == 'HighlightTab'){
    console.log('[background] received message from content');
    generate_favicon(message.color, callback);
    console.log('favicon generated by background.js');
    return true;
  }
  else if(message.from == 'content' && message.subject == 'DefaultFavicon'){
    if(message.action == 'GET'){
      chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        var ret = tabs[0].url;
        var origin = ret.match(/^[\w-]+:\/{2,}\[?[\w\.:-]+\]?(?::[0-9]*)?/)[0];
        origin += '/favicon.ico';
        callback(origin);
      });
      return true;
    }
  }
  else if(message.from == 'content' && message.subject == 'UpdateHistory' &&
          message.action == 'SET'){
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      update_history(
        message.color,
        message.special_char,
        tabs[0].url,
        message.title,
        message.action
      );
      callback('finish updating history');
    });
    return true;
  }
  else if(message.from == 'popup' && message.subject == 'ColorButtonsInfo'){
    console.log('[background] received message from popup');
    callback(button_info); // END callback
    // yellow {char_id: '\u26A1', color_id: '#FFFF00', border_id: '#999900'}
    return true;
  } // END else-if
  else{
    console.log('[background] un-catched message')
  }
});

chrome.commands.onCommand.addListener(function(command) {
  switch(command){
    case 'Highlight-One':
      talk_to_content('#button-1');
      break;
    case 'Highlight-Two':
      talk_to_content('#button-2');
      break;
    case 'Highlight-Three':
      talk_to_content('#button-3');
      break;
    case 'Highlight-Four':
      talk_to_content('#button-4');
      break;
    default:
      console.log('[background] invalid command entry.');
  }
});