/**
 * The code that gets executed at the very end of the core load
 */
(function() {
  "use strict";
  md.load();

  // DEBUG! TEMPORAL!
  md.log("After load:", "debug");
  md.log(md, "dir");
}());
