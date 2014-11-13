var initMDSidemenu = function(MDSidemenu) {
  MDSidemenu.open = function() {
    MDSidemenu.style.left = "";
    MDSidemenu.setAttribute("md-state", "open");
    MDSidemenu.materializer.greylayer.show();
    MDSidemenu.materializer.greylayer.addEventListener('click', function(){
      MDSidemenu.close();
    });
  }

  MDSidemenu.close = function() {
    if (MDSidemenu.style.width !== "") {
      MDSidemenu.style.left = "-" + MDSidemenu.style.width;
    };
    MDSidemenu.setAttribute("md-state", "closed");
    MDSidemenu.materializer.greylayer.hide();
  }

  MDSidemenu.switch = function() {
    if (MDSidemenu.getAttribute('md-state') !== "open") {
      MDSidemenu.close();
    } else {
      MDSidemenu.open();
    }
  }
 
  MDSidemenu.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  MDSidemenu.autoResize = function() {
    var viewport = getViewport();
    if (viewport.width <= 456) { // We should generate display vars from md-settings.json
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

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDSidemenu, config);
}