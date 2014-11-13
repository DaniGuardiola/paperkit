var initMDTabBar = function(MDTabbar) {
  MDTabbar.clickHandler= function(e) {
    var el = e.currentTarget;

    console.log(sprintf("CALLED CLICK HANDLER ON %s", (el.id ? el.id : el.tagName)));
  };

  MDTabbar.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
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
  observer.observe(MDTabbar, config);
}