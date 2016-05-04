var items = '';
var token = '';
var shareIndex = 0;
var cycleIndex = 0;
var success = 0;
var failure = 0;

var settings = {
  shareInterval: 3000,
  cycleCount: 5,
  cycleDelay: 1000
};

function getSharableItems() {
  items = document.getElementsByClassName('shopping-tile');
}

function getCsrfToken() {
  //get all meta tags
  var metaTags = document.getElementsByTagName('meta');
  //look for the one named 'csrf-token'
  for (var i = 0; i < metaTags.length; ++i) {
    if (metaTags[i].getAttribute('name') && metaTags[i].getAttribute('name') == 'csrf-token') {
      token = metaTags[i].getAttribute('content');
      console.log('CSRF Token: ' + token);
      break;
    }
  }
}

function makeShareRequests() {
  requestInterval = setInterval(function() {
    if (shareIndex === items.length) {
      cancelShareRequests();
      console.log('Reached end of items');
    } else {
      var id = items[shareIndex].getAttribute('id');
      shareItem(id);
      console.log('Share index: ', shareIndex);
      shareIndex = shareIndex + 1;
    }
  }, interval);
}

function cancelShareRequests() {
  clearInterval(requestInterval);
  shareIndex = 0;
  success = 0;
  failure = 0;
  console.log('Sharing cancelled.');
}

function shareItem(id) {
  $.ajax({
    method: "POST",
    url: 'https://poshmark.com/listing/share?post_id=' + id,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-CSRF-Token": token
    }
  }).done(function(status) {
    success = success + 1;
    sendSuccessMessage();
    console.log('successful share');
  }).fail(function(response) {
    cancelShareRequests();
    console.log('fail');
  })
}

function startNewCycle() {
  cycleIndex = cycleIndex + 1;
  if (cycleIndex === settings.cycleCount) {
    console.log('Reached last cycle');
  } else {
    setTimeout(function() {
      makeShareRequests();
    }, settings.cycleDelay);
  }
}

function makeShareRequests() {
  //set interval between requests
  requestInterval = setInterval(function() {
    // if (shareIndex === items.length) {
    if (shareIndex === 3) {
      cancelShareRequests();
      startNewCycle();
      console.log('Reached end of items');
    } else {
      var id = items[shareIndex].getAttribute('id');
      shareItem(id);
      console.log(shareIndex);
      shareIndex = shareIndex + 1;
    }
  }, settings.shareInterval);
}

function sendSuccessMessage() {
  chrome.runtime.sendMessage({
    type: "COUNT_SUCCESS",
    count: success
  });
}

getCsrfToken();
getSharableItems();

//listen for messages from popup...
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.type) {
    case 'GET_ITEMS':
      console.log('GET_ITEMS')
      sendResponse(items.length);
      break;
    case 'SHARE_ITEMS':
      settings = message.settings;
      makeShareRequests();
      console.log('SHARED_ITEMS');
      console.log(settings);
      break;
    case 'CANCEL_SHARE':
      cancelShareRequests();
      console.log('CANCEL_SHARE')
      break;
  }


});
