var initMDSwitch = function(MDSwitch) {
  MDSwitch.toggle = function(e) {
    if (MDSwitch.getAttribute('value') !== "on") {
      this.on();
    } else {
      this.off();
    }
    if (e.stopPropagation) {
        e.stopPropagation();
    } else { // Older IE.
        e.cancelBubble = true;
    }
  }

  MDSwitch.on = function() {
    this.setAttribute("value", "on");
    this.value = "on";
  }

  MDSwitch.off = function() {
    this.setAttribute("value", "off");
    this.value = "off";
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