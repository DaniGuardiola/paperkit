var initMDMenu = function(MDMenu) {
  MDMenu.open = function(parent) {    
    MDMenu.style.display="";
    
    // Positioning
    // Better suppor for Dani's ideas
    // it can be personalized with a md-menu attribute
    // or even with a parent attribute, have to see the best way
    var parentRect= parent.getBoundingClientRect();
    var viewPort= getViewport();
    MDMenu.style.position="fixed";
    MDMenu.style.top= parentRect.top + "px";
    MDMenu.style.right=(viewPort.width - parentRect.right) + "px";

    // Animation
    MDMenu.style.height="";    
  }

  MDMenu.close = function() {
    MDMenu.style.height = "0px";
    MDMenu.addEventListener(transitionend, MDMenu.endOfTransition);
  }

  MDMenu.endOfTransition = function(e) {
    MDMenu.style.display="none";
    MDMenu.removeEventListener(transitionend, MDMenu.endOfTransition);
  }

  MDMenu.switch = function() {
    if (MDMenu.getAttribute('md-state') !== "open") {
      MDMenu.close();
    } else {
      MDMenu.open();
    }
  }
 
  MDMenu.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
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
  observer.observe(MDMenu, config);
}