var initMDMenu = function(MDMenu) {
  MDMenu.setAttribute('md-status','closed');

  MDMenu.open = function(parent, opt) {
    MDMenu.style.display="";

    var parentRect= parent.getBoundingClientRect();
    var viewPort= getViewport();

    if (!opt) {
      // Positioning
      // Better support for Dani's ideas
      // it can be personalized with a md-menu attribute
      // or even with a parent attribute, have to see the best way
      MDMenu.style.right=(viewPort.width - parentRect.right) + "px";
      MDMenu.style.top= parentRect.top + "px";

      // Animation
      MDMenu.style.height="";
      MDMenu.setAttribute('md-status','open');
    } else {
      if (opt.select) {
        MDMenu.style.left= (parentRect.left - 16) + "px";
        MDMenu.style.top= (parentRect.top - 8) + "px";
      } else if (opt.outset) {
        if (opt.xPosition === "right") {
          MDMenu.style.right=(viewPort.width - parentRect.right) + "px";
        } else {

        }

      } else {
        if (opt.xPosition === "right") {
          MDMenu.style.right=(viewPort.width - parentRect.right) + "px";
        } else {

        }
        if (opt.yPosition === "top") {
          MDMenu.style.top= parentRect.top + "px";

        } else {

        }
      }
    }
  }

  MDMenu.close = function() {
    MDMenu.style.height = "0px";
    MDMenu.addEventListener(transitionend, MDMenu.endOfTransition);
    MDMenu.status= "closed";
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