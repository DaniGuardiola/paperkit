var initMDButton = function(MDButton) {
  MDButton.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
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

  MDButton.enterKeyListener = function(e) {
    var el = e.currentTarget;
    if (e.keyCode === 13) {
      el.submit();
    }
  }

  MDButton.clickListener = function(e) {
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
          this.callUserFunction(f, [el]);
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
  MDButton.addEventListener('click', MDButton.clickListener);

  // If not md-action then submit is the default, set form key listener
  if (!MDButton.getAttribute('md-action')) {
    var parentForm = findParentForm(MDButton);
    if (parentForm) {
      parentForm.addEventListener('keypress', MDButton.enterKeyListener);
    }
  }

  // SET INITIAL PROPERTIES
  if (MDButton.getAttribute('md-action')) {
    MDButton.attributeChangedCallback('md-action', '', MDButton.getAttribute('md-action'));
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
  observer.observe(MDButton, config);

}
