// TODO: add tags to be able to filter
"use strict";

/**
 * Module (core) - Taking over the console log!
 *
 * Function: [md.log(message, mode, opt)]{@link md.log~main}
 * 
 * Modes available:
 *
 * - log (default)
 * - debug
 * - info
 * - error
 * - warn
 * - dir
 *
 * Mode filters:
 * 
 * - [md.log.enable]{@link md.log.enable}
 * - [md.log.disable]{@link md.log.disable}
 *
 * Options (readonly): [md.log.options]{@link md.log.options}
 *
 * @example
 * md.log("Hi, I'm a warning!", "warn");
 * @namespace md.log
 *
 * 
 * @author [Dani Guardiola]{@link http://daniguardiola.me/}
 * @license [Apache-2.0]{@link http://www.apache.org/licenses/LICENSE-2.0}
 * @version 0.0.1
 */

md.include({
  "type": "module",
  "name": "log",
  "core": true
}, /** @lends md.log */ function() {
  /**
   * Log options
   * 
   * @memberOf md.log
   * @type {Object}
   * @readOnly
   */
  var options = {
    banner: "PK",
    style: "font-family: Roboto, Arial; font-size: 13px; font-weight: 600;",
    timestamp: false,
    types: {
      default: "log",
      log: {
        color: "#000",
        mode: "log",
        on: true
      },
      debug: {
        color: "#000",
        mode: "debug",
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
      },
      dir: {
        mode: "dir"
      }
    }
  };

  /**
   * Main function, published as md.log(message, type, opt)
   *
   * Logs a message
   * @param  {string} message The text to show on console
   * @param  {string} type The type/level of log
   * @param  {object} opt  Options with top priority
   */
  var main = function(message, type, opt) {
    type = type || "log";
    opt = opt || {};
    var timestamp = options.timestamp ? " [" + (Date.now() - md._loadTimestamp_) + "ms]" : "";

    // Error handling
    if (!message) {
      main("[log] The \"message\" parameter is required", "error");
      return;
    }
    if (typeof message !== "string" && type !== "dir") {
      main("[log] The \"message\" parameter must be string, it is " + typeof what + " instead", "error");
      return;
    }
    if (!options.types[type]) {
      main("[log] Type \"" + type + "\" not found, switching to \"" + options.types.default+"\"", "warn");
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
      main("[log] Mode \"" + mode + "\" not available on console object, switching to \"log\"", "warn");
      mode = "log";
    }
    if (mode === "dir") {
      console.dir(message);
      return;
    }
    if (options.types.debug.on && window.printStackTrace) {
      var file = printStackTrace()[4].match(/(\w+)(\.\w+)+(?!.*(\w+)(\.\w+)+):([0-9]+):([0-9]+)/g);
      message = message + "  |  " + file.join();
    }


    console[mode]("%c" + banner + " " + message + timestamp, "color: " + color + "; " + style);
  };


  /**
   * Enables a mode
   * 
   * @memberOf md.log
   * @param  {String} level Mode
   */
  function enable(level) {
    if (!level) {
      main("[log.enable] No level was specified", "error");
      return;
    }
    if (level === "timestamp") {
      options.timestamp = true;
      main("[log.enable] Timestamp enabled", "info");
      return;
    }
    if (!options.types[level]) {
      main("[log.enable] Level \"" + level + "\" does not exists", "error");
      return;
    }
    options.types[level].on = true;
    main("[log.enable] Level \"" + level + "\" was enabled", "info");
  }

  /**
   * Disables a mode
   * @memberOf md.log
   * @param  {String} level Mode
   */
  function disable(level) {
    if (!level) {
      main("[log.disable] No level was specified", "error");
      return;
    }
    if (level === "timestamp") {
      options.timestamp = false;
      main("[log.disable] Timestamp disabled", "info");
      return;
    }
    if (!options.types[level]) {
      main("[log.disable] Level \"" + level + "\" does not exists", "error");
      return;
    }

    options.types[level].on = false;
    main("[log.disable] Level \"" + level + "\" was disabled", "info");
  }

  // Definition
  Object.defineProperties(main, {
    "options": {
      "get": function() {
        return Object.create(options);
      }
    },
    "enable": {
      "value": enable
    },
    "disable": {
      "value": disable
    }
  });

  // Debug!
  enable("info");
  enable("timestamp");
  enable("debug");
  enable("dir");

  return main;
});
