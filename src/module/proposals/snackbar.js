/**
 * Creates a snackbar
 * @param  {string|object} what Text to show or options object
 * @param  {number} time If what is text, sets the timeout
 */
md.snackbar = function(what, time) {
    "use strict";
    // Sanity checks
    if (!what) {
        md.log.error("[md.snackbar] The \"what\" parameter is required");
        return false;
    }
    if (!(typeof what === "string" || typeof what === "object")) {
        md.log.error("[md.snackbar] The \"what\" parameter must be string or object, it is " + typeof what + " instead");
        return false;
    }
    console.log("Worked!");
    what = time;
}