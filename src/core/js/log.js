/**
 * API log
 */
(function() {
  "use strict";
  if (window.md === undefined) {
    console.error("PK [log] Paperkit was not found!");
    return;
  }

  /**
   * API options
   * @type {Object}
   */
  var options = {
    banner: "PK ",
    style: " font-family: Roboto, Arial; font-size: 13px; font-weight: 600;",
    types: {
      default: "log",
      log: {
        color: "#000",
        mode: "log",
        on: true
      },
      error: {
        color: "#F44336",
        mode: "error",
        on: true
      },
      warn: {
        color: "#F57F17",
        mode: "warn",
        on: true
      },
      info: {
        color: "#0D47A1",
        mode: "info",
        on: true
      }
    }
  };


  /*
    function awesome() {
      console.log("test");
    }
    Object.defineProperties(awesome, {
      "options": {
        "value": {
          "beAwesome": true
        }
      }
    });

    var someObject = {};
    var awesome = true;
    Object.defineProperty(someObject, {
      "set": function(newValue) {
        awesome = newValue;
      },
      "get": function() {
        return awesome;
      }
    });
  */

  /**
   * Log API main function
   * @param  {string} what The text to show on console
   * @param  {string} type The type/level of log
   * @param  {object} opt  Options with top priority
   */
  md.log = function(what, type, opt) {
    // Sanity checks
    if (!what) {
      this.log("[log] The \"what\" parameter is required", "error");
      return false;
    }
    if (typeof what !== "string") {
      this.log("[log] The \"what\" parameter must be string, it is " + typeof what + " instead", "error");
      return false;
    }
    type = type || "log";
    opt = opt || {};
    if (!options.types[type]) {
      this.log("[log] Type \"" + type + "\" not found, switching to \"log\"", "warn");
      type = "log";
    }

    // Getting configuration
    var option = options.types[type];
    var banner = opt.banner || option.banner || options.banner;
    var color = opt.color || option.color || options.color;
    var style = opt.style || option.style || options.style;
    var mode = opt.mode || option.mode || options.mode;
    if (!console[mode]) {
      this.log("[log] Mode \"" + mode + "\" not available on console object, switching to \"log\"", "warn");
      mode = "log";
    }
    console[mode]("%c" + banner + what, "color: " + color + ";" + style);
  };
  Object.defineProperties(md.log, {
    "options": {
      "get": function() {
        return options;
      }
    }
  });
})();
