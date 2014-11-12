var initMDGreylayer = function(MDGreylayer) {
  MDGreylayer.show = function() {
    MDGreylayer.removeEventListener(transitionend, MDGreylayer.noZIndex);
    MDGreylayer.style.zIndex = "400";
    MDGreylayer.setAttribute("md-state", "on");
  }

  MDGreylayer.hide = function() {
    MDGreylayer.setAttribute("md-state", "off");
    MDGreylayer.addEventListener(transitionend, MDGreylayer.noZIndex);
  }

  MDGreylayer.switch = function() {
    if (MDGreylayer.getAttribute('md-state') !== "on") {
      MDGreylayer.show();
    } else {
      MDGreylayer.hide();
    }
  }

  MDGreylayer.noZIndex = function() {
    MDGreylayer.style.zIndex = "";
  }
 
  MDGreylayer.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
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
  observer.observe(MDGreylayer, config);
}