// Standalone version code start
if (window.md === undefined) {
  throw "PK [template] Paperkit was not found!";
}
// Standalone version code end

var PAPERKIT_MODULE_template = true;

/**
 * MODULE template
 */
md.module.queue({
  "name": "template2",
  "dependencies": ["log"]
}, function() {
  "use strict";


  /**
   * Options (optional)
   * @type {object}
   */
  var options = {
    option1: "default1",
    option2: true,
    option3: false,
    more: {
      "whatever": true
    }
  };

  /**
   * Main function (md.template()) (optional)
   * Note that md.template can be a function or an object
   * var main = {}; is valid too
   */
  var main = function(something) {
    // Error handling
    if (!something) {
      md.log("[template] The \"something\" parameter is required", "error");
      return;
    }
    // Functionality
    md.log("[template] I'm just a template!", "info");
  };

  /**
   * Method example
   */
  function method() {
    md.log("[template.method] I'm an example method");
  }

  // 
  Object.defineProperties(main, {
    "options": {
      "get": function() {
        return Object.freeze(options);
      }
    },
    "method": {
      "value": method
    }
  });
  return main;
});
