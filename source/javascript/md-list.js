var initMDList = function(MDList) {
  MDList.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  MDList.clickListener = function(e) {
    var el = e.currentTarget;
    var action = el.parentElement && el.parentElement.getAttribute("md-action") ? el.parentElement.getAttribute('md-action') : 'none';

    switch(action) {
      case 'none':
        break; 
      default:
        if(action.indexOf('custom:') != -1) {
          var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
          callFunction(f, el);
        }
        break;
    }   
  };

  var callFunction= function(f, target) {
    console.log("calling function " + f);
    // eval(f(event));
  };

  // Initialize listerner
  [].forEach.call(MDList.querySelectorAll('md-tile'), function(tile) {
    tile.addEventListener('click', MDList.clickListener);
  });

  // SET INITIAL PROPERTIES  
  if(MDList.getAttribute('md-action')) {
    MDList.attributeChangedCallback('md-action', '', MDList.getAttribute('md-action'));
  }

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDList, config);
}