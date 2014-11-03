/*
* Metodo 1, extendiendo element
* No recomendado, ver http://perfectionkills.com/whats-wrong-with-extending-the-dom/

Element.prototype.changeProperty= function(property, oldvalue, newvalue) {
  var attribute = this.getAttribute(property); 

  if(attribute) {
    var values = attribute.split(' ');
    var oldvalueIndex = values.indexOf(oldvalue);

    if(oldvalueIndex >= 0) {
      values.splice(oldvalueIndex, 1, newvalue);
    } else {
      // values.push(newvalue);
    }

    this.setAttribute(property, values.join(' '));    
  }  
}*/
/* 
* Removes, or adds, or changes a md-property value
*
* @param Element element The element to modify. Must exist.
* @param string property The property to modify. Must exist in the element.
* @param string oldvalue Old value to modify, or null if setting new valule.
* @param string newvalue New value to set, or to modify old value with.
*/
var changeAttribute= function(element, property, oldvalue, newvalue) {
  var attribute = element.getAttribute(property);
  if(attribute) {
    var values = attribute.split(' ');
    var oldIndex = values.indexOf(oldvalue);
    if(oldIndex != -1) {
      values.splice(oldIndex, 1, newvalue);            
    } else {
      values.push(newvalue);
    }
    element.setAttribute(property, values.join(' '));
    return true;
  } else {
    element.setAttribute(property, newvalue);

  }

  return false;
}


var properties = {
  logEnabled: false,
  log: function(what){
    if (properties.logEnabled) {
      console.log(what);
    }
  },
  change: function(element,classOut,classIn){
    if (element) {
      if (classOut) {
        if (element.classList.contains(classOut)) {
          element.classList.remove(classOut);
        }
      }
      if (classIn) {
        if (element.classList.contains(classIn) != true) {
          element.classList.add(classIn);
        }
      }
      // properties.log("properties.change | " + query);
    } else {
      // properties.log("!! properties.change | query not specified or not valid");
    }
  }
}