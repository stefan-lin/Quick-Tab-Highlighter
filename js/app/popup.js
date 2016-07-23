/**
 * Created by stefanlin on 7/17/16.
 */

/**
 * CONSTANT DECLARATION
 */
const OPT_ID  = '#option-button';
const HIS_ID  = '#history-button';
const RED_ID  = '#button-1';
const YLW_ID  = '#button-2';
const GRN_ID  = '#button-3';
const BLU_ID  = '#button-4';
const ORG_ID  = '#button-5';
const OPT_URL = 'option.html';
const HIS_URL = 'history.html';

function print_response_to_log(response_message){
  console.log(response_message);
}

function reg_option_listener(){
  $(OPT_ID).addEventListener('click', function(event){
    
  });
}

function reg_red_listener(){
  $(RED_ID).html('\u26D4');
  $(RED_ID).on('click', function(){
    console.log('red button clicked');
    //var background_color = $(RED_ID).attr('background-color');
    var background_color = '#FF3300'
    console.log(background_color);
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          from        : 'popup',
          subject     : 'HighlightTab',
          color       : background_color,
          special_char: '\u26D4'
        },
        function(response){
          console.log(response.msg);
        }
      );  // END chrome.tabs.sendMessage
    }); // END chrome.tabs.query
  });
}

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
