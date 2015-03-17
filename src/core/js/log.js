/**
 * API log
 */
(function() {
  "use strict";

  // Sanity check
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
      debug: {
        color: "#000",
        mode: "log",
        on: true,
        banner: "PK[debug] "
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

  /**
   * Log API main function
   * @param  {string} message The text to show on console
   * @param  {string} type The type/level of log
   * @param  {object} opt  Options with top priority
   */

  function log(message, type, opt) {
    // Error handling
    if (!message) {
      this.log("[log] The \"message\" parameter is required", "error");
      return false;
    }
    if (typeof message !== "string") {
      this.log("[log] The \"message\" parameter must be string, it is " + typeof what + " instead", "error");
      return false;
    }
    type = type || "log";
    opt = opt || {};
    if (!options.types[type]) {
      this.log("[log] Type \"" + type + "\" not found, switching to \"" + options.types.default+"\"", "warn");
      type = options.types.default;
    }
    if (!options.types[type].on) {
      return false;
    }

    // Getting configuration
    var option = options.types[type],
      banner = opt.banner || option.banner || options.banner,
      color = opt.color || option.color || options.color,
      style = opt.style || option.style || options.style,
      mode = opt.mode || option.mode || options.mode;
    if (!console[mode]) {
      this.log("[log] Mode \"" + mode + "\" not available on console object, switching to \"log\"", "warn");
      mode = "log";
    }
    console[mode]("%c" + banner + message, "color: " + color + ";" + style);
  }

  function getOptions() {
    return options;
  }

  Object.defineProperty(log, "options", {
    "get": getOptions
  });

  Object.defineProperty(md, "log", {
    "value": log
  });

  md.log("[log] Loaded", "info");
})();
