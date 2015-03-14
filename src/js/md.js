/**
 * Paperkit namespace
 */
var md = {
    // Variables

    // Meta
    /**
     * Paperkit folder path
     * @type {String}
     */
    path: "",
    /**
     * Array of load callback functions
     * @type {Array}
     */
    onload: [],
    options: {},

    // Functions
    /**
     * Adds a function to the load callback
     * @param  {function} what Function to add
     */
    onLoad: function(what) {
        "use strict";
        var i;
        if (what.constructor === Array) {
            for (i = what.length - 1; i >= 0; i--) {
                md.onLoad(what[i]);
            }
        } else if (what.nodeType) {
            md.onload.push(what);
        }
    },
    /**
     * Loads the framework
     * @param  {function} callback Fires when load is completed
     */
    load: function(callback) {
        "use strict";
        callback = callback || false;
        // Store the Paperkit path
        var script = document.querySelector("script[src*='paperkit.js']");
        md.path = script && script.src ? script.src.substring(0, script.src.indexOf("paperkit.css")) : "";
        // Create modal layer
        if (!document.querySelector("md-greylayer")) {
            document.body.appendChild(document.createElement("md-greylayer"));
        }
        // Init body
        if (!document.body.classList.contains("md-noinit")) {
            md.init(document.body);
        }
        if (callback) {
            callback();
        }
    },

};
