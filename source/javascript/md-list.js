var initMDList = function(MDList,materializer) {
  MDList.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  MDList.clickListener = function(e) {
    var el = e.currentTarget;
    var parentList = el.parentNode;
    
    if(el.tagName==='MD-TILE' && parentList===this) {
      console.log("Fired click on " + el.tagName);      
      if(el.getAttribute('md-action')) {
        var action = el.getAttribute('md-action');
      } else {
        var action = el.parentElement && el.parentElement.getAttribute("md-action") ? el.parentElement.getAttribute('md-action') : 'none';
      }

      switch(action) {
        case 'none':
          break;
        default:
          if(action.indexOf('custom:') != -1) {
            var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
            callFunction(f, el);
          } else if(action.indexOf('link:') != -1) {
            var f = action.substring(action.indexOf('link:') + 'link:'.length).trim();
            linkRedirect(f, el);
          } else if(action.indexOf('ajax:') != -1) {
            var f = action.substring(action.indexOf('ajax:') + 'link:'.length).trim();
            materializer.ajaxInsert(el.getAttribute('md-ajax'), getEl(f), function(){
              materializer.justInCase('reload');
              if (el.getAttribute('md-ajax-callback')) {
                executeFunctionByName(el.getAttribute('md-ajax-callback'));
              };
            });
          }
          break;
      }   
    }
  };

  var linkRedirect= function(linkattr, target) {
    var link = target.getAttribute(linkattr);
    document.location.href = link;
  }

  var callFunction= function(f, target) {
    console.log("calling function " + f);
    executeFunctionByName(f, window, [ target ]);
  };

  MDList.initList= function() {
    var children = MDList.children;    
    for(var i=0; i<children.length;i++) {
      if(children[i].tagName==='MD-TILE') {        
        var tile = children[i];
        tile.addEventListener('click', MDList.clickListener.bind(this));
      }
    }
  }

  // Initialize listerner
  MDList.initList();

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