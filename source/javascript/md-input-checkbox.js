var initMDInputCheckbox = function(MDCheckbox) {
  MDCheckbox.toggle = function(e) {
    if (MDCheckbox.hasAttribute('checked')) {
      this.uncheck();
    } else {
      this.check();
    }
  }

  MDCheckbox.check = function() {
    this.setAttribute("checked", "");
    this.state = "checked";
  }

  MDCheckbox.uncheck = function() {
    this.removeAttribute('checked');
    this.state = "unchecked";
  }

  MDCheckbox.addEventListener('click', MDCheckbox.toggle);

  MDCheckbox.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  MDCheckbox.state = "unchecked";

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
  observer.observe(MDCheckbox, config);
}
