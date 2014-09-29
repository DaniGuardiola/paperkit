var properties = {
  logEnabled: false,
  log: function(what){
    if (properties.logEnabled) {
      console.log(what);
    }
  },
  change: function(query,classOut,classIn){
    // TODO: Add support for querySelectorAll
    var element = document.querySelector(query);
    if (element) {
      if (classOut) {
        if (element.classList.contains(classOut)) {
          element.classList.remove(classOut);
        }
      }
      if (classIn) {
        if (element.classList.contains(classOut) != true) {
          element.classList.add(classIn);
        }
      }
      properties.log("properties.change | " + query);
    } else {
      properties.log("!! properties.change | query not specified or not valid");
    }
  }
}