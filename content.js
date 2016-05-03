var divs = document.getElementsByTagName('div');

chrome.runtime.onMessage.addListener( function(message,sender,sendResponse){
    console.log('message',message);
    sendResponse(divs.length);
});
