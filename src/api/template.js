/**
 * MODULE template
 */
(function() {
  "use strict";

  // Sanity check
  if (window.md === undefined) {
    console.error("PK [log] Paperkit was not found!");
    return;
  }

  /**
   * Options (optional)
   * @type {Object}
   */
  var options = {
    option1: "default1",
    option2: true,
    option2: false,
    more: {
      "whatever": true
    }
  };

  /**
   * Options getter
   * @return {object} Read only options object
   */
  function getOptions() {
    var readonly = Object.create(options);
    return readonly;
  }

  /**
   * Main function (md.template()) (optional)
   * Note that md.template can be a function or an object
   * var main = {}; is valid too
   */
  function main(something) {
    // Error handling
    if (!something) {
      md.log("[template] The \"something\" parameter is required", "error");
      return;
    }
    // Functionality
    md.log("[template] I'm just a template!","info");
  }

  /**
   * Method example
   */
  function example() {
    md.log("[template.example] I'm an example method");
  }

  // 
  Object.defineProperties(main, {
    "type": {
      "value": "module"
    },
    "core": {
      "value": true
    },
    "options": {
      "get": getOptions
    },
    "enable": {
      "value": enable
    },
    "disable": {
      "value": disable
    }
  });

  Object.defineProperty(md, "log", {
    "value": log
  });
  md.module.list = "log";

  // Debug! TEMPORAL!
  enable("info");
  enable("debug");

  log("[log] Module loaded", "info");
})();
