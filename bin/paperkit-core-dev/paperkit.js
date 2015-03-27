// TODO:
// - Add error constructor
// - Add getInfo() or similar, as a general method
//   and as alias (getter) on modules and components
// - Add dependence functionality to modules
// - Find solution to hint message "possible strict violation"
// - Refactor including
// - Document everything
// - Add component functionality
// - Review error checking
// - Maybe md.load doesn't have to be public


// [CORE]
// The Paperkit core resides on the
// [md namespace]{@link md} and includes:
// - Module engine
// - Component engine
// - Including - loading paperkit blocks
// - Events - fired in window. List: md-core-module-load, md-core-component-load,
//            md-core-load, md-module-load, md-component-load, md-load and md-ready
// - Load tasks - the initial setup of the framework


// Everything runs inside this immediate function
( /** @lends md */ function() {
  "use strict";
  // Just in case...
  if (window === undefined) {
    console.error("PK [core] Window is undefined. What are you doing? This is the weirdest thing that ever happened to a web framework! D: I'm scared");
    return;
  }
  // Get this script
  var paperkitScript = document.currentScript || document.querySelector("script[src$=\"paperkit.js\"]") || document.querySelector("script[paperkit]") || false;
  // Load core when this script loads
  if (paperkitScript) {
    paperkitScript.addEventListener("load", function() {
      setTimeout(load, 0); // The setTimeout makes it async
    });
  } else {
    console.error("PK [core] Please add \"paperkit\" attribute to the Paperkit script tag, or use \"paperkit.js\" as filename");
    return;
  }

  /**
   * Paperkit main namespace, ships with the public core
   * functions and holds the included modules and components.
   * @description The core is the most important part
   * of the framework. It defines the main logic and
   * provides an interface for managing:
   * 
   * - Modules
   * 
   * - Components
   * 
   * - Inclusions - the load of paperkit blocks
   * 
   * - Events - fired in window. List: md-core-module-load, md-core-component-load,
   * md-core-load, md-module-load, md-component-load, md-load and md-ready
   *            
   * - Framework loading - the initial setup
   * @author [Dani Guardiola]{@link http://daniguardiola.me/}
   * @license [Apache-2.0]{@link http://www.apache.org/licenses/LICENSE-2.0}
   * @version 0.0.1
   * @namespace md
   * @global
   */
  var md = {};

  // [CORE SETUP, STATE AND LOAD]

  /**
   * List of core modules.
   * @alias md.module.core
   * @type {Array}
   * @readOnly
   */
  var coreModules = ["log"];

  /**
   * List of core modules pending load.
   * @type {Array}
   * @private
   */
  var coreModulesPending = coreModules.slice(); // Copy coreModules

  /**
   * List of core components.
   * @alias md.component.core
   * @type {Array}
   * @readOnly
   */
  var coreComponents = [];

  /**
   * List of core components pending load.
   * @type {Array}
   * @private
   */
  var coreComponentsPending = coreComponents.slice();

  /**
   * Initial timestamp in ms.
   * @type {Number}
   * @name _loadTimestamp_
   * @memberOf md
   * @readOnly
   * @constant
   * @private
   */
  Object.defineProperty(md, "_loadTimestamp_", {
    "value": Date.now()
  });

  /**
   * Manages the framework load state.
   * @type {Object}
   * @private
   */
  var state = {
    coreModule: false,
    coreComponent: false,
    core: false,
    module: false,
    component: true, // temporally true for testing, change to false
    paperkit: false
  };

  /**
   * Initial code execution when the core.
   * file has been loaded into memory
   * @private
   */
  function load() {
    includeAll(); // Processing blocks included with <md-include>
  }


  // [INCLUDE]
  // Block inclusion system

  /**
   * Includes a paperkit block, routing it.
   * to the appropiate loader
   * @param {Object} options Block options
   * @param {Function} block Function that returns the block
   * @memberOf md
   * @todo Finish example
   * @example
   * // Module
   * md.include({ // Block options as first parameter
   *   "type": "module", // required
   *   "name": "moduleName", // will be available under md.moduleName
   *   "core": true, // only on core modules
   *   "dependencies": { // only if there are dependencies
   *      "module": [],
   *      "component": []
   *   },
   *   "someOption": "someValue" // other options
   * }, function(){ // function that defines and returns the module as second parameter
   *   var main = {}; // or function(){} // module definition
   *   var method1 = function(){}; // a module method
   *   Object.defineProperties(main, whatever); // registers module properties and methods
   *   return main; // returns the module
   * });
   * 
   * // Component
   * md.include({ // Block options as first parameter
   *   "type": "component", // required
   *   "name": "moduleName", // will be available under md.moduleName
   *   "core": true, // only on core modules
   *   "dependencies": { // only if there are dependencies
   *      "module": [],
   *      "component": []
   *   },
   *   "someOption": "someValue" // other options
   * }, function(){ // function that defines and returns the module as second parameter
   *   var main = {}; // or function(){} // module definition
   *   var method1 = function(){}; // a module method
   *   Object.defineProperties(main, whatever); // registers module properties and methods
   *   return main; // returns the module
   * });
   * 
   * // Attribute
   * md.include({ // Block options as first parameter
   *   "type": "module", // required
   *   "name": "moduleName", // will be available under md.moduleName
   *   "core": true, // only on core modules
   *   "dependencies": { // only if there are dependencies
   *      "module": [],
   *      "component": []
   *   },
   *   "someOption": "someValue" // other options
   * }, function(){ // function that defines and returns the module as second parameter
   *   var main = {}; // or function(){} // module definition
   *   var method1 = function(){}; // a module method
   *   Object.defineProperties(main, whatever); // registers module properties and methods
   *   return main; // returns the module
   * });
   * @throws If options is not defined or empty
   * @throws If block type is not specified inside options
   */
  function include(options, definition) {
    definition = definition || false;
    // Error checking
    if (!options || typeof options !== "object" || options.length < 1) {
      md.log("[include] Invalid or empty options object", "error");
      return;
    }
    if (!options.type) {
      md.log("[include] Block type not specified", "error");
      return;
    }

    /**
     * A paperkit block object can be an attribute, a component or a module.
     * @typedef {Object} blockObject
     * @property {Object} options - Contains the block options.
     * @property {Function} definition - Returns the constructed block
     *                                 (optional on attributes).
     */

    var blockObject = { // Creating the block object
      "options": options,
      "definition": definition
    };
    if (options.type === "module") { // Routing
      //includeModule(blockObject);
      md.log("I was gonna include a module");
    } else if (options.type === "component") {
      md.log("I was gonna include a component");
      //includeComponent(blockObject);
    } else if (options.type === "attribute") {
      md.log("I was gonna include an attribute");
      //includeAttribute(blockObject);
    } else {
      md.log("[include] Invalid block type \"" + options.type + "\"", "error");
    }
  }

  /**
   * Gets all md-include elements from the DOM.
   * and passes them to includeTag()
   * @private
   */
  function includeAll() {
    var elements = document.querySelectorAll("md-include");
    if (elements.length < 1) {
      md.log("[core] No <md-include> tags were found", "info");
      return;
    }
    for (var i = 0; i < elements.length; i++) {
      includeTag(elements[i]);
    }
  }

  /**
   * Routes a md-include element to the appropiate.
   * method depending on its type (script or stylesheet)
   * @param  {Node} element A md-include element
   * @private
   */
  function includeTag(element) {
    var src = element.getAttribute("src");
    // Error checking
    if (!element.hasAttribute("src") || src === "") {
      md.log("[include] Src tag empty or not set in md-include tag", "error");
      return;
    }
    if (src.indexOf(".js") !== -1) {
      includeScript(element);
    } else if (src.indexOf(".css") !== -1) {
      include({
        "type": "attribute",
        "name": "todo: get name somehow",
        "src": src
      });
    }
  }

  /**
   * Includes a script file (paperkit block).
   * @param  {Node} element A md-include element
   * @private
   */
  function includeScript(element) {
    var script = document.createElement("script");
    script.src = element.getAttribute("src");
    loadingScripts.push(script);
    document.body.appendChild(script);
    script.addEventListener("load", function() {
      scriptOnload(script, moduleLoad);
    });
    document.body.removeChild(script);
  }

  // [MODULES]
  // A module looks like this:
  // md.include({ // Block options as first parameter
  //   "type": "module", // required
  //   "name": "moduleName", // will be available under md.moduleName
  //   "core": true, // only on core modules
  //   "dependencies": { // only if there are dependencies
  //      "module": [],
  //      "component": []
  //   },
  //   "someOption": "someValue" // other options
  // }, function(){ // function that defines and returns the module as second parameter
  //   var main = {}; // or function(){} // module definition
  //   var method1 = function(){}; // a module method
  //   Object.defineProperties(main, whatever); // registers module properties and methods
  //   return main; // returns the module
  // });

  /**
   * List of available modules.
   * @type {Array}
   * @memberOf md.module
   * @readOnly
   * @alias list
   */
  var moduleList = [];

  /**
   * List of modules in queue.
   * @type {Array}
   * @private
   */
  var moduleQueueList = [];

  /**
   * Module engine namespace. For the function, see [md.module]{@link md.module(2)}.
   * @memberOf md
   * @namespace module
   * @see md.module(2)
   * @todo Document as module
   */

  /**
   * Checks if a module is available, and optionally
   * returns its meta options. For the namespace, see {@link md.module}.
   * @param  {String} name Module name
   * @param {Boolean} verbose If true, returns the meta options instead of boolean
   * @return {Boolean|Object} True or meta options objects if module
   *                               is available, false if not available
   * @see {@link md.module}
   * @memberOf md
   * @variation 2
   * @example
   * md.module("log"); // true
   * md.module("fakeModule"); // false
   * md.module("log", true); // {<module block options>}
   * md.module("fakeModule", true); // false
   */
  function module(name, verbose) {
    var exists = (moduleList.indexOf(name) > -1);
    if (!exists) {
      return false;
    }
    if (verbose) {
      return md[name]._mdOptions_;
    }
    return true;
  }

  // Defining module list getter
  Object.defineProperty(module, "list", {
    "get": function() {
      return moduleList;
    }
  });

  /**
   * Loads a module if specified or loads queue if not
   * @param  {blockObject} moduleObj  A module object, if not specified
   *                             the queue will load
   * @param  {Boolean} recurrent If true next item in queue will be loaded too
   * @private
   * @todo Make an example
   */
  function moduleLoad(moduleObj, recurrent) {
    recurrent = recurrent || false;
    if (moduleObj) { // If moduleObj exists
      // moduleObj checks
      if (typeof moduleObj !== "object" || typeof moduleObj.options !== "object" || typeof moduleObj.function !== "function") {
        md.log("[module] Not valid module object", "error");
        return false;
      }

      // Module load
      var name = moduleObj.options.name; // The module name is on "name" var
      var module = moduleObj.function(); // The module returned is on "module" var
      var core = moduleObj.options.core ? "core:" : "";
      // Filling defaults for optional options
      moduleObj.options.dependencies = moduleObj.options.dependencies || [];
      // Defining md options on module
      Object.defineProperty(module, "_mdOptions_", {
        "get": function() {
          return Object.create(moduleObj.options);
        }
      });
      // Defining the module on md namespace
      Object.defineProperty(md, name, {
        "value": module
      });
      moduleList.push(name); // Attach to module list
      if (md.module("log")) {
        md.log("[" + core + "module] LOAD " + name, "info");
      }

      // If recurrent, load next one
      if (recurrent) {
        moduleLoad();
      }
    } else {
      var next = moduleQueueList[0];
      if (next && typeof next.function === "function") {
        // Module queue if not empty
        moduleQueueList.splice(0, 1);
        moduleLoad(next, true);
      } else {
        dispatchModuleLoadEvent();
      }
    }
  }

  /**
   * Checks if there's no pending core modules to load,
   * and dispatchs md-core-module-load event if true
   * @private
   */
  function coreModuleLoadCheck() {
    if (coreModulesPending.length < 1 && !loadStatus.coreModule) {
      dispatchCoreModuleLoadEvent();
    }
  }

  /**
   * Checks if there's no pending modules to load,
   * and dispatchs md-module-load event if true
   * @private
   */
  function moduleLoadCheck() {
    if (moduleQueueList.length < 1 && !loadStatus.module) {
      dispatchCoreModuleLoadEvent();
      if (coreComponents.length < 1) {
        dispatchCoreLoadEvent();
      }
    }
  }

  /**
   * Includes a module
   * @param  {Object} options        Module options
   * @param  {Function} moduleFunction Function that defines and returns the module
   * @private
   * @todo Rename to "includeModule" and write an example
   */
  function moduleInclude(options, moduleFunction) {
    moduleQueue(options, moduleFunction);
  }

  /**
   * Adds a module to the queue
   * @param  {Object} moduleObj A module definition object
   * @private
   * @todo Write an example
   */
  function moduleQueue(moduleObj) {
    if (options.core) {
      var i = coreModulesPending.indexOf(options.name);
      if (i !== -1) {
        moduleLoad(moduleObj);
        coreModulesPending.splice(i, 1);
        coreModuleLoadCheck();
        return;
      } else {
        options.core = false;
        md.log("[module.queue:" + options.name + "] Marked as core module, but not allowed", "warn");
      }
    }
    if (!options.dependencies || options.dependencies.length < 0) {
      moduleLoad(moduleObj);
      return;
    }
    moduleQueueList.push(moduleObj);
  }

  /**
   * State of the queue
   * @return {String} The state of the queue ("empty" or "n pending")
   * @private
   */
  function getQueueState() {
    var state = "empty";
    if (moduleQueueList.length > 0) {
      state = moduleQueueList.length + " pending";
    }
    return state;
  }


  // [COMPONENTS]

  var componentList = [];

  function component(input) {
    return componentList.indexOf(input) > -1;
  }

  Object.defineProperty(component, "list", {
    "get": function() {
      return componentList;
    },
    "set": function(value) {
      componentList.push(value);
    }
  });

  // [EVENTS]

  function dispatchCoreLoadEvent() {
    md.log("[core] LOAD COMPLETE", "info");
    loadStatus.core = true;
    var loadEvent = new Event("md-core-load");
    window.dispatchEvent(loadEvent);
  }

  function dispatchCoreModuleLoadEvent() {
    md.log("[core:module] LOAD COMPLETE", "info");
    loadStatus.coreModule = true;
    var loadEvent = new Event("md-core-module-load");
    window.dispatchEvent(loadEvent);
    if (loadStatus.coreComponent) {
      dispatchCoreLoadEvent();
    }
  }

  function dispatchModuleLoadEvent() {
    md.log("[module] LOAD COMPLETE", "info");
    loadStatus.module = true;
    var loadEvent = new Event("md-module-load");
    window.dispatchEvent(loadEvent);
    if (loadStatus.core && loadStatus.component) {
      dispatchLoadEvent();
    }
  }

  /*
  function dispatchComponentLoadEvent() {
    md.log("[component] LOAD COMPLETE", "info");
    loadStatus.component = true;
    var loadEvent = new Event("md-component-load");
    window.dispatchEvent(loadEvent);
    if (loadStatus.core && loadStatus.module) {
      dispatchLoadEvent();
    }
  }
  */

  function dispatchLoadEvent() {
    md.log("[paperkit] LOAD COMPLETE", "info");
    loadStatus.paperkit = true;
    var loadEvent = new Event("md-load");
    window.dispatchEvent(loadEvent);
  }

  // Garbage

  // Script loading
  var loadingScripts = [];
  var loadingScriptsEnd = false;

  function scriptOnload(script, callback) {
    var i = loadingScripts.indexOf(script);
    loadingScripts.splice(i, 1);
    if (loadingScripts.length < 1 && loadingScriptsEnd && callback) {
      callback();
    }
  }

  // [PROPERTY DEFINITION]
  Object.defineProperties(md, {
    "include": {
      "value": include
    },
    "module": {
      "value": module
    },
    "component": {
      "value": component
    }
  });

  // Defines md on global object (window)
  Object.defineProperty(window, "md", {
    "value": md
  });

  // [FALLBACKS]
  // Log
  md.log = function(message, mode) {
    mode = mode || "log";
    if (!message) {
      md.log("PK [log] No message specified");
      return false;
    }
    if (!console[mode]) {
      mode = "log";
    }
    console[mode]("PK " + message);
  };
}());

// TODO: add tags to be able to filter
/**
 * MODULE log
 */
md.include({
  "type": "module",
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
   * Main function
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
      console.dir(message + timestamp);
      return;
    }
    if (mode === "error" && window.printStackTrace) {
      console.log(window.printStackTrace());
    }


    console[mode]("%c" + banner + " " + message + timestamp, "color: " + color + "; " + style);
  };


  // Methods
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
