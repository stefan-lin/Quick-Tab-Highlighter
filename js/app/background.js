/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */

function replace_favicon(request, callback){
  var canvas = document.createElement('canvas'), context;
  cavas.width   = 16;
  canvas.height = 16;
  context = canvas.getContext('2d');
  context.fillStyle = request.color;
  context.fillStyle(0, 0, 16, 16);
  context.fill();
  callback(canvas.toDataURL());
}

chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.app.window.create(
    'index.html',
    {
      id: 'mainWindow',
      bounds: {width: 800, height: 600}
    }
  );
});

chrome.runtime.onMessage.addListener(function(message, sender, response){
  // VALIDATE THE MESSAGE RECEIVED
  if(message.from === 'popup' && message.subject === 'HighlightTab'){
    
  }
});