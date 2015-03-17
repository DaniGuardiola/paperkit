(function() {
  "use strict";
  var aVariable = "awesome";

  function test() {
    //something
  }

  function anotherTest() {
    //something
  }

  function againAnotherTest() {
    //something
  }



  if (window.md === undefined) {
    console.error("Please load core before something");
  } else {
    return {
      "someTest": test,
      "someOtherTest": anotherTest,
      "againSomeOtherTest": againAnotherTest,
      "a": aVariable
    };
  }
})();
