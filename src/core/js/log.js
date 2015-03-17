(function() {
  "use strict";
  if (window.md === undefined) {
    console.error("[Paperkit] [log] Paperkit was not found!");
  } else {
    return {
      "someTest": test,
      "someOtherTest": anotherTest,
      "againSomeOtherTest": againAnotherTest,
      "a": aVariable
    };
  }
})();
