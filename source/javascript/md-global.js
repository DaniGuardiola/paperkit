var initGlobalMDFunctions = function(MDElement, paperkit) {
  /* Paperkit object */
  MDElement.paperkit = paperkit;
  /* True if element is already initialized */
  MDElement.alreadyInitialized = true;

  /**
   * Changes  a value of a property, supporting multiple value properties;
   * If oldvalue is null, it adds the new value. If oldvalue is set, then
   * it's replaced by new value.
   *
   * @param  {string} property Property name.
   * @param  {string} oldvalue Old value to replace.
   * @param  {string} newvalue New value to set.
   */
  MDElement.changeProperty = function(property, oldvalue, newvalue) {
    var attribute = this.getAttribute(property);

    if (attribute) {
      var values = attribute.split(' ');
      var oldvalueIndex = values.indexOf(oldvalue);

      if (oldvalueIndex >= 0) {
        values.splice(oldvalueIndex, 1, newvalue);
      }

      if (newvalue) {
        values.push(newvalue);
      }

      this.setAttribute(property, values.join(' '));
    }
  }

  /**
   * Generates aleatory unique id
   * @return {string} Aleatory unique id
   */
  MDElement.makeId = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  /**
   * Calls a user function, setting window as context.
   *
   * @param  {string} f      function name
   * @param  {array}  target parameters pased to function. in this case the target of the event.
   */
  MDElement.callUserFunction = function(functionName, params) {
    console.log("Calling user function " + functionName);
    executeFunctionByName(functionName, window, params);
  }
}
