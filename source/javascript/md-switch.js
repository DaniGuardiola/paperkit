var initMDSwitch = function(MDSwitch) {
  MDSwitch.toggle = function(e) {
    if (MDSwitch.getAttribute('value') !== "on") {
      this.on();
    } else {
      this.off();
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

  MDSwitch.clickListener = function(e) {
    MDSwitch.toggle();
    var el = e.currentTarget;
    var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'submit';

    if (action.indexOf('custom:') != -1) {
      var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
      el.callUserFunction(f, [el]);
    }
  };

  MDSwitch.addEventListener('click', MDSwitch.clickListener);

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

  var config = {
    attributes: true,
    childList: false,
    characterData: false
  };
  observer.observe(MDSwitch, config);
}
