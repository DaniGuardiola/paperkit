/*
 * synonyms.js - PhantomJS script to get term definitions from Synonyms service
 *
 * Receives term to search as parameter.
 * Returns JSON string containing the result:
 *   {
 *     terms: [ <term>, <term>, ... ],            // list of terms returned, should be only one?
 *     origins: [ <origin>, <origin>, ...]          // list of origins of term, should be only one?
 *     definitions: [ <definition>, <definition>, ... ],  // list of definitions of term
 *     expressions: [                   // list of term associated expressions
 *       {
 *         expression: <expression>,            // expression
 *         definitions: [ <definition>, <definition>, ... ] // list of definitions of expression
 *       }, ...
 *     ]
 *   }
 *
 * Result code:
 *   0 - Term found and processed correctly
 *   1 - Term parameter not found
 *   2 - Timeout (5 seconds) found when accessing page.
 *   3 - Ambiguous term found.
 *   4 - Unknown term found.
 *   5 - Unknown response from web site.
 *
 */
var system = require('system');
var page = require('webpage').create();

function waitFor(testFx, onReady, timeOutMillis) {
  var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
    start = new Date().getTime(),
    condition = false,
    interval = setInterval(function() {
      if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
        // If not time-out yet and condition not yet fulfilled
        condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
      } else {
        if (!condition) {
          // If condition still not fulfilled (timeout but condition is 'false')
          console.log("'waitFor()' timeout");
          phantom.exit(2);
        } else {
          // Condition fulfilled (timeout and/or condition is 'true')
          // console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
          typeof(onReady) === "string" ? eval(onReady): onReady(); //< Do what it's supposed to do once the condition is fulfilled
          clearInterval(interval); //< Stop this interval
        }
      }
    }, 250); //< repeat check every 250ms
};

var generateMDColor = function() {
  var colorPaletteDiv = document.querySelector('.color-palette');
  var colorGroups = colorPaletteDiv.querySelectorAll('.color-group');
  var mdObject = {
    type: "import",
    name: "md-colors",
    values: []
  };

  [].forEach.call(colorGroups, function(colorGroup) {
    var ul = colorGroup.querySelector('ul');
    var colorGroupObject = {
      name: "",
      defaultVariant: "",
      variants: []
    };

    [].forEach.call(ul.querySelectorAll('li'), function(li) {
      if (li.classList.contains('main-color')) {
        var name = li.querySelector('span.name').innerText;
        var defaultVariant = li.querySelector('span.shade').innerText;

        colorGroupObject.name = name.toLowerCase().replace(" ", "-");
        colorGroupObject.defaultVariant = defaultVariant.toLowerCase();
      } else {
        var name = li.querySelector('span.shade').innerText;
        var color = li.querySelector('span.hex').innerText;

        var variantObject = {
          name: name.toLowerCase()
        };
        variantObject.value1 = color;

        var style = window.getComputedStyle(li);
        variantObject.value2 = style.color;

        if (name != 'Black' && name != 'White') {
          colorGroupObject.variants.push(variantObject);
        }
      }
    });

    if (colorGroupObject.name != "") {
      mdObject.values.push(colorGroupObject);
    }
  });

  mdObject.values.push({
    name: "black",
    value1: "#000000",
    value2: "#ffffff"
  });

  mdObject.values.push({
    name: "white",
    value1: "#ffffff",
    value2: "rgba(0, 0, 0, 0.87)"
  });
  return mdObject;
}

var args = system.args;
var url = "http://www.google.com/design/spec/style/color.html";
var child = "";

page.open(url, function(status) {
  if (status !== "success") {
    console.log("ERROR!");
  } else {
    var jsonData = page.evaluate(generateMDColor);
    console.log(JSON.stringify(jsonData, null, 2));
    phantom.exit(0);
  }
});
