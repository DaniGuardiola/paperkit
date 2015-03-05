var initMDGreylayer = function(MDGreylayer) {
  /**
   * Shows the grey layer.
   */
  MDGreylayer.show = function() {
    MDGreylayer.removeEventListener(transitionend, MDGreylayer.noZIndex);
    MDGreylayer.style.zIndex = "400";
    MDGreylayer.setAttribute("md-state", "on");
  }

  /**
   * Hides the grey layer.
   */
  MDGreylayer.hide = function() {
    MDGreylayer.setAttribute("md-state", "off");
    MDGreylayer.addEventListener(transitionend, MDGreylayer.noZIndex);
  }

  /**
   * Toggles grey layer state, showing or hiding it.
   */
  MDGreylayer.toggle = function() {
    if (MDGreylayer.getAttribute('md-state') !== "on") {
      MDGreylayer.show();
    } else {
      MDGreylayer.hide();
    }
  }

  /** 
   * Removes z-index from grey layer.
   * TODO: REVIEW
   */
  MDGreylayer.noZIndex = function() {
    MDGreylayer.style.zIndex = "";
  }

  /**
   * Callback function, called when an attribute changes.
   * @param {string} attrname Changed attribute name
   * @param {string} oldvalue Old value for attribute or null if previous value does not exist.
   * @param {string} newvalue New value for attribute or null if value removed.
   */
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

  var config = {
    attributes: true,
    childList: false,
    characterData: false
  };
  observer.observe(MDGreylayer, config);
}
