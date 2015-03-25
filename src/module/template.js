//standalone-start TODO: move to separate folder and include automatically with grunt
if (window.md === undefined) {
  throw "PK [template] Paperkit was not found!";
}
//standalone-end
// TODO:
// - Document everything!
// - Consider adding another parameter as a load callback
/**
 * MODULE template
 * Does this and that blahblah
 */
// md.module.queue(options, function)
md.module.queue({ // Add to queue
  "name": "template",
  "core": true, // Only if part of the core
  "dependencies": { // Optional, you must set it if using non-core modules or components
    "modules": [],
    "components": []
  }
}, function() { // Constructs the module and returns it
  "use strict";

  /**
   * Options (optional)
   * @type {object}
   */
  // TODO: include options in the code as example
  var options = { // Set default values
    option1: "default1",
    option2: true,
    option3: false,
    more: {
      "whatever": true
    }
  };

  /**
   * Main function or namespace (md.template) (optional)
   * Note that main can be a function or a namespace object:
   * var main = {};
   */

  /**
   * Private variable example
   * Try md.template.privateVariable in the console ;)
   * You can still use them in this context, public methods inclusive
   */
  var privateVariable = "[template => privateVariable] I'm an private variable, you can " +
    "only see and use me from inside this module's function!";

  /**
   * Private method example
   * Try md.template.privateMethod() in the console ;)
   * You can still use them in this context, public methods inclusive
   */
  function privateMethod() {
    md.log("[template => privateMethod] I'm an private method, you " +
      "can only run me from inside this module's function!");
  }
  var main = function(something, saywhat) {
    // Default optional parameter values
    saywhat = saywhat || "my second parameter is not set";
    // Error handling - optional but recommended
    if (!something) {
      md.log("[template] The \"something\" parameter is required", "error");
      return;
    }
    if (typeof something !== "string") {
      md.log("[template] The \"something\" parameter must be a string", "error");
      return;
    }
    if (typeof saywhat !== "string") {
      md.log("[template] The \"saywhat\" parameter must be a string", "error");
      return;
    }
    // Functionality
    md.log("[template] Did you say " + something + "?", "warn");
    md.log("[template] Let me tell you that " + saywhat + "!");
    md.log("[template] I'm just a template!", "info");
  };

  /**
   * Method example
   */
  function method() {
    md.log("[template.method] I'm an example method");
    privateMethod(); // Calling a private method
    md.log(privateVariable); // Accesing a private variable
  }

  // We set the public properties
  // Remember you can define private methods
  // just by not publishing them below
  Object.defineProperties(main, {
    "options": {
      "get": function() {
        return Object.create(options); // This way is read-only
      }
    },
    "method": {
      "value": method
    }
  });

  return main; // Finally, we return the module
});
