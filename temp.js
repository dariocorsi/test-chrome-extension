
    function createFormGroup() {
      var formGroup = document.createElement('div');
      formGroup.classList.add('form-group');
      return formGroup;
    }

    var toolbar = document.createElement('div');
    toolbar.classList.add('toolbar');

    var infoMenu = document.createElement('div');
    infoMenu.classList.add('menu');
    infoMenu.classList.add('info-menu');
    toolbar.appendChild(infoMenu);

    var sharableFormGroup = createFormGroup();
    infoMenu.appendChild(sharableFormGroup);

    var shareableCounter = document.createElement('span');
    shareableCounter.innerText = ' sharable listings';
    sharableFormGroup.appendChild(shareableCounter);

    var successFormGroup = createFormGroup();
    infoMenu.appendChild(successFormGroup);

    var successLabel = document.createElement('label');
    successLabel.innerText = 'Successful Shares:';
    successFormGroup.appendChild(successLabel);

    var successCounter = document.createElement('span');
    successCounter.innerText = success;
    successCounter.style.cssText = 'color:green; padding:0 4px;';
    successFormGroup.appendChild(successCounter);

    var failureCounter = document.createElement('span');
    failureCounter.innerText = failure;
    failureCounter.style.cssText = 'color:red; padding:0 4px;';
    infoMenu.appendChild(failureCounter);

    var settingsButtonWrapper = document.createElement('div');
    settingsButtonWrapper.classList.add('button-wrapper');
    toolbar.appendChild(settingsButtonWrapper);

    var settingsButton = document.createElement('button');
    settingsButton.classList.add('toolbar-button');
    settingsButton.classList.add('settings-button');
    settingsButton.innerText = 'Settings';
    settingsButton.addEventListener('click', function(e) {
      e.target.parentElement.classList.toggle('active');
    });
    settingsButtonWrapper.appendChild(settingsButton);

    var settingsMenu = document.createElement('div');
    settingsMenu.classList.add('menu');
    settingsButtonWrapper.appendChild(settingsMenu);

    var intervalFormGroup = createFormGroup();
    settingsMenu.appendChild(intervalFormGroup);

    var intervalLabel = document.createElement('label');
    intervalLabel.innerText = 'Interval: ';
    intervalFormGroup.appendChild(intervalLabel);

    var intervalInput = document.createElement('input');
    intervalInput.setAttribute('type', 'number');
    intervalInput.setAttribute('value', '1');
    intervalInput.setAttribute('min', '0');
    intervalInput.setAttribute('step', 'any');
    intervalInput.style.cssText = 'width:60px; margin-right:1rem; height:40px; text-align:center;';
    intervalInput.addEventListener('change', updateInterval);
    intervalFormGroup.appendChild(intervalInput);

    var buttonGroup = document.createElement('div');
    buttonGroup.classList.add('button-group');
    toolbar.appendChild(buttonGroup);

    var pauseButton = document.createElement('button');
    pauseButton.innerText = 'Pause';
    pauseButton.classList.add('toolbar-button');
    pauseButton.disabled = true;
    infoMenu.appendChild(pauseButton);

    var cancelButton = document.createElement('button');
    cancelButton.innerText = 'Cancel Share';
    cancelButton.classList.add('toolbar-button');
    cancelButton.disabled = true;
    cancelButton.addEventListener('click', cancelShareRequests);
    infoMenu.appendChild(cancelButton);

    var shareButton = document.createElement('button');
    shareButton.innerText = 'Get Sharable Items';
    shareButton.classList.add('toolbar-button');
    shareButton.addEventListener('click', makeShareRequests);
    buttonGroup.appendChild(shareButton);

    function getCsrfToken() {
      var metaTags = document.getElementsByTagName('meta');
      for (var i = 0; i < metaTags.length; ++i) {
        if (metaTags[i].getAttribute('name') && metaTags[i].getAttribute('name') == 'csrf-token') {
          token = metaTags[i].getAttribute('content');
          console.log('Token set: ' + token);
          break;
        }
      }
    }

    function updateInterval() {
      interval = this.value * 1000;
      console.log(interval + 'ms');
    }

    function updateCounters() {
      successCounter.innerText = success;
      failureCounter.innerText = failure;
    }


    function makeShareRequests() {
      shareButton.innerText = 'Sharing...';
      shareButton.disabled = true;
      cancelButton.disabled = false;
      requestInterval = setInterval(function() {
        if (intervalIndex === items.length) {
          cancelShareRequests();
          console.log('Reached end of items');
        } else {
          var id = items[intervalIndex].getAttribute('id');
          sharePost(id);
          console.log(intervalIndex);
          intervalIndex = intervalIndex + 1;
        }
      }, interval);
    }

    function cancelShareRequests() {
      shareButton.innerText = 'Share';
      shareButton.disabled = false;
      cancelButton.disabled = true;
      clearInterval(requestInterval);
      console.log('Sharing cancelled.');
      intervalIndex = 0;
      success = 0;
      failure = 0;
      updateCounters();
    }

    function sharePost(id) {
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://poshmark.com/listing/share?post_id=" + id,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-CSRF-Token": token
        },
        onload: function(response) {
          //       console.log(response);
          console.log(response.status);
          if (response.status === 200) {
            success = success + 1;
          } else {
            failure = failure + 1;
          }
          updateCounters();
        }
      });
    }

    function getSharableItems() {
      items = document.getElementsByClassName('shopping-tile');
      shareableCounter.innerText = items.length + ' Shareable Items';
      shareButton.innerText = 'Share ' + items.length + ' Items';
      console.log('get sharable items');
    }

    getSharableItems();
    getCsrfToken();

    window.addEventListener('scroll', getSharableItems);
    window.addEventListener('hashchange', function(){
      alert('the hash changed');
    });

    // add stylesheet
    function addGlobalStyle(css) {
      var head, style;
      head = document.getElementsByTagName('head')[0];
      if (!head) {
        return;
      }
      style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = css;
      head.appendChild(style);
    }
