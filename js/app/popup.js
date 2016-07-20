/**
 * Created by stefanlin on 7/17/16.
 */

/**
 * CONSTANT DECLARATION
 */
const OPT_ID  = '#option-button';
const HIS_ID  = '#history-button';
const RED_ID  = '#red-button';
const YLW_ID  = '#yellow-button';
const GRN_ID  = '#green-button';
const BLU_ID  = '#blue-button';
const ORG_ID  = '#orange-button';
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
  $(RED_ID).on('click', function(){
    console.log('red button clicked');
    //var background_color = $(RED_ID).attr('background-color');
    var background_color = '#FF3300'
    console.log(background_color);
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      chrome.tabs.sendMessage(
        tabs[0].id,
        { from   : 'popup', subject: 'HighlightTab', color  : background_color},
        function(response){
          console.log(response.msg);
        }
      );  // END chrome.tabs.sendMessage
    }); // END chrome.tabs.query
    //chrome.tabs.getSelected(null, function(tab){
    //  console.log(tab.id);
    //  chrome.tabs.sendMessage(
    //    tab.id,
    //    {from: 'popup', subject: 'HighlightTab', color: background_color},
    //    function(response) {
    //      console.log(response.msg);
    //    }
    //  );
    //});
  });
}


/**
 * INIT STEP
 */
document.addEventListener('DOMContentLoaded', function(){
  reg_red_listener();
});
