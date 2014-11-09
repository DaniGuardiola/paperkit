var initMDButton = function(MDButton) {
  MDButton.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);

    // SUBMIT
    // Adding
    if(attrname==='md-action' && newvalue==='submit') {
      var parentForm = findParentForm(this);
      if(parentForm) {
        setListener(parentForm, this.enterKeyListener, 'keypress');
      }
    // Removing
    } else if(attrname==='md-action' && oldvalue==='submit' && newvalue.indexOf('custom:') == -1) {
      var parentForm = findParentForm(this);
      if(parentForm) {
        setListener(parentForm);
      }
    }

    // CUSTOM
    if(attrname==='md-action' &&  newvalue.indexOf('custom:') != -1) {
      var f = newvalue.substring(newvalue.indexOf('custom:') + 'custom:'.length).trim();
      setListener(MDIconButton, function() {
        callFunction(f);
      });
    }
  };

  MDButton.enterKeyListener = function(e) {
    var el = e.currentTarget;
    if(e.keyCode===13) {
      el.submit();
    }
  }

  MDButton.clickListener = function(e) {
    var el = e.currentTarget;
    var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'submit';

    switch(action) {
      case 'submit': 
        submitForm(el);
        break;
      case 'reset':
        resetForm(el);
        break;
      case 'snackbar-dismiss':
        snackbarDismiss(el);
        break;
      default:
        if(action.indexOf('custom:') != -1) {
          var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
          callFunction(f, el);
        }
        break;
    }   
  };

  var submitForm= function(target) {
    console.log("submit from clicked!");
    var form = findParentForm(target);
    if(form) {
      form.submit();
    }    
  }

  var resetForm= function(target) {
    console.log("reset form clicked!");
    var form = findParentForm(target);
    if(form) {
      form.submit();  
    }    
  }

  var snackbarDismiss= function(target) {
    console.log("snackbar dismiss clicked!")
  }

  var callFunction= function(functionName, args, context) {
    console.log('[MD] callFunction - Calling ' + functionName + '(' + args + ')');
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    if (!context) {
      context = window;
    }
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    if (args) {
    console.log("dew1");
        return context[func].apply(this, args);
    } else {      
      console.log(context + func);
        return context[func]();
    }
  }

  var setListener= function(who, what, when) {
    if (who.nodeType === 1) {      
      // Removing all listeners by replacing the element with a clone
      whoClone = who.cloneNode(true);
      who.parentNode.replaceChild(whoClone, who);
      who = whoClone;
      if (typeof what === "function") {
        if (when == '' || typeof when != "string") {
          // Defautl event
          when = 'click';
        }
        // Ading new event Listener
        who.addEventListener(when, function() {
          what();
        });
      }
    } 
  }

  var findParentForm= function(element) {
    var el = element.parentNode;

    do {
      if(el.tagName=="FORM") {
        return el;
      } else if(el.tagName=="BODY") {
        return null;
      }
    } while((el = el.parentNode) != null);
    return null;
  }

  // Initialize listener and parent form keypress listener
  MDButton.addEventListener('click', MDButton.clickListener);

  // If not md-action then submit is the default, set form key listener
  if(!MDButton.getAttribute('md-action')) {
      var parentForm = findParentForm(MDButton);
      if(parentForm) {
        parentForm.addEventListener('keypress', MDButton.enterKeyListener);
      }    
  }

  // SET INITIAL PROPERTIES
  if(MDButton.getAttribute('md-action')) {
    MDButton.attributeChangedCallback('md-action', '', MDButton.getAttribute('md-action'));
  }

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDButton, config);

}