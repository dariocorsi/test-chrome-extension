// document.addEventListener('DOMContentLoaded', function() {
//   var checkPageButton = document.getElementById('checkPage');
//   var divCount = document.getElementById('div-count');
//   console.log('loaded');



chrome.tabs.query({'active': true,'currentWindow':true},function(tab){
  chrome.tabs.sendMessage(tab[0].id,"this message is from popup.js", function(response){
    //assuming that info was html markup then you could do
    var divCount = document.getElementById('div-count');
    console.log('first:', response);
    console.log(response);
    divCount.innerHTML = response
  });
});

// });
// chrome.runtime.onMessage.addListener( function(response, sender, sendResponse){
//   console.log('listener:', response);
//   document.innerText = 'I had to listen for this';
// });

//
// document.addEventListener('DOMContentLoaded', function() {
//   var checkPageButton = document.getElementById('checkPage');
//   var divCount = document.getElementById('div-count');
//   console.log('loaded');
// });
