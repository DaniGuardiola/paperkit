// Standalone version code start
if (window.md === undefined) {
  console.error("PK [log] Paperkit was not found!");
  throw "Stopped module load";
}
// Standalone version code end

/**
 * MODULE log
 */
md.module.queue({
  "name": "log",
  "core": true
}, function() {
  "use strict";
  /**
   * Options
   * @type {Object}
   */
  var options = {
    banner: "PK",
    style: "font-family: Roboto, Arial; font-size: 13px; font-weight: 600;",
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
   * Main function
   * @param  {string} message The text to show on console
   * @param  {string} type The type/level of log
   * @param  {object} opt  Options with top priority
   */
  function main(message, type, opt) {
    // Error handling
    if (!message) {
      main("[log] The \"message\" parameter is required", "error");
      return;
    }
    if (typeof message !== "string" && type !== "dir") {
      main("[log] The \"message\" parameter must be string, it is " + typeof what + " instead", "error");
      return;
    }
    type = type || "log";
    opt = opt || {};
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
    console[mode] = console[mode];
    console[mode]("%c" + banner + " " + message, "color: " + color + "; " + style);
  }


  // Methods
  function enable(level) {
    if (!level) {
      main("[log.enable] No level was specified", "error");
      return;
    }
    if (!options.types[level]) {
      main("[log.enable] Level \"" + level + "\" does not exists", "error");
      return;
    }
    options.types[level].on = true;
    main("[log.enable] Level \"" + level + "\" was enabled", "info");
  }

  function disable(level) {
    if (!level) {
      main("[log.disable] No level was specified", "error");
      return;
    }
    if (!options.types[level]) {
      main("[log.disable] Level \"" + level + "\" does not exists", "error");
      return;
    }
    options.types[level].on = false;
    main("[log.disable] Level \"" + level + "\" was disabled", "info");
  }

  Object.defineProperties(main, {
    "options": {
      "get": function() {
        return Object.freeze(options);
      }
    },
    "enable": {
      "value": enable
    },
    "disable": {
      "value": disable
    }
  });

  // Debug! TEMPORAL!
  enable("info");
  enable("debug");
  enable("dir");

  return main;
});
