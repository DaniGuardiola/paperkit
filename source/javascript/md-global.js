var initGlobalMDFunctions = function(MDElement, materializer) {
  MDElement.materializer = materializer;
  MDElement.changeProperty= function(property, oldvalue, newvalue) {
    var attribute = this.getAttribute(property); 

    if(attribute) {
      var values = attribute.split(' ');
      var oldvalueIndex = values.indexOf(oldvalue);

      if(oldvalueIndex >= 0) {
        values.splice(oldvalueIndex, 1, newvalue);
      } else {
        values.push(newvalue);
      }

      this.setAttribute(property, values.join(' '));    
    }    
  }

  MDElement.alreadyInitialized = true;
}