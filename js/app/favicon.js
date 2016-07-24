/**
 * Created by stefanlin on 7/23/16.
 */

function restore_favicon_from_history(){
  console.log('[injected content] sending message to background - validate new tab');
  chrome.runtime.sendMessage(
    {from: 'content', subject: 'ValidateNewTab' },
    function(result){
      console.log(result);
    } // END callback FUNCTION
  );
}