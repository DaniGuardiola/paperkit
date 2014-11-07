var initMDSideMenu = function(MDSidemenu) {
  MDSidemenu.open = function() {
    MDSidemenu.setAttribute("md-state", "open");
  }
  
  MDSidemenu.close = function() {
    MDSidemenu.setAttribute("md-state", "closed");
  }

  MDSidemenu.switch= function() {
    if (MDSidemenu.getAttribute('md-state') === "open") {
      MDSidemenu.close();
    } else {
      MDSidemenu.open();
    }
  }
 
  MDSidemenu.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };


  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDSidemenu, config);
}