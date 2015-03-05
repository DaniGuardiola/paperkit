var initMDFab = function(MDFab, paperkit) {
  MDFab.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
    if (attrname === 'md-action' && newvalue === 'submit') {
      var parentForm = findParentForm(this);
      if (parentForm) {
        parentForm.addEventListener('keypress', this.enterKeyListener);
      }
    } else if (attrname === 'md-action' && (oldvalue !== 'submit' || oldvalue === '')) {
      var parentForm = findParentForm(this);
      if (parentForm) {
        parentForm.removeEventListener('keypress', this.enterKeyListener);
      }
    }
  };

  MDFab.updateIcon = function() {
    var image = this.getAttribute('md-image') ? this.getAttribute('md-image') : '';
    var type = this.getAttribute('md-type') ? this.getAttribute('md-type') : 'icon';

    var iconElement = this.querySelector('md-icon');
    if (!iconElement) {
      iconElement = document.createElement('md-icon');
      paperkit.initElement(iconElement);
      this.appendChild(iconElement);
    }

    iconElement.setAttribute('md-type', type);
    iconElement.setAttribute('md-image', image);
  }
  MDFab.updateIcon();

  MDFab.enterKeyListener = function(e) {
    var el = e.currentTarget;
    if (e.keyCode === 13) {
      el.submit();
    }
  }

  MDFab.set = function(key, value) {
    if (key == 'image' || key == 'md-image') {
      MDFab.querySelector('md-icon').setAttribute('md-image', 'icon:' + value);
    } else if (key.indexOf('md-') === -1) {
      MDFab.setAttribute('md-' + key, value);
    }
  }

  MDFab.hide = function() {
    MDFab.style.bottom = "-56px";
  }

  MDFab.show = function() {
    MDFab.style.bottom = "";
  }

  MDFab.clickListener = function(e) {
    var el = e.currentTarget;
    var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'submit';

    switch (action) {
      case 'submit':
        submitForm(el);
        break;
      case 'reset':
        resetForm(el);
        break;
      case 'snackbar-dismiss':
        snackbarDismiss(el);
        break;
      case 'morph':
        transition.morph(el);
        break;
      case 'chrome-app-close':
        chrome.app.window.current().close();
        break;
      default:
        if (action.indexOf('custom:') != -1) {
          var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
          this.callFunction(f, el);
        } else if (action.indexOf('link:') != -1) {
          var f = action.substring(action.indexOf('link:') + 'link:'.length).trim();
          window.open(f, '_self');
        } else if (action.indexOf('link-out:') != -1) {
          var f = action.substring(action.indexOf('link-out:') + 'link-out:'.length).trim();
          window.open(f);
        } else if (action = "chrome-app-close") {
          chrome.app.window.current().close();
        }
        break;
    }
  };

  MDFab.onClick = function(action) {
    if (action) {
      MDFab.setAttribute('md-action', action);
      console.log(MDFab.paperkit.consoleBanner + "md-fab has a new action: " + action);
    } else {
      MDFab.removeAttribute('md-action');
      console.log(MDFab.paperkit.consoleBanner + "md-fab has no action");
    }
  }

  var submitForm = function(target) {
    console.log("submit from clicked!");
    var form = findParentForm(target);
    if (form) {
      form.submit();
    }
  }

  var resetForm = function(target) {
    console.log("reset form clicked!");
    var form = findParentForm(target);
    if (form) {
      form.submit();
    }
  }

  var snackbarDismiss = function(target) {
    console.log("snackbar dismiss clicked!")
  }

  MDFab.callFunction = function(f, target) {
    console.log("calling function " + f);
    executeFunctionByName(f, window, [target]);
  }

  var findParentForm = function(element) {
    var el = element.parentNode;

    do {
      if (el.tagName == "FORM") {
        return el;
      } else if (el.tagName == "BODY") {
        return null;
      }
    } while ((el = el.parentNode) != null);
    return null;
  }

  // Initialize listener and parent form keypress listener
  MDFab.addEventListener('click', MDFab.clickListener);

  // If not md-action then submit is the default, set form key listener
  if (!MDFab.getAttribute('md-action')) {
    var parentForm = findParentForm(MDFab);
    if (parentForm) {
      parentForm.addEventListener('keypress', MDFab.enterKeyListener);
    }
  }

  // SET INITIAL PROPERTIES
  if (MDFab.getAttribute('md-action')) {
    MDFab.attributeChangedCallback('md-action', '', MDFab.getAttribute('md-action'));
  }

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var element = mutation.target;
      element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
    });
  });

  var config = {
    attributes: true,
    childList: false,
    characterData: false
  };
  observer.observe(MDFab, config);

}
