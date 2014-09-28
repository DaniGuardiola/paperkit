var properties = {
  logEnabled: true,
  log: function(){
    
  },
  change: function(query,classOut,classIn){
    // TODO: Add support for querySelectorAll
    var element = document.querySelector(query);
    if (element) {
      if (classOut) {
        element.classList.remove(classOut);
      }
      if (classIn) {
        element.classList.remove(classIn);
      }
      console.log("!! properties.change | query not specified or not valid");
      return true;
    }
    console.log("!! properties.change | query not specified or not valid");
  }
}