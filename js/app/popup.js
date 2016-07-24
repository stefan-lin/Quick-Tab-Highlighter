/**
 * Created by stefanlin on 7/17/16.
 */

function reg_listener(element_id, word_icon, color_code){
  $(element_id + ':nth-child(1)').html(word_icon);
  // NEED TO SET COLORS
  $(element_id).on('click', function(){
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          from        : 'popup',
          subject     : 'HighlightTab',
          color       : color_code,
          special_char: word_icon
        },
        function(response){
          console.log(response.msg);
        }); // END chrome.tabs.sendMessage
    }); // END chrome.tabs.query
  }); // END on
} // END reg_listener

function init_color_buttons(){
  // MESSAGE backgroun.js FOR DATA
  chrome.runtime.sendMessage(
    {from: 'popup', subject: 'ColorButtonsInfo'},
    function(response){
      for(var button_id in response.color_settings){
        var settings = response.color_settings[button_id];
        reg_listener(button_id, settings.char_id, settings.color_id);
      } // END FOR LOOP
    } // END callback FUNCTION
  ); // END chrome.runtime.sendMessage
} // END init_color_buttons FUNCTION

/**
 * INIT STEP
 */
document.addEventListener('DOMContentLoaded', function(){
  //reg_red_listener();
  init_color_buttons();
});
