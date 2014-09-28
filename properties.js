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
        console.log("classOut");
      }
      if (classIn) {
        element.classList.add(classIn);
      }
      console.log("properties.change | " + query);
    }
    console.log("!! properties.change | query not specified or not valid");
  }
}