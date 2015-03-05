var initMDSidemenu = function(MDSidemenu) {
  /**
   * Opens side menu.
   */
  MDSidemenu.open = function() {
    if (MDSidemenu.paperkit.toolbar.getAttribute('md-drag') === "drag") {
      MDSidemenu.paperkit.toolbar.setAttribute('md-drag', 'no-drag');
    }
    MDSidemenu.style.left = "";
    MDSidemenu.setAttribute("md-state", "open");
    MDSidemenu.paperkit.greylayer.show();
    MDSidemenu.paperkit.greylayer.addEventListener('click', function() {
      MDSidemenu.close();
    });
  }

  /**
   * Closes side menu.
   */
  MDSidemenu.close = function() {
    if (MDSidemenu.style.width !== "") {
      MDSidemenu.style.left = "-" + MDSidemenu.style.width;
    };
    MDSidemenu.setAttribute("md-state", "closed");
    MDSidemenu.paperkit.greylayer.hide();
    if (MDSidemenu.paperkit.toolbar.getAttribute('md-drag') === "no-drag") {
      MDSidemenu.paperkit.toolbar.setAttribute('md-drag', 'drag');
    }
  }

  /**
   * Toggles side menu, opening or closing it.
   */
  MDSidemenu.toggle = function() {
    if (MDSidemenu.getAttribute('md-state') !== "open") {
      MDSidemenu.close();
    } else {
      MDSidemenu.open();
    }
  }

  /**
   * Callback function, called when an attribute changes.
   * @param {string} attrname Changed attribute name
   * @param {string} oldvalue Old value for attribute or null if previous value does not exist.
   * @param {string} newvalue New value for attribute or null if value removed.
   */
  MDSidemenu.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  /**
   * Autoresizes side menu, adapting it to different widths and making it more responsive.
   * TODO: Review, now there are functions to know if this is mobile or desktop, no need to calculate.
   */
  MDSidemenu.autoResize = function() {
    var viewport = getViewport();
    if (viewport.width <= 456) { // We should generate display vars from settings.json
      MDSidemenu.style.width = (viewport.width - 56) + "px";
      if (MDSidemenu.getAttribute('md-state') !== "open") {
        MDSidemenu.style.left = "-" + MDSidemenu.style.width;
      };
    } else {
      MDSidemenu.style.width = "";
    }
  }

  MDSidemenu.autoResize();

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
  observer.observe(MDSidemenu, config);
}
