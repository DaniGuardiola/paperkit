/**
 * Core namespace initialization.
 * Sets window.md
 */
(function() {
  "use strict";
  if (window === undefined) {
    console.error("PK [core] Window is undefined. What are you doing? It is the weirdest thing that ever happened to a web framework! D: I'm scared");
  } else {
    window.md = {};
    console.log(window.md);
  }
}());
