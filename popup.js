document.addEventListener('DOMContentLoaded', function() {

  var inputs = {
    shareInterval: document.getElementById('share-interval'),
    cycleCount: document.getElementById('cycle-count'),
    cycleDelay: document.getElementById('cycle-delay')
  }

  var counters = {
    success: document.getElementById('success-counter')
  }

  var buttons = {
    share: document.getElementById('share-button'),
    cancel: document.getElementById('cancel-button'),
  };

  var itemCounter = document.getElementById('item-counter');

  chrome.tabs.query({
    'active': true,
    'currentWindow': true
  }, function(tab) {
    chrome.tabs.sendMessage(tab[0].id, {
      type: "GET_ITEMS",
      data: 'Test data'
    }, function(response) {
      if(response > 0){
        buttons.share.disabled = false;
      }
      itemCounter.innerHTML = response
    });
  });

  buttons.share.addEventListener('click', function() {
    chrome.tabs.query({
      'active': true,
      'currentWindow': true
    }, function(tab) {
      chrome.tabs.sendMessage(tab[0].id, {
        type: "SHARE_ITEMS",
        settings: {
          shareInterval: inputs.shareInterval.value * 1000,
          cycleCount: parseInt(inputs.cycleCount.value),
          cycleDelay: inputs.cycleDelay.value * 1000
        }
      }, function(response) {});
    });
  });

  buttons.cancel.addEventListener('click', function() {
    chrome.tabs.query({
      'active': true,
      'currentWindow': true
    }, function(tab) {
      chrome.tabs.sendMessage(tab[0].id, {
        type: "CANCEL_SHARE"
      }, function(response) {});
    });
  });

  //handle messages from content.js
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    switch (message.type) {
      case 'COUNT_SUCCESS':
        counters.success.innerText = message.count;
        console.log('success');
        break;
    }
  });

  // chrome.tabs.query({
  //   'active': true,
  //   'currentWindow': true
  // }, function(tab) {
  //   shareButton.addEventListener('click', function() {
  //     console.log('message sent to content.js')
  //     chrome.tabs.sendMessage(tab[0].id, "this message is from popup.js", function(response) {
  //       console.log(response);
  //       divCount.innerHTML = response
  //     });
  //   })
  // });

});
