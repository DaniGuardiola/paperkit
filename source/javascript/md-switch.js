var initMDSwitch = function(MDSwitch) {
  MDSwitch.toggle = function(e) {
    if (MDSwitch.getAttribute('value') !== "on") {
      MDSwitch.on();
    } else {
      MDSwitch.off();
    }
    if (e.stopPropagation) {
        e.stopPropagation();
    } else { // Older IE.
        e.cancelBubble = true;
    }
  }

  MDSwitch.on = function() {
    MDSwitch.setAttribute("value", "on");
    MDSwitch.value = "on";
  }

  MDSwitch.off = function() {
    MDSwitch.setAttribute("value", "off");
    MDSwitch.value = "off";
  }

  MDSwitch.addEventListener('click', MDSwitch.toggle);
 
  MDSwitch.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  MDSwitch.value = "off";

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDSwitch, config);
}