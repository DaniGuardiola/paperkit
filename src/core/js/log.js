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
  // End

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
        on: false,
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
        on: false
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
      log("[log] The \"message\" parameter is required", "error");
      return;
    }
    if (typeof message !== "string") {
      log("[log] The \"message\" parameter must be string, it is " + typeof what + " instead", "error");
      return;
    }
    type = type || "log";
    opt = opt || {};
    if (!options.types[type]) {
      log("[log] Type \"" + type + "\" not found, switching to \"" + options.types.default+"\"", "warn");
      type = options.types.default;
    }
    if (!options.types[type].on) {
      return;
    }

    // Getting configuration
    var option = options.types[type],
      banner = opt.banner || option.banner || options.banner,
      color = opt.color || option.color || options.color,
      style = opt.style || option.style || options.style,
      mode = opt.mode || option.mode || options.mode;
    if (!console[mode]) {
      log("[log] Mode \"" + mode + "\" not available on console object, switching to \"log\"", "warn");
      mode = "log";
    }
    console[mode]("%c" + banner + message, "color: " + color + ";" + style);
  }

  function getOptions() {
    var readonly = Object.create(options); // Is this the best way to make properties inside options readonly?
    return readonly;
  }

  function enable(level) {
    if (!level) {
      log("[log.enable] No level was specified", "error");
      return;
    }
    if (!options.types[level]) {
      log("[log.enable] Level \"" + level + "\" does not exists", "error");
      return;
    }
    options.types[level].on = true;
    log("[log.enable] Level \"" + level + "\" was enabled", "info");
  }

  function disable(level) {
    if (!level) {
      log("[log.disable] No level was specified", "error");
      return;
    }
    if (!options.types[level]) {
      log("[log.disable] Level \"" + level + "\" does not exists", "error");
      return;
    }
    options.types[level].on = false;
    log("[log.disable] Level \"" + level + "\" was disabled", "info");
  }

  Object.defineProperties(log, {
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

  // Debug! TEMPORAL!
  enable("info");
  enable("debug");

  log("[log] Loaded", "info");
})();
